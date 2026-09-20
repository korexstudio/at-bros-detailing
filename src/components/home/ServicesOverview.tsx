import { DROP_OFF_DISCOUNT } from "@/content";
import { ServiceCards } from "@/components/ServiceCards";
import { ServiceModeToggle } from "@/components/ServiceModeToggle";

/**
 * The pricing grid: every sellable Service with every Vehicle Size priced,
 * re-rendered by the global Service Mode toggle.
 */
export function ServicesOverview() {
  return (
    <section
      id="services"
      data-section="services"
      className="mx-auto max-w-6xl scroll-mt-16 px-5 py-24 sm:px-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Pricing</p>
          <h2 className="font-display mt-3 text-display-lg leading-tight">
            Pick your detail.
          </h2>
          <p className="mt-4 text-ink-dim">
            Every price here is the price, by vehicle size. Drop-off takes $
            {DROP_OFF_DISCOUNT} off. Larger vehicles on interior work are quoted
            in one text.
          </p>
        </div>
        <ServiceModeToggle />
      </div>
      <ServiceCards />
    </section>
  );
}
