import Link from "next/link";
import {
  business,
  callHref,
  quoteRequestHref,
  squareBookingUrl,
} from "@/content";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface pb-28 pt-14 md:pb-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <Wordmark />
          <p className="mt-4 text-sm leading-relaxed text-ink-dim">
            Premium mobile &amp; drop-off detailing in {business.regionLong}.
          </p>
          <p className="mt-3 text-sm text-ink-faint">{business.dropOffAddressRule}</p>
        </div>

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
            Serving the 626
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-ink-dim">
            {business.cities.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
            Reach us
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={callHref()} className="text-ink transition-colors hover:text-accent">
                {business.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={quoteRequestHref()}
                className="text-ink-dim transition-colors hover:text-accent"
              >
                Text us for a quote
              </a>
            </li>
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
            <li className="pt-2">
              <a
                href={squareBookingUrl()}
                className="inline-block rounded-full border border-accent px-4 py-1.5 text-accent transition-colors hover:bg-accent hover:text-base"
              >
                Book now
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 text-xs text-ink-faint sm:px-8">
        <span>
          © {new Date().getFullYear()} {business.name}
        </span>
        <nav aria-label="Footer" className="flex gap-5">
          <Link href="/services" className="hover:text-ink-dim">Services</Link>
          <Link href="/gallery" className="hover:text-ink-dim">Gallery</Link>
          <Link href="/about" className="hover:text-ink-dim">About</Link>
          <Link href="/contact" className="hover:text-ink-dim">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
