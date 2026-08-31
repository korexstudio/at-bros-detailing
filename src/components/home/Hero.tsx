import { quoteRequestHref, squareBookingUrl, business } from "@/content";
import { ImageSlot } from "@/components/ImageSlot";
import { Wordmark } from "@/components/Wordmark";

/**
 * The hero: a Finished Car, the wordmark, and the primary CTA.
 * Ticket #6 adds drift, light sweep, and grain — this stays fully
 * readable with zero animation.
 */
export function Hero() {
  return (
    <section
      data-section="hero"
      className="relative flex min-h-[92svh] items-end overflow-hidden"
    >
      <div className="absolute inset-0" data-hero-media>
        <div className="hero-drift h-full">
          <ImageSlot
            label="Hero — the single best Finished Car glamour shot (dark car, low light)"
            aspect="h-full"
            tone="clean"
            className="rounded-none border-0"
          />
        </div>
        {/* Specular light sweep + film grain — pure CSS, gated by html[data-motion]. */}
        <div aria-hidden className="hero-sweep" />
        <div aria-hidden className="hero-grain" />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/40 to-base/10" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-40 sm:px-8">
        <Wordmark size="lg" />
        <h1 className="font-display mt-6 max-w-3xl text-display-xl leading-[1.05]">
          Your car, the way it left the showroom.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-dim">
          Premium mobile &amp; drop-off detailing across {business.regionLong}.
          We come to you — or you come to us and save.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={squareBookingUrl()}
            data-testid="hero-book"
            className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-base transition-colors hover:bg-accent-bright"
          >
            Book now
          </a>
          <a
            href={quoteRequestHref()}
            className="rounded-full border border-ink-faint/40 px-8 py-3.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Text us a question
          </a>
        </div>
      </div>
    </section>
  );
}
