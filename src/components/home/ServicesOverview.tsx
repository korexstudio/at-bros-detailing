"use client";

import Link from "next/link";
import { priceFor, sellableServices } from "@/content";
import { useServiceMode } from "@/lib/service-mode";
import { PriceRoll } from "@/components/PriceRoll";
import { ServiceModeToggle } from "@/components/ServiceModeToggle";

/**
 * All seven Services with live prices, re-rendered by the global
 * Service Mode toggle.
 */
export function ServicesOverview() {
  const { mode } = useServiceMode();

  return (
    <section data-section="services" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Services</p>
          <h2 className="font-display mt-3 text-display-lg leading-tight">
            Priced straight. Booked in two taps.
          </h2>
        </div>
        <ServiceModeToggle />
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sellableServices.map((s) => {
          const price = priceFor(s, "sedan", mode);
          return (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent-dim"
              >
                <span className="font-display text-xl group-hover:text-accent">
                  {s.name}
                </span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-dim">
                  {s.pitch}
                </span>
                <span className="mt-4 flex items-baseline gap-2">
                  <PriceRoll price={price} className="text-2xl text-accent" />
                  <span className="text-xs text-ink-faint">
                    {s.sizePrices ? "sedan · sizes priced" : ""}
                    {s.largerVehiclesQuoted ? "sedan · larger vehicles quoted" : ""}
                    {!s.sizePrices && !s.largerVehiclesQuoted ? "flat" : ""}
                    {" · "}
                    {s.duration.label}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
