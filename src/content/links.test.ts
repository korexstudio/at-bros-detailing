import { describe, expect, it } from "vitest";
import {
  SQUARE_BOOKING_PAGE,
  business,
  callHref,
  quoteRequestHref,
  services,
  serviceBySlug,
  squareBookingUrl,
} from "./index";

describe("squareBookingUrl", () => {
  it("every Service produces a URL on the Square booking page", () => {
    for (const service of services) {
      const url = squareBookingUrl(service);
      expect(url.startsWith(SQUARE_BOOKING_PAGE), service.slug).toBe(true);
      expect(() => new URL(url)).not.toThrow();
    }
  });

  it("deep-links when a Square service id is present", () => {
    const service = { ...serviceBySlug("basic-wash")!, squareServiceId: "ABC123" };
    expect(squareBookingUrl(service)).toBe(`${SQUARE_BOOKING_PAGE}/ABC123`);
  });

  it("falls back to the booking page without a service", () => {
    expect(squareBookingUrl()).toBe(SQUARE_BOOKING_PAGE);
  });
});

describe("quoteRequestHref", () => {
  it("is an sms: URL to the business phone with a pre-filled body", () => {
    const href = quoteRequestHref();
    expect(href.startsWith(`sms:${business.phoneE164}?&body=`)).toBe(true);
    const body = decodeURIComponent(href.split("?&body=")[1]);
    expect(body).toContain("Hi AT Bros!");
    expect(body).toContain("quote");
  });

  it("pre-fills the Service and vehicle when given", () => {
    const service = serviceBySlug("clay-and-seal")!;
    const href = quoteRequestHref({ service, vehicle: "2021 4Runner" });
    const body = decodeURIComponent(href.split("?&body=")[1]);
    expect(body).toContain("Clay and Seal");
    expect(body).toContain("2021 4Runner");
  });

  it("contains no raw spaces or unencoded characters", () => {
    const href = quoteRequestHref({ vehicle: "Truck & trailer" });
    expect(href).not.toContain(" ");
    expect(href).not.toContain("&body=Hi AT");
  });
});

describe("callHref", () => {
  it("is a tel: URL to the business phone", () => {
    expect(callHref()).toBe("tel:+16267882004");
  });
});
