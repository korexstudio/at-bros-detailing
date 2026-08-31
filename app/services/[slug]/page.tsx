import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PriceBlock } from "@/components/PriceBlock";
import {
  addOnsFor,
  business,
  quoteRequestHref,
  sellableServices,
  serviceBySlug,
  squareBookingUrl,
  startingPrice,
  type Service,
} from "@/content";

export function generateStaticParams() {
  return sellableServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const service = serviceBySlug((await params).slug);
  if (!service) return { title: "Service" };
  return {
    title: `${service.name} in the 626`,
    description: `${service.pitch} Mobile or drop-off across ${business.regionLong}. Book online or text ${business.phoneDisplay}.`,
  };
}

function RelatedCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent-dim"
    >
      <span className="font-display text-lg group-hover:text-accent">
        {service.name}
      </span>
      <span className="mt-1 block text-sm text-ink-dim">{service.pitch}</span>
      <span className="mt-3 block text-sm text-accent">
        from {startingPrice(service)}
      </span>
    </Link>
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = serviceBySlug((await params).slug);
  if (!service || service.addOnFor) notFound();

  const addOns = addOnsFor(service);
  const related = service.related
    .map((slug) => serviceBySlug(slug))
    .filter((s): s is Service => Boolean(s) && !s!.addOnFor)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-5 pb-24 pt-20 sm:px-8">
      {/* Hero */}
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-accent">
          Mobile &amp; drop-off · {business.regionLong}
        </p>
        <h1 className="font-display mt-4 text-display-lg leading-tight">
          {service.name}
        </h1>
        <p className="mt-4 max-w-prose text-lg text-ink-dim">{service.pitch}</p>
      </header>

      {/* Price */}
      <div className="mt-10">
        <PriceBlock service={service} />
      </div>

      {/* Primary actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={squareBookingUrl(service)}
          data-testid="book-now"
          className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-base transition-colors hover:bg-accent-bright"
        >
          Book now
        </a>
        <a
          href={quoteRequestHref({ service })}
          data-testid="quote-request"
          className="rounded-full border border-line px-7 py-3 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Not sure? Text us
        </a>
      </div>

      {/* What's included */}
      <section className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-display-md">What&apos;s included</h2>
          <ul className="mt-5 space-y-3">
            {service.included.map((item) => (
              <li key={item} className="flex gap-3 text-ink-dim">
                <span aria-hidden className="mt-0.5 text-accent">
                  —
                </span>
                {item}
              </li>
            ))}
            <li className="flex gap-3 pt-2 text-ink-faint">
              <span aria-hidden className="mt-0.5">
                ⏱
              </span>
              Takes about {service.duration.label}
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-display-md">How we do it</h2>
          <div className="mt-5 space-y-4 text-ink-dim">
            {service.description.map((para) => (
              <p key={para.slice(0, 32)} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      {addOns.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-display-md">Add on</h2>
          {addOns.map((addOn) => (
            <div
              key={addOn.slug}
              className="mt-5 rounded-xl border border-accent-dim/40 bg-accent/5 p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="font-display text-xl">{addOn.name}</span>
                <span className="text-accent">
                  +{startingPrice(addOn)} · {addOn.duration.label}
                </span>
              </div>
              <p className="mt-2 max-w-prose text-sm text-ink-dim">{addOn.pitch}</p>
            </div>
          ))}
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-display-md">Pairs well with</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RelatedCard key={r.slug} service={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
