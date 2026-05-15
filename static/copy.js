// Copy-to-clipboard for:
//   - install command and donate addresses (data-copy attribute)
//   - every <pre> block inside .manual (button injected on load)

(function () {
  function flashCopied(btn) {
    var original = btn.textContent;
    btn.classList.add("copied");
    btn.textContent = "copied";
    setTimeout(function () {
      btn.classList.remove("copied");
      btn.textContent = original;
    }, 1200);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } finally { document.body.removeChild(ta); }
    return Promise.resolve();
  }

  // Inject a "copy" button into every <pre> block inside the manual.
  // Hover reveals the button; click flashes "copied" for 1.2s.
  function injectPreButtons() {
    var pres = document.querySelectorAll(".manual pre");
    pres.forEach(function (pre) {
      if (pre.querySelector(".pre-copy")) return;
      var btn = document.createElement("button");
      btn.className = "pre-copy";
      btn.type = "button";
      btn.setAttribute("aria-label", "Copy");
      btn.textContent = "copy";
      pre.appendChild(btn);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectPreButtons);
  } else {
    injectPreButtons();
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".install-copy, .donate-copy, .pre-copy");
    if (!btn) return;
    var text;
    if (btn.classList.contains("pre-copy")) {
      var pre = btn.closest("pre");
      var code = pre.querySelector("code") || pre;
      // textContent picks up the code; the button's own text gets
      // stripped because it lives outside the <code> children.
      text = code.textContent.replace(/\s+$/, "");
    } else {
      var container = btn.closest("[data-copy]");
      text = container ? container.getAttribute("data-copy") : null;
      if (!text) {
        var prev = btn.previousElementSibling;
        if (prev && prev.matches("[data-copy]")) text = prev.getAttribute("data-copy");
      }
    }
    if (!text) return;
    copyText(text).then(function () { flashCopied(btn); });
  });
})();
