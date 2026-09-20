"use client";

import Link from "next/link";
import { priceFor, sizesMatter, type PriceResult, type Service } from "@/content";
import { useServiceMode } from "@/lib/service-mode";
import { useVehicleSize } from "@/lib/vehicle-size";
import { PriceRoll } from "./PriceRoll";

/** The small print beside the price: what the number applies to. */
function priceNote(service: Service, price: PriceResult): string {
  if (price.kind === "quoted") return "larger vehicles, one text";
  if (service.sizePrices) return "your size";
  if (sizesMatter(service)) return "sedan · larger vehicles quoted";
  return "flat";
}

/**
 * One Service in a list, priced live for the chosen Vehicle Size and
 * Service Mode, badged when it is the Most Popular Service.
 */
export function ServiceCard({ service }: { service: Service }) {
  const { mode } = useServiceMode();
  const { size } = useVehicleSize();
  const price = priceFor(service, size, mode);

  return (
    <li data-service={service.slug} className="relative">
      {service.mostPopular && (
        <span className="absolute -top-3 left-5 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-base">
          Most popular
        </span>
      )}
      <Link
        href={`/services/${service.slug}`}
        className="group flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent-dim"
      >
        <span className="font-display text-xl group-hover:text-accent">
          {service.name}
        </span>
        <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-dim">
          {service.pitch}
        </span>
        <span className="mt-4 flex items-baseline gap-2">
          <PriceRoll price={price} className="text-2xl text-accent" />
          <span className="text-xs text-ink-faint">
            {priceNote(service, price)}
            {" · "}
            {service.duration.label}
          </span>
        </span>
      </Link>
    </li>
  );
}
