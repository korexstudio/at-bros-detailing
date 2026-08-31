import { quoteRequestHref, squareBookingUrl } from "@/content";

/**
 * Styled stand-in for routes whose real page ships in a later ticket.
 * Keeps navigation complete under the shared shell from day one.
 */
export function PagePlaceholder({
  title,
  note,
}: {
  title: string;
  note: string;
}) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start px-5 py-24 sm:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">
        AT Bros Detailing
      </p>
      <h1 className="font-display mt-4 text-display-lg leading-tight">{title}</h1>
      <p className="mt-4 max-w-prose text-ink-dim">{note}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={squareBookingUrl()}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-base transition-colors hover:bg-accent-bright"
        >
          Book now
        </a>
        <a
          href={quoteRequestHref()}
          className="rounded-full border border-line px-6 py-2.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Not sure? Text us
        </a>
      </div>
    </section>
  );
}
