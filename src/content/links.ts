import { business } from "./business";
import type { Service } from "./types";

/**
 * Link builders. Square owns Bookings (ADR-0001): every "Book now" links out
 * to the Square booking page. Quote Requests go by text or call.
 */

/** The Square booking page (services list), captured 2026-08-30. */
export const SQUARE_BOOKING_PAGE =
  "https://book.squareup.com/appointments/ik4aa4vprzztxj/location/LY8DWMQM6WX65/services";

/**
 * Deep link to a specific Service on Square.
 * Falls back to the booking page while `squareServiceId` is uncaptured
 * (capturing the per-Service ids is on the launch-gate checklist).
 */
export function squareBookingUrl(service?: Service): string {
  if (service?.squareServiceId) {
    return `${SQUARE_BOOKING_PAGE}/${service.squareServiceId}`;
  }
  return SQUARE_BOOKING_PAGE;
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
