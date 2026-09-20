import Link from "next/link";
import { bookHref, business, callHref } from "@/content";
import { AnchorLink } from "./AnchorLink";
import { Wordmark } from "./Wordmark";

const NAV = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Our Work" },
  { href: bookHref(), label: "Book Now" },
];

/**
 * One-page navigation: the sections of the home page, and the phone as
 * the header action. On phones the nav folds away, the sticky action bar
 * carries Call and Text, and a Book now button stays in the header.
 */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="AT Bros Detailing — home" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <AnchorLink
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-ink"
            >
              {item.label}
            </AnchorLink>
          ))}
        </nav>

        <a
          href={callHref()}
          className="hidden rounded-full bg-accent px-5 py-2 text-sm font-medium text-base transition-colors hover:bg-accent-bright md:inline-flex"
        >
          {business.phoneDisplay}
        </a>
        <AnchorLink
          href={bookHref()}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-base transition-colors hover:bg-accent-bright md:hidden"
        >
          Book now
        </AnchorLink>
      </div>
    </header>
  );
}
