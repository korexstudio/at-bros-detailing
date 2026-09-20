import type { Metadata } from "next";
import { DROP_OFF_DISCOUNT } from "@/content";
import { ServiceCards } from "@/components/ServiceCards";
import { ServiceModeToggle } from "@/components/ServiceModeToggle";

export const metadata: Metadata = {
  title: "Car Detailing Services & Pricing — 626 / San Gabriel Valley",
  description:
    "Every AT Bros Detailing Service with straight prices: exterior, interior, clay & seal, paint enhancement, and more. Mobile or drop-off across the San Gabriel Valley.",
};

export default function ServicesIndex() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Services</p>
          <h1 className="font-display mt-4 text-display-lg leading-tight">
            Every Service, priced straight.
          </h1>
          <p className="mt-4 text-ink-dim">
            Every price here is the price, by vehicle size. Drop-off takes $
            {DROP_OFF_DISCOUNT} off.
          </p>
        </div>
        <ServiceModeToggle />
      </div>
      <ServiceCards />
    </section>
  );
}
