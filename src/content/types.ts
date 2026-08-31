/**
 * Seam A: the content module's vocabulary.
 * Terms mirror CONTEXT.md — Service, Add-on, Vehicle Size, Service Mode,
 * Quote Request, Booking, Before/After, Finished Car.
 */

export type VehicleSize = "sedan" | "miniSuv" | "truckSuv";

export type ServiceMode = "mobile" | "dropoff";

export const VEHICLE_SIZES: readonly VehicleSize[] = ["sedan", "miniSuv", "truckSuv"];
export const SERVICE_MODES: readonly ServiceMode[] = ["mobile", "dropoff"];

export const VEHICLE_SIZE_LABELS: Record<VehicleSize, string> = {
  sedan: "Sedan",
  miniSuv: "Mini SUV",
  truckSuv: "Truck / Sprinter / SUV",
};

export const SERVICE_MODE_LABELS: Record<ServiceMode, string> = {
  mobile: "Mobile",
  dropoff: "Drop-off",
};

/** A price in whole US dollars. */
export type Dollars = number;

/**
 * Result of pricing a Service: either a firm price or a "quoted" marker
 * (larger vehicles on Full Detail / Interior Detail until the owner answers).
 */
export type PriceResult =
  | { kind: "price"; amount: Dollars }
  | { kind: "quoted" };

export interface ServiceDuration {
  /** Total minutes, from the Square listing. */
  minutes: number;
  /** Human label, e.g. "1 hr 45 min". */
  label: string;
}

export interface Service {
  /** URL segment and stable identifier, e.g. "exterior-detail". */
  slug: string;
  /** Display name in the site's vocabulary. */
  name: string;
  /** The item name(s) as listed on Square, for the maintainer syncing prices. */
  squareItemName: string;
  /**
   * Square deep-link id for this Service on the booking page.
   * Not yet captured from Square — null falls back to the booking page URL.
   * Capturing these is on the launch-gate checklist.
   */
  squareServiceId: string | null;
  /** One-line pitch for cards and overviews. */
  pitch: string;
  /**
   * Full description, rewritten in the site's voice.
   * Every real fact from the Square copy preserved; stale inline prices dropped.
   */
  description: string[];
  /** What's included, as scannable bullets. */
  included: string[];
  duration: ServiceDuration;
  /**
   * Mobile base price. For size-priced Services this is the sedan price;
   * `sizePrices` carries the rest.
   */
  basePrice: Dollars;
  /** Per-Vehicle-Size Mobile prices, only where Square prices by size. */
  sizePrices?: Record<VehicleSize, Dollars>;
  /**
   * True when larger vehicles are quoted case-by-case rather than priced
   * (open owner questions #1 and #2 in the research doc).
   */
  largerVehiclesQuoted: boolean;
  /** Slug of the Service this is an Add-on to, if it is one. */
  addOnFor?: string;
  /** Slugs of related Services to cross-link from the Service page. */
  related: string[];
}

export type GalleryService = string; // Service slug the photo demonstrates

export interface BeforeAfterPair {
  id: string;
  /** Path under /public for the "before" photo. */
  before: string;
  /** Path under /public for the "after" photo. */
  after: string;
  alt: string;
  service: GalleryService;
  /** Placeholder entries never count as real work and are clearly marked in the UI. */
  isPlaceholder: boolean;
}

export interface FinishedCar {
  id: string;
  src: string;
  alt: string;
  service: GalleryService;
  isPlaceholder: boolean;
}

export interface GalleryManifest {
  beforeAfters: BeforeAfterPair[];
  finishedCars: FinishedCar[];
}

export interface DayHours {
  /** e.g. "Sunday" */
  day: string;
  /** e.g. "9:00 AM – 6:00 PM", or null when closed. */
  hours: string | null;
}
