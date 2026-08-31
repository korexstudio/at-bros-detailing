import {
  business,
  galleryManifest,
  quoteRequestHref,
  realBeforeAfters,
  squareBookingUrl,
} from "@/content";
import { ImageSlot } from "@/components/ImageSlot";
import { detectImage } from "@/lib/site-images";
import { RevealWipe } from "./RevealWipe";

/** Chapter 0: the problem. */
export function Problem() {
  return (
    <section data-section="problem" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div data-parallax="media">
          {/* Drop-in: public/sections/problem.jpg|png|webp. */}
          <ImageSlot
            label="The problem — a genuinely dirty car (swirls, grime, dull paint)"
            src={detectImage("sections/problem") ?? undefined}
            alt="A car dulled by road grime and swirl marks"
            tone="dirty"
          />
        </div>
        <div data-parallax="copy">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            The problem
          </p>
          <h2 className="font-display mt-3 text-display-lg leading-tight">
            The 626 is hard on paint.
          </h2>
          <p className="mt-5 max-w-prose leading-relaxed text-ink-dim">
            Sun, freeway fallout, tunnel washes with dirty brushes. Iron specks
            bond to your clear coat until the paint feels like sandpaper. Swirls
            stack up until black looks grey. It happens slowly enough that most
            people stop seeing it.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * The showpiece slot. The honesty gate: the scroll-scrubbed reveal wipe
 * mounts only when the manifest holds at least one REAL Before/After pair.
 * With none, the slot stays a zero-height div — no layout shift either way.
 */
export function ShowpieceSlot() {
  const pairs = realBeforeAfters();
  return (
    <div data-section="showpiece-slot">
      {pairs.length > 0 ? <RevealWipe pair={pairs[0]} /> : null}
    </div>
  );
}

/** The Before/After strip, straight from the gallery manifest. */
export function BeforeAfterStrip() {
  const pairs = galleryManifest.beforeAfters.slice(0, 2);
  if (pairs.length === 0) return null;

  return (
    <section data-section="before-after" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">The proof</p>
      <h2 className="font-display mt-3 text-display-lg leading-tight">
        Same car. Same day.
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {pairs.map((pair) => (
          <figure key={pair.id} className="grid grid-cols-2 gap-2">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pair.before}
                alt={`Before — ${pair.alt}`}
                loading="lazy"
                className="aspect-[3/2] w-full rounded-l-xl object-cover"
              />
              <span className="absolute left-2 top-2 rounded bg-base/70 px-2 py-0.5 text-xs text-ink-dim">
                Before
              </span>
            </div>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pair.after}
                alt={`After — ${pair.alt}`}
                loading="lazy"
                className="aspect-[3/2] w-full rounded-r-xl object-cover"
              />
              <span className="absolute right-2 top-2 rounded bg-accent/80 px-2 py-0.5 text-xs font-medium text-base">
                After
              </span>
            </div>
            {pair.isPlaceholder && (
              <figcaption className="col-span-2 text-xs text-ink-faint">
                Placeholder — replaced by real work at launch.
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

const WHY = [
  {
    title: "Obsessive by default",
    body: "1300 GSM towels because thinner ones mar. Two-bucket washes because shortcuts scratch. The details are the product.",
  },
  {
    title: "Mobile or drop-off",
    body: `We come to you anywhere in ${business.regionLong} — or drop off and save on every Service.`,
  },
  {
    title: "Priced straight",
    body: "Every price on this site is the price. Bigger or dirtier than average? We say \"quoted\" and mean one text message.",
  },
] as const;

export function WhyAtBros() {
  return (
    <section data-section="why" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">
          Why AT Bros
        </p>
        <h2 className="font-display mt-3 max-w-2xl text-display-lg leading-tight">
          Small crew. Serious standards.
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {WHY.map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-xl text-ink">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-dim">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceArea() {
  return (
    <section data-section="service-area" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Service area</p>
      <h2 className="font-display mt-3 text-display-lg leading-tight">
        All over the 626.
      </h2>
      <p className="mt-4 max-w-prose text-ink-dim">
        Mobile detailing across {business.regionLong}. Drop-off available too —{" "}
        {business.dropOffAddressRule.toLowerCase()}
      </p>
      <ul className="mt-8 flex flex-wrap gap-2">
        {business.cities.map((city) => (
          <li
            key={city}
            className="rounded-full border border-line px-4 py-1.5 text-sm text-ink-dim"
          >
            {city}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section data-section="closing" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-28 text-center sm:px-8">
        <h2 className="font-display mx-auto max-w-2xl text-display-lg leading-tight">
          Your car has been waiting for this.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={squareBookingUrl()}
            data-testid="closing-book"
            className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-base transition-colors hover:bg-accent-bright"
          >
            Book now
          </a>
          <a
            href={quoteRequestHref()}
            className="rounded-full border border-ink-faint/40 px-8 py-3.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Text {business.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
