// Copy-to-clipboard for install command and donate addresses.
// Picks up any element with [data-copy] (whose text gets copied) or any
// .install-copy / .donate-copy button (which copies the install/addr block
// containing it).

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

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".install-copy, .donate-copy");
    if (!btn) return;
    var container = btn.closest("[data-copy]");
    var text = container ? container.getAttribute("data-copy") : null;
    if (!text) {
      var prev = btn.previousElementSibling;
      if (prev && prev.matches("[data-copy]")) text = prev.getAttribute("data-copy");
    }
    if (!text) return;
    copyText(text).then(function () { flashCopied(btn); });
  });
})();
