import type { GalleryManifest } from "./types";

/**
 * The gallery manifest. The maintainer grows the gallery by dropping photos
 * into public/gallery/ and registering them here.
 *
 * Placeholder entries are clearly marked (`isPlaceholder: true`) and are
 * replaced by real exports before launch (launch gate: at least three real
 * Before/After pairs). Sections that demand real work — the reveal-wipe
 * showpiece — render only when `hasRealBeforeAfters()` is true.
 */
export const galleryManifest: GalleryManifest = {
  beforeAfters: [
    {
      id: "placeholder-interior-1",
      before: "/gallery/placeholder-before-1.svg",
      after: "/gallery/placeholder-after-1.svg",
      alt: "Placeholder — Interior Detail Before/After, replaced by real work at launch",
      service: "interior-detail",
      isPlaceholder: true,
    },
    {
      id: "placeholder-exterior-1",
      before: "/gallery/placeholder-before-2.svg",
      after: "/gallery/placeholder-after-2.svg",
      alt: "Placeholder — Exterior Detail Before/After, replaced by real work at launch",
      service: "exterior-detail",
      isPlaceholder: true,
    },
  ],
  finishedCars: [
    {
      id: "placeholder-finished-1",
      src: "/gallery/placeholder-finished-1.svg",
      alt: "Placeholder — finished car glamour shot, replaced by a real photo at launch",
      service: "full-detail",
      isPlaceholder: true,
    },
    {
      id: "placeholder-finished-2",
      src: "/gallery/placeholder-finished-2.svg",
      alt: "Placeholder — finished car glamour shot, replaced by a real photo at launch",
      service: "clay-and-seal",
      isPlaceholder: true,
    },
  ],
};

/** Real (non-placeholder) Before/After pairs — the honesty gate for the reveal wipe. */
export function realBeforeAfters() {
  return galleryManifest.beforeAfters.filter((p) => !p.isPlaceholder);
}

export function hasRealBeforeAfters(): boolean {
  return realBeforeAfters().length > 0;
}
