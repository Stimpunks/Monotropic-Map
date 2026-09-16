/* map-canvas.js — the map builder, version two.
 *
 * WHAT THIS IS FOR IS DRAWING, NOT ANSWERING. Version one on `stories` asks where you
 * are on Helen's map and works with this kind of script switched off. This one hands
 * over a blank ground instead, and it cannot work without a script — so the whole tool
 * ships `hidden` and is revealed here, the same way theme.js reveals the theme toggle,
 * and `canvas-off` is what a reader without JavaScript is left looking at. A board that
 * will never respond must not be sitting there looking like it will.
 *
 * NOTHING LEAVES THE DEVICE, AND THERE IS NO ROUTE OUT. No fetch, no form, no mailto.
 * `_headers` ships `connect-src 'self'` and `form-action 'none'` and nothing here wants
 * either. What you draw is kept in this browser and nowhere else.
 *
 * NO COUNTS, NO SCORE, NO READOUT. A canvas invites numbers — how many pieces, how
 * large, how much of the map the whirlpool has taken — and `DECISIONS.md` puts it
 * plainly: the moment the site emits a number it is a quiz. Position is said in words
 * ("upper left", "the middle"), size is "bigger" and "smaller", and nothing here reads
 * a map back to the person who drew it.
 *
 * THE VOCABULARY IS NOT REPEATED HERE. Not one shape, not one name, not one of the
 * twenty. Every drawing was written into the page once by build.mjs from
 * tools/shapes.mjs, and this file copies one out when it needs it and reads the names
 * off the tray buttons — exactly as my-map.js reads the four marks back out of the DOM.
 *
 * COPIED RATHER THAN <use>d, deliberately. A <use> draws its reference inside a shadow
 * tree, and how reliably custom properties inherit into one varies by engine. Every
 * colour here is a custom property, so the failure mode is the entire tray in solid
 * black, and that is not worth leaving to an engine detail that cannot be tested from
 * one browser. A copy inherits its colours the way the rest of the page does.
 *
 * EVERY PIECE IS MOVED BY A `transform` ATTRIBUTE, never a `style` attribute, and every
 * colour is a class. `style-src 'self'` blocks inline styles and that is not a thing to
 * work around: it is why the first live deploy stacked all twenty map hotspots in one
 * corner while looking perfect locally.
 *
 * Storage can throw — a private window, blocked site data — so every read and write is
 * guarded and the tool works, unremembered, when it does.
 */
