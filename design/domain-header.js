/* Shared sticky-header clearance; static links and CSS remain usable without JS. */
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.domain-header');
  if (!header) return;
  let height = -1;
  let scheduled = false;
  let checkFragment = false;
  let checkFocus = false;

  function measure() {
    const next = Math.ceil(header.getBoundingClientRect().height);
    if (next !== height) {
      height = next;
      root.style.setProperty('--domain-header-height', `${height}px`);
    }
  }

  function fragmentTarget() {
    if (!window.location.hash) return null;
    let id = window.location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch (_) { /* Retain an undecodable ID. */ }
    return document.getElementById(id);
  }

  function reveal(target, explicit) {
    if (!target || target === root || target === document.body ||
        !target.getBoundingClientRect || header.contains(target) ||
        target.closest('.skip-link')) return;
    const rect = target.getBoundingClientRect();
    const clearance = Math.max(0, header.getBoundingClientRect().bottom) + 12;
    // A size change may protect an intersecting control; it must not restore an
    // old skip target or pull an offscreen former focus back after manual scroll.
    if (!explicit && (!(target.tabIndex >= 0 || target.isContentEditable) ||
        rect.bottom <= 0 || rect.top >= window.innerHeight ||
        rect.height > Math.max(0, window.innerHeight - clearance))) return;
    if (rect.top < clearance) {
      window.scrollBy({ top: rect.top - clearance, left: 0, behavior: 'instant' });
    }
  }

  function schedule(fragment = false, focus = false) {
    checkFragment = checkFragment || fragment;
    checkFocus = checkFocus || focus;
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      measure();
      const target = checkFragment ? fragmentTarget() : document.activeElement;
      const explicit = checkFragment || checkFocus;
      checkFragment = false;
      checkFocus = false;
      reveal(target, explicit);
    });
  }

  measure();
  if ('ResizeObserver' in window) new window.ResizeObserver(() => schedule()).observe(header);
  window.addEventListener('resize', () => schedule(), { passive: true });
  document.addEventListener('focusin', () => schedule(false, true));
  window.addEventListener('hashchange', () => schedule(true));
  window.addEventListener('load', () => schedule(true), { once: true });
  schedule(true);
})();
