import type { DayHours } from "./types";

/**
 * Business facts, from the owner's Square page and Instagram bio
 * (docs/research/square-booking-services.md).
 */
export const business = {
  name: "AT Bros Detailing",
  legalName: "AT Bros Detailing",
  /** E.164, for tel:/sms: hrefs. */
  phoneE164: "+16267882004",
  /** Display form. */
  phoneDisplay: "(626) 788-2004",
  instagramHandle: "at.bros.detailing",
  instagramUrl: "https://www.instagram.com/at.bros.detailing/",
  /** Marketing shorthand for the area code / region. */
  region: "the 626",
  regionLong: "San Gabriel Valley",
  /**
   * The Drop-off rule: the drop-off address is never published;
   * it is shared with the customer on Booking.
   */
  dropOffAddressRule:
    "Drop-off address shared when you book — never published online.",
  hours: [
    { day: "Sunday", hours: "9:00 AM – 6:00 PM" },
    { day: "Monday", hours: "5:30 PM – 8:00 PM" },
    { day: "Tuesday", hours: "5:30 PM – 8:00 PM" },
    { day: "Wednesday", hours: "5:30 PM – 8:00 PM" },
    { day: "Thursday", hours: "5:30 PM – 8:00 PM" },
    { day: "Friday", hours: "5:30 PM – 8:00 PM" },
    { day: "Saturday", hours: "9:00 AM – 7:00 PM" },
  ] satisfies DayHours[],
  /** Cities served across the San Gabriel Valley. */
  cities: [
    "Pasadena",
    "Alhambra",
    "Arcadia",
    "San Gabriel",
    "Monterey Park",
    "South Pasadena",
    "San Marino",
    "Temple City",
    "Rosemead",
    "El Monte",
    "Monrovia",
    "Duarte",
    "Sierra Madre",
    "Baldwin Park",
    "West Covina",
    "Covina",
    "Azusa",
    "Glendora",
  ],
} as const;

export type Business = typeof business;