(function () {
  "use strict";

  var SVGNS = "http://www.w3.org/2000/svg";
  var KEY = "mm-canvas";

  var root = document.getElementById("map-canvas");
  var stage = document.getElementById("canvas-pieces");
  if (!root || !stage) return;

  var canvas = document.getElementById("canvas-stage");
  var say = document.getElementById("canvas-say");
  var off = document.getElementById("canvas-off");
  var shapeBtns = [].slice.call(root.querySelectorAll(".shapebtn"));
  var placeBtns = [].slice.call(root.querySelectorAll(".placebtn"));

  /* The stage's own coordinates, read off the element rather than repeated here. */
  var box = (canvas.getAttribute("viewBox") || "0 0 1000 720").split(/\s+/);
  var W = parseFloat(box[2]) || 1000;
  var H = parseFloat(box[3]) || 720;

  var pieces = [];
  var selected = null;
  var dropAt = 0;

  /* ---- what the page already knows --------------------------------------- */

  var SHAPE = {};
  shapeBtns.forEach(function (b) {
    SHAPE[b.getAttribute("data-shape")] = {
      name: b.getAttribute("data-name") || b.getAttribute("data-shape"),
      tone: b.getAttribute("data-tone") || "",
      back: b.getAttribute("data-back") === "yes",
      size: parseFloat(b.getAttribute("data-size")) || 1,
    };
  });
  var PLACE = {};
  placeBtns.forEach(function (b) {
    PLACE[b.getAttribute("data-place")] = {
      name: b.getAttribute("data-name") || "",
      tone: b.getAttribute("data-tone") || "",
    };
  });

  /* ---- words, not numbers ------------------------------------------------- */

  /* Where a piece is, said the way a person would say it. A coordinate readout would
     be a number, and a number is the thing this site does not emit. */
  function whereWords(x, y) {
    var col = x < W / 3 ? "left" : (x > (2 * W) / 3 ? "right" : "centre");
    var row = y < H / 3 ? "upper" : (y > (2 * H) / 3 ? "lower" : "middle");
    if (row === "middle" && col === "centre") return "the middle";
    if (col === "centre") return row === "upper" ? "top centre" : "bottom centre";
    return row + " " + col;
  }

  function speak(message) { say.textContent = message; }

  /* ---- placing ------------------------------------------------------------ */

  function place(p) {
    p.el.setAttribute(
      "transform",
      "translate(" + p.x.toFixed(1) + " " + p.y.toFixed(1) + ")" +
        (p.r ? " rotate(" + p.r + ")" : "") +
        " scale(" + (p.s * p.fx).toFixed(3) + " " + p.s.toFixed(3) + ")"
    );
    p.el.setAttribute("aria-label", p.name + ", " + whereWords(p.x, p.y) + ".");
    /* A name set to the right of its marker runs off the right-hand edge, so over
       there it goes on the other side of the number instead. */
    var nm = p.el.querySelector(".nm");
    if (nm) {
      var other = p.x > W * 0.58;
      nm.setAttribute("x", other ? "-34" : "34");
      nm.setAttribute("text-anchor", other ? "end" : "start");
    }
  }

  function select(p) {
    selected = p;
    pieces.forEach(function (q) {
      var ring = q.el.querySelector(".ring");
      if (ring) ring.setAttribute("opacity", q === p ? "1" : "0");
    });
    ["bigger", "smaller", "turn", "flip", "remove"].forEach(function (id) {
      var b = document.getElementById("canvas-" + id);
      if (b) b.disabled = !p;
    });
  }

  /* A copy of one of the drawings build.mjs wrote into the page. The id is dropped
     with it — an id is unique to the original, and fifty copies of "sh-tent" would be
     fifty broken references. */
  function drawing(key) {
    var src = document.getElementById("sh-" + key);
    if (!src) return null;
    var copy = src.cloneNode(true);
    copy.removeAttribute("id");
    return copy;
  }

  function el(name, attrs) {
    var e = document.createElementNS(SVGNS, name);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    return e;
  }

  function makePiece(kind, key, x, y, s, r, fx) {
    var g = el("g", { "class": "piece", tabindex: "0", role: "button" });
    g.setAttribute("aria-roledescription", "Movable piece");
    var name;

    if (kind === "shape") {
      var sh = SHAPE[key];
      if (!sh) return null;
      name = sh.name;
      if (sh.tone) g.setAttribute("data-tone", sh.tone);
      g.setAttribute("data-shape", key);
      var art = drawing(key);
      if (!art) return null;
      g.appendChild(art);
      g.appendChild(el("circle", { "class": "ring", r: "112", opacity: "0" }));
    } else {
      var pl = PLACE[key];
      if (!pl) return null;
      name = key + ". " + pl.name;
      if (pl.tone) g.setAttribute("data-tone", pl.tone);
      g.setAttribute("data-place", key);
      g.appendChild(el("circle", { "class": "f-card s-tone", r: "24", "stroke-width": "4" }));
      var n = el("text", { "class": "f-fg", x: "0", y: "8", "text-anchor": "middle", "font-size": "22", "font-weight": "700" });
      n.textContent = key;
      g.appendChild(n);
      var nm = el("text", { "class": "nm f-fg", x: "34", y: "8", "font-size": "21" });
      nm.textContent = pl.name;
      g.appendChild(nm);
      g.appendChild(el("circle", { "class": "ring", r: "38", opacity: "0" }));
    }

    var p = { el: g, kind: kind, key: key, name: name, x: x, y: y, s: s, r: r || 0, fx: fx || 1 };
    pieces.push(p);
    stage.appendChild(g);
    place(p);
    wire(p);
    return p;
  }

  function point(e) {
    var pt = canvas.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(canvas.getScreenCTM().inverse());
  }

  function wire(p) {
    var g = p.el;

    g.addEventListener("pointerdown", function (e) {
      select(p);
      try { g.setPointerCapture(e.pointerId); } catch (err) {}
      g.setAttribute("data-held", "yes");
      var start = point(e), ox = p.x, oy = p.y, moved = false;

      function move(ev) {
        var q = point(ev);
        p.x = Math.max(10, Math.min(W - 10, ox + (q.x - start.x)));
        p.y = Math.max(10, Math.min(H - 10, oy + (q.y - start.y)));
        moved = true;
        place(p);
      }
      function up() {
        g.removeAttribute("data-held");
        g.removeEventListener("pointermove", move);
        g.removeEventListener("pointerup", up);
        g.removeEventListener("pointercancel", up);
        if (moved) { speak(p.name + " — " + whereWords(p.x, p.y) + "."); save(); }
        g.focus({ preventScroll: true });
      }
      g.addEventListener("pointermove", move);
      g.addEventListener("pointerup", up);
      g.addEventListener("pointercancel", up);
      e.preventDefault();
    });

    g.addEventListener("focus", function () { select(p); });

    g.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 40 : 12, moved = true;
      if (e.key === "ArrowLeft") p.x = Math.max(10, p.x - step);
      else if (e.key === "ArrowRight") p.x = Math.min(W - 10, p.x + step);
      else if (e.key === "ArrowUp") p.y = Math.max(10, p.y - step);
      else if (e.key === "ArrowDown") p.y = Math.min(H - 10, p.y + step);
      else if (e.key === "+" || e.key === "=") { e.preventDefault(); resize(p, 1.18); return; }
      else if (e.key === "-" || e.key === "_") { e.preventDefault(); resize(p, 1 / 1.18); return; }
      else if (e.key === "[") { e.preventDefault(); turn(p, -15); return; }
      else if (e.key === "]") { e.preventDefault(); turn(p, 15); return; }
      else if (e.key === "f" || e.key === "F") { e.preventDefault(); mirror(p); return; }
      else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); drop(p); return; }
      else moved = false;
      if (!moved) return;
      e.preventDefault();
      place(p);
      speak(p.name + " — " + whereWords(p.x, p.y) + ".");
      save();
    });
  }

  function resize(p, by) {
    var next = p.s * by;
    if (next > 4) { speak(p.name + " is as big as it goes."); return; }
    if (next < 0.25) { speak(p.name + " is as small as it goes."); return; }
    p.s = next;
    place(p);
    speak(p.name + (by > 1 ? " — bigger." : " — smaller."));
    save();
  }

  /* A numbered place carries a number and a name, and a number on its head is not a
     number any more. So turning and flipping are for shapes, and the tool says why
     rather than appearing to ignore the button. */
  function turn(p, by) {
    if (p.kind !== "shape") { speak("A numbered place stays the right way up."); return; }
    p.r = ((p.r || 0) + by + 360) % 360;
    place(p);
    speak(p.name + " — turned.");
    save();
  }

  function mirror(p) {
    if (p.kind !== "shape") { speak("A numbered place stays the right way round."); return; }
    p.fx = p.fx * -1;
    place(p);
    speak(p.name + " — flipped.");
    save();
  }

  function drop(p) {
    if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
    pieces = pieces.filter(function (q) { return q !== p; });
    if (selected === p) select(null);
    speak(p.name + " taken off the map.");
    markPlaced();
    save();
  }

  function add(kind, key) {
    disarm();
    var sh = kind === "shape" ? SHAPE[key] : null;
    var back = !!(sh && sh.back);
    /* Something stamped in exactly the same spot as the last one looks like nothing
       happened, so each lands a little off the one before. Ground is the exception:
       it belongs in the middle, underneath. */
    dropAt = (dropAt + 1) % 6;
    var x = back ? W / 2 : W / 2 + (dropAt - 2.5) * 46;
    var y = back ? H / 2 : H / 2 + ((dropAt % 3) - 1) * 54;
    var p = makePiece(kind, key, x, y, sh ? sh.size : 1, 0, 1);
    if (!p) return;
    /* Ground goes under. A background that arrives on top of the map is a background
       the person has to fix before they can carry on. */
    if (back) stage.insertBefore(p.el, stage.firstChild);
    p.el.focus({ preventScroll: true });
    select(p);
    speak(p.name + " added, " + whereWords(x, y) + ". Drag it, or use the arrow keys.");
    markPlaced();
    save();
  }

  /* The tray dims a place already on the map. Dimmed, not removed and not counted:
     it is a reminder, not a tally. */
  function markPlaced() {
    placeBtns.forEach(function (b) {
      var n = b.getAttribute("data-place");
      var on = pieces.some(function (p) { return p.kind === "place" && p.key === n; });
      b.setAttribute("data-placed", on ? "yes" : "no");
    });
  }

  /* ---- the tray ----------------------------------------------------------- */

  shapeBtns.forEach(function (b) {
    var key = b.getAttribute("data-shape");
    var prev = b.querySelector(".shapeprev");
    if (prev && !prev.firstChild) {
      var art = drawing(key);
      if (art) prev.appendChild(art);
    }
    b.addEventListener("click", function () { add("shape", key); });
  });
  placeBtns.forEach(function (b) {
    b.addEventListener("click", function () { add("place", b.getAttribute("data-place")); });
  });

  /* ---- the bar ------------------------------------------------------------ */

  function onClick(id, fn) {
    var b = document.getElementById("canvas-" + id);
    if (b) b.addEventListener("click", fn);
    return b;
  }

  onClick("bigger", function () { if (selected) resize(selected, 1.18); });
  onClick("smaller", function () { if (selected) resize(selected, 1 / 1.18); });
  onClick("turn", function () { if (selected) turn(selected, 15); });
  onClick("flip", function () { if (selected) mirror(selected); });
  onClick("remove", function () { if (selected) drop(selected); });

  /* Clearing asks twice, in the page. `window.confirm` is suppressed in a sandboxed
     frame and hands back false, which makes the button look broken; and asking here
     puts the warning where a screen reader is already listening. */
  var clearBtn = document.getElementById("canvas-clear");
  var armed = false;
  var armTimer = null;

  function disarm() {
    armed = false;
    window.clearTimeout(armTimer);
    if (clearBtn) clearBtn.textContent = "Clear the map";
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (!pieces.length) { disarm(); speak("The map is already blank."); return; }
      if (!armed) {
        armed = true;
        clearBtn.textContent = "Clear it — sure?";
        speak("Press again to take everything off the map. Nothing else is lost, and you can build it back up.");
        armTimer = window.setTimeout(disarm, 8000);
        return;
      }
      disarm();
      pieces.slice().forEach(function (p) { if (p.el.parentNode) p.el.parentNode.removeChild(p.el); });
      pieces = [];
      select(null);
      markPlaced();
      speak("A blank ground again.");
      save();
    });
  }

  /* ---- remembering, guarded ------------------------------------------------ */

  /* Saved in drawing order rather than the order things were added, so the island
     comes back underneath the map instead of on top of it. */
  function save() {
    try {
      var byEl = [].slice.call(stage.childNodes).map(function (node) {
        for (var i = 0; i < pieces.length; i++) if (pieces[i].el === node) return pieces[i];
        return null;
      }).filter(Boolean);
      localStorage.setItem(KEY, JSON.stringify(byEl.map(function (p) {
        return {
          k: p.kind, i: p.key,
          x: Math.round(p.x), y: Math.round(p.y),
          s: Number(p.s.toFixed(3)), r: p.r || 0, f: p.fx === -1 ? 1 : 0,
        };
      })));
    } catch (e) {}
  }

  function restore() {
    var saved;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return; }
    if (!Array.isArray(saved)) return;
    saved.forEach(function (rec) {
      if (!rec || typeof rec !== "object") return;
      if (rec.k === "shape" && !SHAPE[rec.i]) return;
      if (rec.k === "place" && !PLACE[rec.i]) return;
      if (rec.k !== "shape" && rec.k !== "place") return;
      makePiece(rec.k, rec.i,
        Math.max(10, Math.min(W - 10, Number(rec.x) || W / 2)),
        Math.max(10, Math.min(H - 10, Number(rec.y) || H / 2)),
        Math.max(0.25, Math.min(4, Number(rec.s) || 1)),
        Number(rec.r) || 0, rec.f ? -1 : 1);
    });
  }

  /* ---- go ------------------------------------------------------------------ */

  root.hidden = false;
  if (off) off.hidden = true;

  restore();
  select(null);
  markPlaced();
  if (pieces.length) speak("Your map, as you left it.");
})();
