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
  /* The twenty, and not the "?" button — it wears the same class so it looks like one of
     them, and for a while it behaved like one too: every click added a nameless place
     beside the question mark, because this list had adopted it. */
  var placeBtns = [].slice.call(root.querySelectorAll(".placebtn:not(.placebtn-own)"));

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
      /* What to say when a piece moves. One of the twenty is eighty-four characters
         long, and a live region that reads all of it on every arrow press is a live
         region a person turns off. The full name stays on the piece itself, which is
         what a screen reader reads when it lands there. */
      spoken: b.getAttribute("data-short") || b.getAttribute("data-name") || "",
      short: b.getAttribute("data-short") || "",
      tone: b.getAttribute("data-tone") || "",
      back: b.getAttribute("data-back") === "yes",
      size: parseFloat(b.getAttribute("data-size")) || 1,
      angle: parseFloat(b.getAttribute("data-angle")) || 0,
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
      var side = other ? "-34" : "34";
      nm.setAttribute("x", side);
      nm.setAttribute("text-anchor", other ? "end" : "start");
      /* A tspan carries its own x, and a tspan that keeps the old one ignores the flip
         and hangs off the edge of the board. The words of a place of your own are set
         in tspans, so they have to move with it. */
      [].slice.call(nm.querySelectorAll("tspan")).forEach(function (t) { t.setAttribute("x", side); });
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
    /* The writing strip belongs to the "?" pieces and appears only for them. A text box
       that is always there is a text box a person has to work out the purpose of. */
    var strip = document.getElementById("canvas-name");
    if (strip) {
      var own = !!p && p.kind === "own";
      strip.hidden = !own;
      if (own && nameInput) nameInput.value = p.text || "";
    }
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

  /* YOUR WORDS GO IN AS TEXT, ALWAYS. Every one of these is written with textContent and
     never innerHTML: what a person types is their sentence, not markup, and the one way
     to be sure it is never read as markup is never to parse it as any. Sixty characters,
     control characters stripped, and it goes nowhere but this device. */
  var OWN_LIMIT = 60;
  function clean(text) {
    return String(text == null ? "" : text)
      .replace(/[\x00-\x1f\x7f]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, OWN_LIMIT);
  }

  /* Two short lines rather than one long one running off the board. */
  function wrap(text) {
    if (text.length <= 26) return [text];
    var words = text.split(" "), a = "", b = "";
    for (var i = 0; i < words.length; i++) {
      if (!b && (a + " " + words[i]).trim().length <= 26) a = (a + " " + words[i]).trim();
      else b = (b + " " + words[i]).trim();
    }
    return b ? [a, b] : [a];
  }

  function drawOwn(p) {
    var nm = p.el.querySelector(".nm");
    if (!nm) return;
    nm.textContent = "";
    wrap(p.text || "").forEach(function (line, i) {
      var t = el("tspan", { x: "34", dy: i === 0 ? "0" : "24" });
      t.textContent = line;
      nm.appendChild(t);
    });
    /* Unfilled it is a question, and the dashes say so. Filled it is a place, and the
       ring stops asking. */
    var mark = p.el.querySelector(".ownmark");
    if (mark) mark.setAttribute("stroke-dasharray", p.text ? "none" : "6 5");
    p.name = p.text || "An unnamed place of your own";
    p.spoken = p.name;
    place(p);
  }

  function makePiece(kind, key, x, y, s, r, fx, text) {
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
    } else if (kind === "own") {
      name = clean(text) || "An unnamed place of your own";
      g.setAttribute("data-own", "yes");
      g.appendChild(el("circle", { "class": "f-card s-tone ownmark", r: "24", "stroke-width": "4", "stroke-dasharray": "6 5" }));
      var q = el("text", { "class": "f-fg", x: "0", y: "9", "text-anchor": "middle", "font-size": "24", "font-weight": "700" });
      q.textContent = "?";
      g.appendChild(q);
      g.appendChild(el("text", { "class": "nm f-fg", x: "34", y: "8", "font-size": "21" }));
      g.appendChild(el("circle", { "class": "ring", r: "38", opacity: "0" }));
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

    var spoken = kind === "shape" && SHAPE[key] && SHAPE[key].spoken ? SHAPE[key].spoken : name;
    var p = { el: g, kind: kind, key: key, name: name, spoken: spoken, text: clean(text),
              x: x, y: y, s: s, r: r || 0, fx: fx || 1 };
    pieces.push(p);
    stage.appendChild(g);
    place(p);
    if (kind === "own") drawOwn(p);
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
        if (moved) { speak(p.spoken + " \u2014 " + whereWords(p.x, p.y) + "."); record(p.spoken + " moved", "move:" + p.key); }
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
      else if ((e.key === "Enter" || e.key === " ") && p.kind === "own") {
        e.preventDefault();
        if (nameInput) { select(p); nameInput.focus(); nameInput.select(); }
        return;
      }
      else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); drop(p); return; }
      else moved = false;
      if (!moved) return;
      e.preventDefault();
      place(p);
      speak(p.spoken + " \u2014 " + whereWords(p.x, p.y) + ".");
      record(p.spoken + " moved", "move:" + p.key);
    });
  }

  function resize(p, by) {
    var next = p.s * by;
    if (next > 4) { speak(p.spoken + " is as big as it goes."); return; }
    if (next < 0.25) { speak(p.spoken + " is as small as it goes."); return; }
    p.s = next;
    place(p);
    speak(p.spoken + (by > 1 ? " \u2014 bigger." : " \u2014 smaller."));
    record(p.spoken + (by > 1 ? " made bigger" : " made smaller"), "size:" + p.key);
  }

  /* Which way a turned shape now points, in words. "Turned" on its own tells a person
     who cannot see the canvas nothing at all, and degrees would be a number. */
  /* Eight bearings, in the order a turn actually passes through them. A shape is drawn
     running left to right, and the canvas counts y downward, so a quarter turn sends it
     down the map rather than up — getting this list out of order tells a person who
     cannot see the canvas the opposite of what happened. */
  var BEARINGS = ["level", "falling", "down the map", "falling the other way",
                  "level the other way", "rising the other way", "up the map", "rising"];
  /* A piece that came out of the tray already angled carries that angle in its drawing,
     so the bearing is the two added together. */
  function bearing(p) {
    var baked = p.kind === "shape" && SHAPE[p.key] ? SHAPE[p.key].angle : 0;
    return BEARINGS[Math.round((((p.r + baked) % 360) + 360) % 360 / 45) % 8];
  }

  /* A numbered place carries a number and a name, and a number on its head is not a
     number any more. So turning and flipping are for shapes, and the tool says why
     rather than appearing to ignore the button.
     The button turns by an eighth, which reaches all eight bearings in eight presses;
     the bracket keys turn by a fifteenth of a turn, for a coastline that wants to sit
     at an angle of its own. */
  function turn(p, by) {
    if (p.kind !== "shape") { speak(p.kind === "own" ? "Your own place stays the right way up." : "A numbered place stays the right way up."); return; }
    p.r = ((p.r || 0) + by + 360) % 360;
    place(p);
    speak(p.spoken + " \u2014 turned, " + bearing(p) + ".");
    record(p.spoken + " turned", "turn:" + p.key);
  }

  function mirror(p) {
    if (p.kind !== "shape") { speak(p.kind === "own" ? "Your own place stays the right way round." : "A numbered place stays the right way round."); return; }
    p.fx = p.fx * -1;
    place(p);
    speak(p.spoken + " \u2014 flipped.");
    record(p.spoken + " flipped", "flip:" + p.key);
  }

  function drop(p) {
    if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
    pieces = pieces.filter(function (q) { return q !== p; });
    if (selected === p) select(null);
    speak(p.spoken + " taken off the map.");
    markPlaced();
    record(p.spoken + " taken off", null);
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
    speak(p.spoken + " added, " + whereWords(x, y) + ". Drag it, or use the arrow keys.");
    markPlaced();
    record(p.spoken + " added", null);
  }

  /* ---- places of your own --------------------------------------------------- */

  var nameInput = document.getElementById("canvas-name-input");

  function addOwn() {
    disarm();
    dropAt = (dropAt + 1) % 6;
    var x = W / 2 + (dropAt - 2.5) * 46;
    var y = H / 2 + ((dropAt % 3) - 1) * 54;
    var p = makePiece("own", "own", x, y, 1, 0, 1, "");
    if (!p) return;
    p.el.focus({ preventScroll: true });
    select(p);
    speak("A place of your own, " + whereWords(x, y) + ". Write what it is.");
    record("a place of your own added", null);
    if (nameInput) { nameInput.value = ""; nameInput.focus(); }
  }

  function saveWords() {
    if (!selected || selected.kind !== "own" || !nameInput) return;
    var was = selected.text;
    var now = clean(nameInput.value);
    if (now === was) return;
    selected.text = now;
    drawOwn(selected);
    speak(now ? "Named — " + now + "." : "The words cleared. It is a question again.");
    record(now ? "a place named" : "a name cleared", null);
  }

  var ownBtn = document.getElementById("canvas-own");
  if (ownBtn) ownBtn.addEventListener("click", addOwn);
  var saveBtn = document.getElementById("canvas-name-save");
  if (saveBtn) saveBtn.addEventListener("click", saveWords);
  if (nameInput) {
    nameInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); saveWords(); }
      /* Escape gives the board back without writing anything. */
      if (e.key === "Escape" && selected) { e.preventDefault(); nameInput.value = selected.text || ""; selected.el.focus(); }
    });
    nameInput.addEventListener("blur", saveWords);
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
  onClick("turn", function () { if (selected) turn(selected, 45); });
  onClick("flip", function () { if (selected) mirror(selected); });
  onClick("remove", function () { if (selected) drop(selected); });
  onClick("undo", undo);
  onClick("redo", redo);

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
      speak("A blank ground again. Undo brings it back.");
      record("the map cleared", null);
    });
  }

  /* ---- remembering, guarded ------------------------------------------------ */

  /* Read in drawing order rather than the order things were added, so the island
     comes back underneath the map instead of on top of it. */
  function snapshot() {
    var byEl = [].slice.call(stage.childNodes).map(function (node) {
      for (var i = 0; i < pieces.length; i++) if (pieces[i].el === node) return pieces[i];
      return null;
    }).filter(Boolean);
    return byEl.map(function (p) {
      var rec = {
        k: p.kind, i: p.key,
        x: Math.round(p.x), y: Math.round(p.y),
        s: Number(p.s.toFixed(3)), r: p.r || 0, f: p.fx === -1 ? 1 : 0,
      };
      if (p.kind === "own" && p.text) rec.w = p.text;
      return rec;
    });
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state || snapshot())); } catch (e) {}
  }

  /* Build the map back from a list of records — one saved from a previous visit, or a
     step out of the history. Everything is checked on the way in: a shape that no
     longer exists, a coordinate off the board or a size past the limits is dropped or
     clamped rather than trusted. What comes out of storage is data, not instructions,
     and undo comes back through the same door. */
  function rebuild(state) {
    pieces.slice().forEach(function (p) { if (p.el.parentNode) p.el.parentNode.removeChild(p.el); });
    pieces = [];
    (state || []).forEach(function (rec) {
      if (!rec || typeof rec !== "object") return;
      if (rec.k === "shape" && !SHAPE[rec.i]) return;
      if (rec.k === "place" && !PLACE[rec.i]) return;
      if (rec.k !== "shape" && rec.k !== "place" && rec.k !== "own") return;
      makePiece(rec.k, rec.i,
        Math.max(10, Math.min(W - 10, Number(rec.x) || W / 2)),
        Math.max(10, Math.min(H - 10, Number(rec.y) || H / 2)),
        Math.max(0.25, Math.min(4, Number(rec.s) || 1)),
        Number(rec.r) || 0, rec.f ? -1 : 1, rec.w);
    });
    select(null);
    markPlaced();
  }

  function restore() {
    var saved;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return; }
    if (Array.isArray(saved)) rebuild(saved);
  }

  /* ---- undo, redo ----------------------------------------------------------- */

  /* WHOLE-MAP SNAPSHOTS, NOT UNDOABLE COMMANDS. A map is a few dozen small records, so
     keeping a copy of the lot after every change costs nothing — and it cannot get the
     inverse of an operation wrong, which is the whole failure mode of the other
     approach and shows up as a flip that un-flips the wrong way a fortnight later.
     Redrawing from a snapshot goes through the same guarded path a saved map comes
     back through, so there is one way onto the board and it checks what it is given.

     NO STEP COUNT ANYWHERE. Undo says what it undid, by name — "Undone — campfire
     added." It never says how many moves are left, because that is a number, and a
     number would be keeping score of somebody's map. */
  var history = [];
  var at = -1;
  var LIMIT = 60;

  function record(label, runKey) {
    var state = snapshot();
    var now = Date.now();
    /* A run of arrow-key nudges on one piece is one step, not twelve. Same for leaning
       on Bigger: a person means "that got bigger", not eleven separate sizes. */
    if (at >= 0 && runKey && runKey === history[at].run && now - history[at].t < 900) {
      history[at].state = state;
      history[at].label = label;
      history[at].t = now;
    } else {
      history = history.slice(0, at + 1);
      history.push({ state: state, label: label, run: runKey || "", t: now });
      if (history.length > LIMIT) history.shift();
      at = history.length - 1;
    }
    save(state);
    historyButtons();
  }

  function historyButtons() {
    var u = document.getElementById("canvas-undo");
    var r = document.getElementById("canvas-redo");
    if (u) u.disabled = at <= 0;
    if (r) r.disabled = at >= history.length - 1;
  }

  function undo() {
    if (at <= 0) { speak("Nothing to undo."); return; }
    var leaving = history[at];
    at--;
    rebuild(history[at].state);
    save(history[at].state);
    historyButtons();
    speak(leaving.label ? "Undone \u2014 " + leaving.label + "." : "Undone.");
  }

  function redo() {
    if (at >= history.length - 1) { speak("Nothing to redo."); return; }
    at++;
    rebuild(history[at].state);
    save(history[at].state);
    historyButtons();
    speak(history[at].label ? "Redone \u2014 " + history[at].label + "." : "Redone.");
  }

  document.addEventListener("keydown", function (e) {
    if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
    var t = e.target && e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA" || (e.target && e.target.isContentEditable)) return;
    var k = String(e.key).toLowerCase();
    if (k === "z") { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
    else if (k === "y") { e.preventDefault(); redo(); }
  });

  /* ---- go ------------------------------------------------------------------ */

  root.hidden = false;
  if (off) off.hidden = true;

  restore();
  select(null);
  markPlaced();
  /* The map as found is the step everything else undoes back to. */
  record("", null);
  if (pieces.length) speak("Your map, as you left it.");
})();
