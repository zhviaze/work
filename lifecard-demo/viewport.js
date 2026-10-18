/* Match the visible Safari viewport, including toolbar and keyboard changes. */
(() => {
  const root = document.documentElement;
  const content = document.getElementById('app-content');
  const viewport = window.visualViewport;
  let frame;
  function update() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      // Preserve normal pinch zoom rather than reflowing the app while zooming.
      if (viewport && Math.abs(viewport.scale - 1) > 0.01) return;
      root.style.setProperty('--app-viewport-height', `${viewport ? viewport.height : innerHeight}px`);
      const active = document.activeElement;
      if (content.contains(active) && active.matches('input,select,textarea')) {
        active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });
  }
  new ResizeObserver(() => {
    content.style.setProperty('--wallet-content-height', `${content.clientHeight}px`);
  }).observe(content);
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
  viewport?.addEventListener('resize', update);
  content.addEventListener('focusin', update);
  update();
})();
