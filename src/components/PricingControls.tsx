import { ServiceModeToggle } from "./ServiceModeToggle";
import { VehicleSizeSelector } from "./VehicleSizeSelector";

/**
 * The two global pricing choices side by side: Vehicle Size and
 * Service Mode. Every Service list shows them once, above the cards.
 */
export function PricingControls() {
  return (
    <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
      <VehicleSizeSelector />
      <ServiceModeToggle />
    </div>
  );
}
