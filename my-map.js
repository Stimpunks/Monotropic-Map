/* my-map.js — My Monotropic Map, version one.
 *
 * WHAT THIS ADDS IS REMEMBERING, NOT MARKING. The twenty controls are real radio
 * buttons and they work with this file switched off; a person with no JavaScript can
 * still fill the page in and print it. What is enhancement: the marks persisting, the
 * legend assembling itself, the map showing what you said, and the print/copy/send
 * buttons — which is why those buttons ship `hidden` and are revealed here, the same
 * way theme.js reveals the theme toggle. A control that needs a script must not be
 * visible before the script has run.
 *
 * NOTHING LEAVES THE DEVICE, AND THERE IS NO ROUTE OUT AT ALL. No fetch, no form, and
 * no mailto — `_headers` ships `connect-src 'self'` and `form-action 'none'`, and this
 * file adds nothing that would want them. Copy puts the legend on the clipboard and the
 * person decides what to do with it; the page never addresses anybody.
 *
 * NO COUNTS ANYWHERE, deliberately. See MARKS in tools/build.mjs: a tally is a number
 * and a number makes this a quiz. What you have not reached yet is shown by name under
 * "Not said yet", never as "8 of 20".
 *
 * THE VOCABULARY IS NOT REPEATED HERE. Every label is read back out of the DOM that
 * build.mjs generated, so there is exactly one place the four marks are written down.
 *
 * Storage can throw — a private window, blocked site data — so every read and write is
 * guarded and the tool works, unremembered, when it does.
 */
(function () {
  "use strict";

  var KEY = "mm-my-map";
  var root = document.getElementById("my-monotropic-map");
  if (!root) return;

  var legend = document.getElementById("my-legend");
  var status = document.getElementById("legend-status");
  var empty = legend.querySelector(".legend-empty");
  var rows = [].slice.call(root.querySelectorAll(".markrow"));
  var spots = [].slice.call(root.querySelectorAll(".hotspots a[data-area]"));

  /* slug -> the marker on the picture, and slug -> its printed name. */
  var spotFor = {};
  spots.forEach(function (a) { spotFor[a.getAttribute("data-area")] = a; });

  function nameOf(row) {
    var a = row.querySelector(".markrow-name");
    return a ? a.textContent.trim() : row.getAttribute("data-area");
  }
  function numberOf(row) {
    var n = row.querySelector(".markrow-n");
    return n ? n.textContent.trim() : "";
  }
  /* The label for a mark, taken from the radio the build generated. One source. */
  function labelFor(value) {
    var g = legend.querySelector('.legend-g[data-mark="' + value + '"] h4');
    return g ? g.textContent.trim() : value;
  }

  function read() {
    var out = {};
    rows.forEach(function (row) {
      var slug = row.getAttribute("data-area");
      var picked = row.querySelector('input[type="radio"]:checked');
      out[slug] = picked ? picked.value : "";
    });
    return out;
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function restore() {
    var saved;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return; }
    if (!saved || typeof saved !== "object") return;
    rows.forEach(function (row) {
      var slug = row.getAttribute("data-area");
      var value = saved[slug];
      if (typeof value !== "string") return;
      var input = row.querySelector('input[type="radio"][value="' + value.replace(/"/g, "") + '"]');
      if (input) input.checked = true;
    });
  }

  /* The picture repeats what the list says. Colour is never the only channel: the
     marker also carries its mark in its accessible name, because "the blue one" is
     not information a screen reader or a colourblind reader can use. */
  function paintMap(state) {
    rows.forEach(function (row) {
      var slug = row.getAttribute("data-area");
      var spot = spotFor[slug];
      if (!spot) return;
      var value = state[slug] || "";
      spot.setAttribute("data-mark", value);
      var sr = spot.querySelector(".sr");
      if (sr) sr.textContent = ". " + nameOf(row) + ". " + labelFor(value);
    });
  }

  function buildLegend(state) {
    var anyMarked = false;
    var groups = [].slice.call(legend.querySelectorAll(".legend-g"));

    groups.forEach(function (g) {
      var value = g.getAttribute("data-mark");
      var list = g.querySelector("ul");
      list.textContent = "";
      var found = 0;
      rows.forEach(function (row) {
        var slug = row.getAttribute("data-area");
        if ((state[slug] || "") !== value) return;
        found++;
        if (value) anyMarked = true;
        var li = document.createElement("li");
        var num = document.createElement("span");
        num.className = "legend-n";
        num.textContent = numberOf(row);
        var a = document.createElement("a");
        a.href = slug + ".html";
        a.textContent = nameOf(row);
        li.appendChild(num);
        li.appendChild(a);
        list.appendChild(li);
      });
      g.hidden = found === 0;
    });

    /* Before anything is marked, "Not said yet" holding all twenty is noise rather
       than information, so the legend says so in a sentence instead. */
    if (!anyMarked) {
      groups.forEach(function (g) { g.hidden = true; });
    }
    empty.hidden = anyMarked;
    return anyMarked;
  }

  /* The legend as plain text, for the clipboard and for the mail body. Same shape as
     the page, so what a person sends is what they saw. */
  function asText(state) {
    var lines = ["My Monotropic Map", "https://monotropicmap.org/stories", ""];
    legend.querySelectorAll(".legend-g").forEach(function (g) {
      var value = g.getAttribute("data-mark");
      var names = rows.filter(function (row) {
        return (state[row.getAttribute("data-area")] || "") === value;
      });
      if (!names.length) return;
      lines.push(labelFor(value));
      names.forEach(function (row) { lines.push("  " + numberOf(row) + ". " + nameOf(row)); });
      lines.push("");
    });
    lines.push("Map of Monotropic Experiences by Helen Edgar, CC BY-SA 4.0.");
    return lines.join("\n");
  }

  var printBtn = document.getElementById("legend-print");
  var copyBtn = document.getElementById("legend-copy");
  var clearBtn = document.getElementById("legend-clear");

  function say(message) {
    status.textContent = message;
    if (message) window.setTimeout(function () { status.textContent = ""; }, 4000);
  }

  function refresh(persist) {
    var state = read();
    if (persist) save(state);
    paintMap(state);
    var anyMarked = buildLegend(state);

    [printBtn, copyBtn, clearBtn].forEach(function (b) { if (b) b.hidden = !anyMarked; });
  }

  root.addEventListener("change", function (e) {
    if (e.target && e.target.type === "radio") refresh(true);
  });

  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

  if (copyBtn) copyBtn.addEventListener("click", function () {
    var text = asText(read());
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { say("Legend copied."); },
        function () { say("Could not copy — your browser blocked it."); }
      );
    } else {
      say("Could not copy — your browser blocked it.");
    }
  });

  if (clearBtn) clearBtn.addEventListener("click", function () {
    if (!window.confirm("Clear every mark on your map? This cannot be undone.")) return;
    rows.forEach(function (row) {
      var none = row.querySelector('input[type="radio"][value=""]');
      if (none) none.checked = true;
    });
    refresh(true);
    say("Every mark cleared.");
  });

  restore();
  refresh(false);
})();
