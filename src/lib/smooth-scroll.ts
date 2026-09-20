/** Height of the fixed header, so an anchor lands just below it. */
const HEADER_OFFSET = -64;
const DURATION_MS = 900;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Ease the window to `top` frame by frame with instant writes. (The page
 * must not set CSS `scroll-behavior: smooth`: that would turn each write
 * into a browser smooth-scroll that cancels the one before it, and both
 * this and Lenis would crawl or stall.)
 */
function animateWindowScroll(top: number) {
  const start = window.scrollY;
  const distance = top - start;
  const began = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - began) / DURATION_MS);
    window.scrollTo({ top: start + distance * easeOutCubic(t), behavior: "instant" });
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Scroll to an in-page section: an eased animation, or an instant jump
 * when the visitor prefers reduced motion. Lenis (full motion) is left to
 * follow the native scroll events rather than drive this; handing it the
 * animation stalled under load.
 */
export function scrollToId(id: string, reduced: boolean): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
  if (reduced) {
    window.scrollTo({ top, behavior: "instant" });
  } else {
    animateWindowScroll(top);
  }
  history.replaceState(null, "", `#${id}`);
  return true;
}
