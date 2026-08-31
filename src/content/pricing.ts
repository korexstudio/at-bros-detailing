import type { PriceResult, Service, ServiceMode, VehicleSize } from "./types";

/**
 * Pricing rules, mirroring Square (docs/research/square-booking-services.md).
 *
 * - Drop-off subtracts a fixed discount from the Mobile price.
 * - Add-ons are flat: the Add-on's price does not change with Service Mode
 *   (the booking's main Service already carries the discount).
 * - Size-priced Services price per Vehicle Size; Services flagged
 *   `largerVehiclesQuoted` return a "quoted" marker for non-sedans.
 */
export const DROP_OFF_DISCOUNT = 15;

export function priceFor(
  service: Service,
  vehicleSize: VehicleSize,
  serviceMode: ServiceMode,
): PriceResult {
  // Add-ons: flat price, independent of size and mode.
  if (service.addOnFor) {
    return { kind: "price", amount: service.basePrice };
  }

  let mobile: number;
  if (service.sizePrices) {
    mobile = service.sizePrices[vehicleSize];
  } else if (vehicleSize !== "sedan" && service.largerVehiclesQuoted) {
    return { kind: "quoted" };
  } else {
    mobile = service.basePrice;
  }

  const amount = serviceMode === "dropoff" ? mobile - DROP_OFF_DISCOUNT : mobile;
  return { kind: "price", amount };
}

export function formatPrice(result: PriceResult): string {
  return result.kind === "price" ? `$${result.amount}` : "Quoted";
}
