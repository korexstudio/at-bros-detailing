"use client";

import { priceFor, sizesMatter, squareBookingUrl, type Service } from "@/content";
import { useServiceMode } from "@/lib/service-mode";
import { useVehicleSize } from "@/lib/vehicle-size";
import { PriceRoll } from "./PriceRoll";
import { QuoteLink } from "./QuoteLink";
import { ServiceModeToggle } from "./ServiceModeToggle";
import { VehicleSizeSelector } from "./VehicleSizeSelector";

/**
 * The Service page price block: Vehicle Size selector (only where sizes
 * matter), the Service Mode toggle, and the price itself — rolling on
 * every change. "Quoted" cases hand off to the Quote Request CTA.
 *
 * The primary actions live here too, so "Book now" deep-links to the
 * Square item for the selected Vehicle Size where Square prices by size.
 */
export function PriceBlock({ service }: { service: Service }) {
  const { size } = useVehicleSize();
  const { mode } = useServiceMode();

  const price = priceFor(service, size, mode);

  return (
    <>
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-ink-faint">
            {price.kind === "price" ? "Your price" : "Your price — quoted"}
          </span>
          <div className="mt-1 flex items-baseline gap-3">
            <PriceRoll
              price={price}
              className="font-display text-5xl text-accent"
            />
            <span className="text-sm text-ink-dim">· {service.duration.label}</span>
          </div>
        </div>
        <ServiceModeToggle />
      </div>

      {sizesMatter(service) && (
        <div className="mt-6">
          <VehicleSizeSelector />
        </div>
      )}

      {price.kind === "quoted" && (
        <p className="mt-5 rounded-lg border border-accent-dim/40 bg-accent/5 px-4 py-3 text-sm text-ink-dim">
          Larger vehicles are quoted case-by-case — it takes one text.{" "}
          <QuoteLink
            service={service}
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            Text us for your price
          </QuoteLink>
          .
        </p>
      )}
    </div>

    {/* Primary actions */}
    <div className="mt-6 flex flex-wrap gap-3">
      <a
        href={squareBookingUrl(service, size)}
        data-testid="book-now"
        className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-base transition-colors hover:bg-accent-bright"
      >
        Book now
      </a>
      <QuoteLink
        service={service}
        data-testid="quote-request"
        className="rounded-full border border-line px-7 py-3 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
      >
        Not sure? Text us
      </QuoteLink>
    </div>
    </>
  );
}
