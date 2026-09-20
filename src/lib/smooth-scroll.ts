/** Height of the fixed header, so an anchor lands just below it. */
const HEADER_OFFSET = -64;

type LenisLike = {
  scrollTo(target: HTMLElement, options?: { offset?: number }): void;
};

/**
 * Scroll to an in-page section. Under full motion the Lenis instance
 * (exposed by MotionLayer) eases there; otherwise the browser's own smooth
 * scroll does, or an instant jump when the visitor prefers reduced motion.
 */
export function scrollToId(id: string, reduced: boolean): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
  if (lenis && !reduced) {
    lenis.scrollTo(el, { offset: HEADER_OFFSET });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }
  history.replaceState(null, "", `#${id}`);
  return true;
}
