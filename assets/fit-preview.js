/* Scales fixed-size label previews down to fit narrow screens.
   Screen only: style.css resets the zoom for print, so printed labels keep their real size.
   Include with <script src="../assets/fit-preview.js" defer></script>. */
(function () {
  const SELECTOR = '.label-card, .label-page, .label-container';
  const main = document.querySelector('.site-main') || document.body;

  function fit() {
    document.querySelectorAll(SELECTOR).forEach(el => {
      // Fit the column the previews sit in (beside the inputs on wide screens)
      const box = el.parentElement;
      const style = getComputedStyle(box);
      const available = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      el.style.zoom = '';
      const width = el.offsetWidth;
      // Hidden elements (width 0) are left alone
      if (width > available) el.style.zoom = available / width;
    });
  }

  let queued = false;
  function queueFit() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fit(); });
  }

  // Labels are re-rendered on every input, so refit whenever the DOM changes
  new MutationObserver(queueFit).observe(main, { childList: true, subtree: true });
  addEventListener('resize', queueFit);
  fit();
})();
