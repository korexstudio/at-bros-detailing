import { business } from "./business";
import type { Service, VehicleSize } from "./types";

/**
 * Link builders. Square owns Bookings (ADR-0001): every "Book now" links out
 * to the Square booking page. Quote Requests go by text or call.
 */

/** The Square booking page (services list), captured 2026-08-30. */
export const SQUARE_BOOKING_PAGE =
  "https://book.squareup.com/appointments/ik4aa4vprzztxj/location/LY8DWMQM6WX65/services";

/**
 * Deep link to a specific Service on Square, landing the customer on that
 * item with nothing left to pick. Where Square lists one item per Vehicle
 * Size, pass the selected size to land on the right one. Falls back to
 * the booking page when no token is known.
 */
export function squareBookingUrl(service?: Service, size?: VehicleSize): string {
  const id =
    (size && service?.squareServiceIdsBySize?.[size]) ?? service?.squareServiceId;
  return id ? `${SQUARE_BOOKING_PAGE}/${id}` : SQUARE_BOOKING_PAGE;
}

export interface QuoteRequestOptions {
  vehicle?: string;
  service?: Service;
}

/**
 * A Quote Request: a pre-filled text to the business.
 * Uses the `sms:` scheme with `?&body=` for iOS/Android compatibility.
 */
export function quoteRequestHref(options: QuoteRequestOptions = {}): string {
  const parts = ["Hi AT Bros!"];
  if (options.service) {
    parts.push(`I'm interested in a ${options.service.name}.`);
  }
  if (options.vehicle) {
    parts.push(`My vehicle: ${options.vehicle}.`);
  } else {
    parts.push("My vehicle: ");
  }
  parts.push("Could I get a quote?");
  const body = encodeURIComponent(parts.join(" "));
  return `sms:${business.phoneE164}?&body=${body}`;
}

export function callHref(): string {
  return `tel:${business.phoneE164}`;
}
