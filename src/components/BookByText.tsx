"use client";

import { useState } from "react";
import {
  BOOKING_WHENS,
  BOOKING_WHEN_LABELS,
  DROP_OFF_DISCOUNT,
  bookingTextHref,
  business,
  priceFor,
  sellableServices,
  serviceBySlug,
  type BookingWhen,
} from "@/content";
import { useServiceMode } from "@/lib/service-mode";
import { useVehicleSize } from "@/lib/vehicle-size";
import { PriceRoll } from "./PriceRoll";
import { PricingControls } from "./PricingControls";
import { SquareFallbackNote } from "./SquareFallbackNote";

/** The form opens on the Most Popular Service. */
const DEFAULT_SERVICE =
  sellableServices.find((s) => s.mostPopular)?.slug ?? sellableServices[0].slug;

const fieldLabel = "text-xs uppercase tracking-[0.25em] text-ink-faint";
const fieldInput =
  "mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent";

/**
 * Book by text (ADR-0002): the visitor picks a Service, Vehicle Size,
 * Service Mode, and timing, and one tap opens their messages app with the
 * whole request written out. Nothing is sent from the site; Square stays
 * one tap away for anyone who would rather book online.
 */
export function BookByText() {
  const [slug, setSlug] = useState(DEFAULT_SERVICE);
  const [when, setWhen] = useState<BookingWhen>("asap");
  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const { size, chosenSize } = useVehicleSize();
  const { mode, chosenMode } = useServiceMode();

  const service = serviceBySlug(slug) ?? sellableServices[0];
  const price = priceFor(service, size, mode);
  const href = bookingTextHref({
    service,
    vehicleSize: chosenSize,
    serviceMode: chosenMode,
    when,
    vehicle,
    name,
  });

  return (
    <section
      id="book"
      data-section="book"
      className="scroll-mt-20 border-y border-line bg-surface"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 md:grid-cols-[1fr_1.1fr] md:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Book by text</p>
          <h2 className="font-display mt-3 text-display-lg leading-tight">
            Book it in one text.
          </h2>
          <p className="mt-5 max-w-prose leading-relaxed text-ink-dim">
            Pick your Service, tell us about your car, and send. We text back
            to lock in a time. Nothing to sign up for.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-ink-dim">
            <li>
              <span className="font-medium text-ink">Mobile.</span> We come to
              you anywhere in {business.regionLong}.
            </li>
            <li>
              <span className="font-medium text-ink">Drop-off.</span> Bring it
              to us and take ${DROP_OFF_DISCOUNT} off.
            </li>
            <li>
              <span className="font-medium text-ink">Rather talk?</span> Call
              or text {business.phoneDisplay}.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-base p-6 sm:p-8">
          <label className="block">
            <span className={fieldLabel}>Service</span>
            <select
              data-testid="book-service"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={fieldInput}
            >
              {sellableServices.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6">
            <PricingControls />
          </div>

          <fieldset className="mt-6">
            <legend className={fieldLabel}>When</legend>
            <div
              role="radiogroup"
              aria-label="When"
              className="mt-2 flex flex-wrap gap-2"
            >
              {BOOKING_WHENS.map((w) => (
                <button
                  key={w}
                  type="button"
                  role="radio"
                  aria-checked={when === w}
                  onClick={() => setWhen(w)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    when === w
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-line text-ink-dim hover:border-ink-faint hover:text-ink"
                  }`}
                >
                  {BOOKING_WHEN_LABELS[w]}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={fieldLabel}>Your name</span>
              <input
                data-testid="book-name"
                type="text"
                autoComplete="name"
                placeholder="Optional"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldInput}
              />
            </label>
            <label className="block">
              <span className={fieldLabel}>Your vehicle</span>
              <input
                data-testid="book-vehicle"
                type="text"
                placeholder="Year, make, model"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className={fieldInput}
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className={fieldLabel}>
                {price.kind === "price" ? "Your price" : "Your price — quoted"}
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <PriceRoll price={price} className="font-display text-4xl text-accent" />
                <span className="text-sm text-ink-dim">· {service.duration.label}</span>
              </div>
            </div>
            <a
              href={href}
              data-testid="book-text"
              className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-base transition-colors hover:bg-accent-bright"
            >
              Send the text
            </a>
          </div>

          <SquareFallbackNote
            lead="Opens your messages app with everything filled in."
            service={service}
            size={size}
          />
        </div>
      </div>
    </section>
  );
}
