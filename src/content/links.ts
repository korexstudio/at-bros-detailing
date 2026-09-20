import { business } from "./business";
import {
  BOOKING_WHEN_LABELS,
  SERVICE_MODE_LABELS,
  VEHICLE_SIZE_LABELS,
  type BookingWhen,
  type Service,
  type ServiceMode,
  type VehicleSize,
} from "./types";

/**
 * Link builders. Bookings are requested by pre-filled text (ADR-0002);
 * Square stays the online option and the price source of truth. Quote
 * Requests go by text or call.
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
  /** The Vehicle Size the visitor explicitly chose, if any. */
  vehicleSize?: VehicleSize;
}

/**
 * A pre-filled text to the business. Uses the `sms:` scheme with
 * `?&body=` for iOS/Android compatibility.
 */
function smsHref(parts: string[]): string {
  return `sms:${business.phoneE164}?&body=${encodeURIComponent(parts.join(" "))}`;
}

/** A Quote Request: a pre-filled text asking the business to price a job. */
export function quoteRequestHref(options: QuoteRequestOptions = {}): string {
  const parts = ["Hi AT Bros!"];
  if (options.service) {
    parts.push(`I'm interested in a ${options.service.name}.`);
  }
  const sizeNote = options.vehicleSize
    ? ` (${VEHICLE_SIZE_LABELS[options.vehicleSize]})`
    : "";
  const vehicle = options.vehicle ? `${options.vehicle}.` : "";
  parts.push(`My vehicle${sizeNote}: ${vehicle}`);
  parts.push("Could I get a quote?");
  return smsHref(parts);
}

/** Where every "Book now" leads: the Book by text section on the home page. */
export function bookHref(): string {
  return "/#book";
}

export interface BookingTextOptions {
  service?: Service;
  vehicleSize?: VehicleSize;
  serviceMode?: ServiceMode;
  when?: BookingWhen;
  /** Year, make, model as the customer typed it. */
  vehicle?: string;
  name?: string;
}

/**
 * A Booking request: a pre-filled text to the business carrying everything
 * the visitor chose, with the vehicle left as a prompt when not given.
 */
export function bookingTextHref(options: BookingTextOptions = {}): string {
  const name = options.name?.trim();
  const parts = [name ? `Hi AT Bros, this is ${name}!` : "Hi AT Bros!"];
  const what = options.service ? ` a ${options.service.name}` : "";
  const size = options.vehicleSize
    ? ` for my ${VEHICLE_SIZE_LABELS[options.vehicleSize]}`
    : "";
  const mode = options.serviceMode
    ? `, ${SERVICE_MODE_LABELS[options.serviceMode]}`
    : "";
  parts.push(`I'd like to book${what}${size}${mode}.`);
  if (options.when) parts.push(`Timing: ${BOOKING_WHEN_LABELS[options.when]}.`);
  const vehicle = options.vehicle?.trim();
  parts.push(vehicle ? `My vehicle: ${vehicle}.` : "My vehicle: ");
  return smsHref(parts);
}

export function callHref(): string {
  return `tel:${business.phoneE164}`;
}
