import Link from "next/link";
import { squareBookingUrl } from "@/content";
import { Wordmark } from "./Wordmark";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="AT Bros Detailing — home" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-ink-dim transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={squareBookingUrl()}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-base transition-colors hover:bg-accent-bright"
        >
          Book now
        </a>
      </div>
    </header>
  );
}
