/* theme.js — light/dark, loaded from <head> without defer so the theme lands
   before first paint. Storage can throw (private window, blocked site data), so
   every read and write is guarded and the page renders correctly without it. */
(function () {
  var KEY = "mm-theme";
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) {}

  window.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    function label() {
      var explicit = root.getAttribute("data-theme");
      var dark = explicit ? explicit === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      btn.textContent = dark ? "Light" : "Dark";
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
    label();
    btn.hidden = false;
    btn.addEventListener("click", function () {
      var explicit = root.getAttribute("data-theme");
      var dark = explicit ? explicit === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      label();
    });
  });
})();
