import type { Metadata } from "next";
import {
  business,
  callHref,
  quoteRequestHref,
  squareBookingUrl,
} from "@/content";

export const metadata: Metadata = {
  title: "Contact — call, text, or book",
  description: `Reach ${business.name}: tap to call or text ${business.phoneDisplay}, see hours, and the ${business.regionLong} cities we serve.`,
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-4xl px-5 pb-24 pt-20 sm:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Contact</p>
      <h1 className="font-display mt-4 text-display-lg leading-tight">
        One text away.
      </h1>
      <p className="mt-4 max-w-prose text-lg text-ink-dim">
        Fastest way to a price: text us your vehicle and what it needs. Or just
        call — we pick up when we&apos;re not elbow-deep in an interior.
      </p>

      {/* Desktop sees the number plainly; phones get tap actions. */}
      <p className="mt-8 font-display text-display-md text-accent">
        <a href={callHref()}>{business.phoneDisplay}</a>
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={quoteRequestHref()}
          data-testid="contact-text"
          className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-base transition-colors hover:bg-accent-bright"
        >
          Text us a Quote Request
        </a>
        <a
          href={callHref()}
          data-testid="contact-call"
          className="rounded-full border border-line px-7 py-3 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Tap to call
        </a>
        <a
          href={squareBookingUrl()}
          data-testid="book-now"
          className="rounded-full border border-accent px-7 py-3 text-sm text-accent transition-colors hover:bg-accent hover:text-base"
        >
          Book now
        </a>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-3">
        <div>
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
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
            Serving
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
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
            Elsewhere
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={business.instagramUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="text-ink-dim transition-colors hover:text-accent"
              >
                Instagram @{business.instagramHandle}
              </a>
            </li>
          </ul>
          <p className="mt-6 text-sm text-ink-faint">{business.dropOffAddressRule}</p>
        </div>
      </div>
    </article>
  );
}
