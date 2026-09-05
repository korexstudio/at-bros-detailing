import type { GalleryManifest } from "./types";

/**
 * The gallery manifest. The maintainer grows the gallery by dropping photos
 * into public/gallery/ and registering them here.
 *
 * Export photos as WebP sized to their largest rendered edge (~1600px).
 * Phone shots are portrait: mark them `aspect: "portrait"` so the compare
 * sliders frame the whole photo instead of cropping a landscape band.
 *
 * `isPlaceholder: true` entries never count as real work; the reveal-wipe
 * showpiece renders only when `hasRealBeforeAfters()` is true.
 */
export const galleryManifest: GalleryManifest = {
  beforeAfters: [
    {
      id: "camaro-interior",
      before: "/gallery/camaro-interior-before.webp",
      after: "/gallery/camaro-interior-after.webp",
      alt: "Chevrolet Camaro passenger footwell and seat — debris-strewn carpet and dusty dash, then vacuumed and conditioned",
      service: "interior-detail",
      aspect: "portrait",
      isPlaceholder: false,
    },
    {
      id: "sedan-quarter",
      before: "/gallery/sedan-quarter-before.webp",
      after: "/gallery/sedan-quarter-after.webp",
      alt: "Grey sedan rear quarter panel and roof — dust film and dull paint, then a clear gloss reflecting the trees",
      service: "exterior-detail",
      aspect: "portrait",
      isPlaceholder: false,
    },
    {
      id: "camaro-front",
      before: "/gallery/camaro-front-before.webp",
      after: "/gallery/camaro-front-after.webp",
      alt: "Red Chevrolet Camaro hood and front fender — dusty, faded finish, then deep candy-red gloss",
      service: "exterior-detail",
      aspect: "portrait",
      isPlaceholder: false,
    },
  ],
  finishedCars: [],
};

/** Real (non-placeholder) Before/After pairs — the honesty gate for the reveal wipe. */
export function realBeforeAfters() {
  return galleryManifest.beforeAfters.filter((p) => !p.isPlaceholder);
}

export function hasRealBeforeAfters(): boolean {
  return realBeforeAfters().length > 0;
}
