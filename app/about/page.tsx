import type { Metadata } from "next";
import { business, quoteRequestHref, squareBookingUrl } from "@/content";
import { ImageSlot } from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "About — the brothers behind the buckets",
  description: `Who AT Bros Detailing are, when we work, and where we go across ${business.regionLong}.`,
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl px-5 pb-24 pt-20 sm:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">About</p>
      <h1 className="font-display mt-4 text-display-lg leading-tight">
        The brothers behind the buckets.
      </h1>

      <div className="mt-10 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          {/* Founder story — placeholder until the owner supplies it (launch gate). */}
          <div
            data-placeholder="founder-story"
            className="rounded-xl border border-dashed border-accent-dim/50 bg-surface p-6"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-accent">
              Founder story — placeholder copy
            </p>
            <div className="mt-4 space-y-4 leading-relaxed text-ink-dim">
              <p>
                AT Bros Detailing is a small crew of brothers in the San Gabriel
                Valley who got tired of watching good cars age badly. What
                started with one car in a driveway became a mobile operation
                serving the whole 626.
              </p>
              <p>
                We&apos;re obsessive about the things you can&apos;t see in a
                photo: towels heavy enough not to mar, wash methods that add
                zero swirls, sealants we&apos;d put on our own cars.
              </p>
              <p className="text-ink-faint">
                (This is stand-in copy. The real founder story — who the
                brothers are, how it started, what they&apos;re obsessive about
                — replaces it before launch.)
              </p>
            </div>
          </div>

          <div className="mt-8">
            <ImageSlot label="About — the brothers at work (candid, mid-detail)" />
          </div>
        </div>

        <aside className="md:col-span-2">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
            Hours
          </h2>
          <ul className="mt-4 space-y-1.5 text-sm text-ink-dim">
            {business.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span>{h.hours ?? "Closed"}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
            Where we go
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {business.cities.map((city) => (
              <li
                key={city}
                className="rounded-full border border-line px-3 py-1 text-xs text-ink-dim"
              >
                {city}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <a
          href={squareBookingUrl()}
          data-testid="book-now"
          className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-base transition-colors hover:bg-accent-bright"
        >
          Book now
        </a>
        <a
          href={quoteRequestHref()}
          className="rounded-full border border-line px-7 py-3 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Text us
        </a>
      </div>
    </article>
  );
}
