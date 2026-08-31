import { callHref, quoteRequestHref, squareBookingUrl } from "@/content";

/**
 * The sticky mobile bar: Book / Text / Call, always reachable on phones.
 */
export function MobileActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3">
        <a
          href={squareBookingUrl()}
          className="flex h-14 items-center justify-center text-sm font-semibold text-accent"
        >
          Book
        </a>
        <a
          href={quoteRequestHref()}
          className="flex h-14 items-center justify-center border-x border-line text-sm font-medium text-ink"
        >
          Text
        </a>
        <a
          href={callHref()}
          className="flex h-14 items-center justify-center text-sm font-medium text-ink"
        >
          Call
        </a>
      </div>
    </nav>
  );
}
