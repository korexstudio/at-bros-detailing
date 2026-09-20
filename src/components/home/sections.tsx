import Link from "next/link";
import {
  DROP_OFF_DISCOUNT,
  business,
  formatPrice,
  priceFor,
  realBeforeAfters,
  serviceBySlug,
  services,
} from "@/content";
import { CompareSlider } from "@/components/CompareSlider";
import { ImageSlot } from "@/components/ImageSlot";
import { detectImage } from "@/lib/site-images";

const TRUST = [
  {
    title: "Mobile or drop-off",
    body: `We come to you across ${business.regionLong}, or you come to us and take $${DROP_OFF_DISCOUNT} off.`,
  },
  {
    title: "Priced straight",
    body: "Every price on this page is the price. Bigger or dirtier than average? One text and we say a number.",
  },
  {
    title: "Obsessive by default",
    body: "1300 GSM towels because thinner ones mar. Two-bucket washes because shortcuts scratch.",
  },
  {
    title: "Booked in one text",
    body: "Pick a Service, tap once, and your messages app opens with the request written out.",
  },
] as const;

/** The strip under the hero: why AT Bros, in four tiles. */
export function TrustStrip() {
  return (
    <section data-section="trust" className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-4">
        {TRUST.map((item) => (
          <div key={item.title}>
            <h2 className="font-display text-lg text-ink">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-dim">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Add-ons: what can be added on top of a Service. */
export function AddOns() {
  const addOns = services.filter((s) => s.addOnFor);
  if (addOns.length === 0) return null;

  return (
    <section data-section="add-ons" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Add-ons</p>
        <h2 className="font-display mt-3 text-display-lg leading-tight">
          Customize any Service.
        </h2>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {addOns.map((addOn) => {
            const parent = serviceBySlug(addOn.addOnFor!);
            return (
              <li
                key={addOn.slug}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-5"
              >
                <div className="max-w-2xl">
                  <span className="font-display text-xl text-ink">{addOn.name}</span>
                  <span className="mt-1 block text-sm text-ink-dim">{addOn.pitch}</span>
                  {parent && (
                    <span className="mt-1 block text-xs text-ink-faint">
                      Added to {parent.name} · {addOn.duration.label}
                    </span>
                  )}
                </div>
                <span className="font-display text-2xl text-accent">
                  {formatPrice(priceFor(addOn, "sedan", "mobile"))}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Our work: every real Before/After pair, drag to compare. */
export function OurWork() {
  const pairs = realBeforeAfters();
  if (pairs.length === 0) return null;

  return (
    <section
      id="work"
      data-section="work"
      className="mx-auto max-w-6xl scroll-mt-16 px-5 py-24 sm:px-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Our work</p>
          <h2 className="font-display mt-3 text-display-lg leading-tight">
            Real cars. Real results.
          </h2>
          <p className="mt-4 max-w-prose text-ink-dim">
            Same car, same day. Drag to compare.
          </p>
        </div>
        <Link
          href="/gallery"
          className="text-sm text-ink-dim underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          See the full gallery
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map((pair) => (
          <CompareSlider key={pair.id} pair={pair} />
        ))}
      </div>
    </section>
  );
}

/** The problem, and the Service that fixes it. */
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
            Clay and Seal
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
          <p className="mt-4 max-w-prose leading-relaxed text-ink-dim">
            Clay and Seal pulls the contamination out and lays down months of
            protection. Glassy-smooth again, straight back to an OEM feel.
          </p>
          <Link
            href="/services/clay-and-seal"
            className="mt-8 inline-block rounded-full border border-ink-faint/40 px-7 py-3 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
          >
            See Clay and Seal
          </Link>
        </div>
      </div>
    </section>
  );
}
