import { describe, expect, it } from "vitest";
import {
  SQUARE_BOOKING_PAGE,
  business,
  bookHref,
  bookingTextHref,
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
    const service = { ...serviceBySlug("maintenance-detail")!, squareServiceId: "ABC123" };
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

  it("names the chosen Vehicle Size so the customer only adds make and model", () => {
    const href = quoteRequestHref({ vehicleSize: "truckSuv" });
    const body = decodeURIComponent(href.split("?&body=")[1]);
    expect(body).toContain("My vehicle (Truck / Sprinter / SUV): ");
  });

  it("keeps both the Vehicle Size and a described vehicle when given both", () => {
    const href = quoteRequestHref({ vehicleSize: "miniSuv", vehicle: "2021 RAV4" });
    const body = decodeURIComponent(href.split("?&body=")[1]);
    expect(body).toContain("My vehicle (Mini SUV): 2021 RAV4.");
  });

  it("leaves the vehicle prompt blank when no Vehicle Size was chosen", () => {
    const body = decodeURIComponent(quoteRequestHref().split("?&body=")[1]);
    expect(body).toContain("My vehicle: ");
    expect(body).not.toContain("Sedan");
  });

  it("contains no raw spaces or unencoded characters", () => {
    const href = quoteRequestHref({ vehicle: "Truck & trailer" });
    expect(href).not.toContain(" ");
    expect(href).not.toContain("&body=Hi AT");
  });
});

describe("bookingTextHref", () => {
  const body = (href: string) => decodeURIComponent(href.split("?&body=")[1]);

  it("is an sms: URL to the business phone", () => {
    expect(bookingTextHref().startsWith(`sms:${business.phoneE164}?&body=`)).toBe(true);
  });

  it("names the Service, Vehicle Size, Service Mode, timing, vehicle, and sender", () => {
    const text = body(
      bookingTextHref({
        service: serviceBySlug("full-detail")!,
        vehicleSize: "miniSuv",
        serviceMode: "dropoff",
        when: "thisWeek",
        vehicle: "2021 RAV4",
        name: "Sam",
      }),
    );
    expect(text).toBe(
      "Hi AT Bros, this is Sam! I'd like to book a Full Detail for my Mini SUV, Drop-off. Timing: This week. My vehicle: 2021 RAV4.",
    );
  });

  it("leaves the vehicle as a prompt and skips what was not given", () => {
    const text = body(bookingTextHref({ service: serviceBySlug("clay-and-seal")! }));
    expect(text).toBe("Hi AT Bros! I'd like to book a Clay and Seal. My vehicle: ");
  });

  it("contains no raw spaces", () => {
    expect(bookingTextHref({ name: "A B", vehicle: "C & D" })).not.toContain(" ");
  });
});

describe("bookHref", () => {
  it("points at the Book by text section on the home page", () => {
    expect(bookHref()).toBe("/#book");
  });
});

describe("callHref", () => {
  it("is a tel: URL to the business phone", () => {
    expect(callHref()).toBe("tel:+16267882004");
  });
});
