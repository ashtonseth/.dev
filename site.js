(function () {
  "use strict";

  function initializeTheme() {
    var root = document.documentElement;
    var button = document.getElementById("theme-button");
    var icon = document.getElementById("theme-icon");
    if (!button || !icon) return;

    var explicitTheme = root.dataset.theme;
    if (explicitTheme !== "light" && explicitTheme !== "dark") explicitTheme = null;
    var systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

    function synchronizeTheme() {
      var theme = explicitTheme || (systemTheme.matches ? "dark" : "light");
      var action = theme === "dark" ? "light" : "dark";
      icon.innerHTML = theme === "dark"
        ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>'
        : '<path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"/>';
      button.setAttribute("aria-label", "Switch to " + action + " theme");
      button.title = "Switch to " + action + " theme";
      var background = window.getComputedStyle(root).getPropertyValue("--bg").trim();
      document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
        meta.setAttribute("content", background);
      });
    }

    button.addEventListener("click", function () {
      var currentTheme = explicitTheme || (systemTheme.matches ? "dark" : "light");
      explicitTheme = currentTheme === "dark" ? "light" : "dark";
      root.dataset.theme = explicitTheme;
      try { localStorage.setItem("theme", explicitTheme); } catch (error) { /* Keep this page's choice. */ }
      synchronizeTheme();
    });

    function onSystemChange() {
      if (!explicitTheme) synchronizeTheme();
    }
    if (systemTheme.addEventListener) systemTheme.addEventListener("change", onSystemChange);
    else if (systemTheme.addListener) systemTheme.addListener(onSystemChange);

    synchronizeTheme();
    button.hidden = false;
  }

  initializeTheme();
}());
