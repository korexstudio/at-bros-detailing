"use client";

import Link from "next/link";
import {
  VEHICLE_SIZES,
  VEHICLE_SIZE_LABELS,
  priceFor,
  sizesMatter,
  type PriceResult,
  type Service,
  type ServiceMode,
} from "@/content";
import { useBookingDraft } from "@/lib/booking-draft";
import { useServiceMode } from "@/lib/service-mode";
import { AnchorLink } from "./AnchorLink";
import { PriceRoll } from "./PriceRoll";

const MAX_BULLETS = 5;

interface PriceRow {
  key: string;
  label: string;
  price: PriceResult;
}

/** One row per Vehicle Size where size matters, else a single flat row. */
function priceRows(service: Service, mode: ServiceMode): PriceRow[] {
  if (sizesMatter(service)) {
    return VEHICLE_SIZES.map((size) => ({
      key: size,
      label: VEHICLE_SIZE_LABELS[size],
      price: priceFor(service, size, mode),
    }));
  }
  return [{ key: "all", label: "All sizes", price: priceFor(service, "sedan", mode) }];
}

/**
 * One Service on the pricing grid: every Vehicle Size priced live for the
 * chosen Service Mode, what's included, and a Book button that preselects
 * this Service on the Book by text form.
 */
export function ServiceCard({ service }: { service: Service }) {
  const { mode } = useServiceMode();
  const { chooseService } = useBookingDraft();
  const rows = priceRows(service, mode);

  return (
    <li
      data-service={service.slug}
      className={`relative flex flex-col rounded-xl border bg-surface p-6 ${
        service.mostPopular ? "border-accent/60" : "border-line"
      }`}
    >
      {service.mostPopular && (
        <span className="absolute -top-3 left-5 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-base">
          Most popular
        </span>
      )}
      <h3 className="font-display text-xl text-ink">{service.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-dim">{service.pitch}</p>

      <dl className="mt-5 divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div key={row.key} className="flex items-baseline justify-between gap-4 py-2">
            <dt className="text-sm text-ink-dim">{row.label}</dt>
            <dd data-size={row.key}>
              <PriceRoll price={row.price} className="font-display text-lg text-accent" />
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-5 space-y-2 text-sm text-ink-dim">
        {service.included.slice(0, MAX_BULLETS).map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="text-accent">
              —
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
        <AnchorLink
          href="/#book"
          onNavigate={() => chooseService(service.slug)}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-base transition-colors hover:bg-accent-bright"
        >
          Book {service.name}
        </AnchorLink>
        <Link
          href={`/services/${service.slug}`}
          className="text-sm text-ink-dim underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          Details
        </Link>
      </div>
    </li>
  );
}
