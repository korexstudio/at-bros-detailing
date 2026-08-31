import type { Metadata } from "next";
import { CompareSlider } from "@/components/CompareSlider";
import { galleryManifest, serviceBySlug } from "@/content";

export const metadata: Metadata = {
  title: "Gallery — Before/After and Finished Cars",
  description:
    "Real work on real cars: drag-to-compare Before/After pairs and finished-car photos from AT Bros Detailing.",
};

export default function GalleryPage() {
  const { beforeAfters, finishedCars } = galleryManifest;

  return (
    <article className="pb-24 pt-20">
      <header className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Gallery</p>
        <h1 className="font-display mt-4 text-display-lg leading-tight">
          The work speaks. Drag to listen.
        </h1>
      </header>

      {beforeAfters.length > 0 && (
        <section
          data-section="before-afters"
          className="mx-auto mt-12 max-w-6xl px-5 sm:px-8"
        >
          <h2 className="sr-only">Before and after comparisons</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {beforeAfters.map((pair) => (
              <CompareSlider key={pair.id} pair={pair} />
            ))}
          </div>
        </section>
      )}

      {finishedCars.length > 0 && (
        <section data-section="finished-cars" className="mt-20">
          <h2 className="mx-auto max-w-6xl px-5 font-display text-display-md sm:px-8">
            Finished Cars
          </h2>
          {/* Full-bleed editorial grid */}
          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            {finishedCars.map((car, i) => {
              const service = serviceBySlug(car.service);
              return (
                <figure
                  key={car.id}
                  className={i % 3 === 0 ? "sm:col-span-2" : ""}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={car.src}
                    alt={car.alt}
                    loading="lazy"
                    className={`w-full object-cover ${
                      i % 3 === 0 ? "aspect-[21/9]" : "aspect-[3/2]"
                    }`}
                  />
                  <figcaption className="px-5 py-2 text-xs text-ink-faint sm:px-8">
                    {service?.name}
                    {car.isPlaceholder
                      ? " · placeholder — replaced by real work at launch"
                      : ""}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      )}

      {beforeAfters.length === 0 && finishedCars.length === 0 && (
        <p className="mx-auto mt-12 max-w-6xl px-5 text-ink-dim sm:px-8">
          Fresh work is on its way — see recent details on Instagram.
        </p>
      )}
    </article>
  );
}
