/* map.js — the picture/list switcher on the home page.
   PROGRESSIVE ENHANCEMENT, AND THAT IS THE WHOLE POINT. Both views are in the
   markup and both are visible with no JavaScript, because the list is not a
   fallback — it is the other front door, for anyone who cannot point precisely
   at a cartoon island or cannot see it at all. This script only collapses the
   two into a switcher once it is certain it can switch them back. */
(function () {
  var sw = document.querySelector(".viewswitch");
  var map = document.getElementById("view-map");
  var list = document.getElementById("view-list");
  if (!sw || !map || !list) return;

  var buttons = Array.prototype.slice.call(sw.querySelectorAll("button[data-view]"));
  if (buttons.length !== 2) return;

  /* `persist` is only true when a person actually pressed a button. Saving on the
     initial render would turn our own width-based default into a stored preference
     the reader never expressed — and then the narrow-screen default could never
     apply again in that browser. */
  function show(which, persist) {
    map.hidden = which !== "map";
    list.hidden = which !== "list";
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.view === which));
    });
    if (persist) { try { localStorage.setItem("mm-view", which); } catch (e) {} }
  }

  /* On a narrow screen the picture starts collapsed, because at 350px the labels
     printed on the artwork are not legible and no marker size fixes that. The
     switcher is right there; this is a default, not a decision made for anyone. */
  var start = window.innerWidth < 700 ? "list" : "map";
  try {
    var saved = localStorage.getItem("mm-view");
    if (saved === "map" || saved === "list") start = saved;
  } catch (e) {}

  sw.hidden = false;
  show(start, false);

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { show(b.dataset.view, true); });
  });
})();
