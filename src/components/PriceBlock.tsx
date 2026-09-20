"use client";

import {
  bookingTextHref,
  priceFor,
  sizesMatter,
  squareBookingUrl,
  type Service,
} from "@/content";
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
 * The primary actions live here too. "Book now" is a pre-filled text
 * naming this Service and the visitor's choices (ADR-0002); the Square
 * deep link for the selected Vehicle Size stays one tap away.
 */
export function PriceBlock({ service }: { service: Service }) {
  const { size, chosen } = useVehicleSize();
  const { mode } = useServiceMode();

  const price = priceFor(service, size, mode);
  const bookHref = bookingTextHref({
    service,
    vehicleSize: chosen ? size : undefined,
    serviceMode: mode,
  });

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
        href={bookHref}
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
    <p className="mt-4 text-xs text-ink-faint">
      Book now opens a text with this Service filled in. Prefer to book
      online?{" "}
      <a
        href={squareBookingUrl(service, size)}
        data-testid="book-square"
        className="text-ink-dim underline-offset-4 hover:text-accent hover:underline"
      >
        Use our Square page
      </a>
      .
    </p>
    </>
  );
}
