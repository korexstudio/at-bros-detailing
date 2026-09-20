import { PricingControls } from "@/components/PricingControls";
import { ServiceCards } from "@/components/ServiceCards";

/**
 * Every sellable Service with live prices, re-rendered by the global
 * Vehicle Size and Service Mode choices.
 */
export function ServicesOverview() {
  return (
    <section data-section="services" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Services</p>
          <h2 className="font-display mt-3 text-display-lg leading-tight">
            Priced straight. Booked in two taps.
          </h2>
        </div>
        <PricingControls />
      </div>
      <ServiceCards />
    </section>
  );
}
