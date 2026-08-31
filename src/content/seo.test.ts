import { describe, expect, it } from "vitest";
import { localBusinessJsonLd, to24h } from "./seo";

describe("to24h", () => {
  it("converts AM/PM times", () => {
    expect(to24h("9:00 AM")).toBe("09:00");
    expect(to24h("5:30 PM")).toBe("17:30");
    expect(to24h("12:00 PM")).toBe("12:00");
    expect(to24h("12:15 AM")).toBe("00:15");
  });
});

describe("localBusinessJsonLd", () => {
  const jsonLd = localBusinessJsonLd();

  it("carries phone, hours, and areaServed cities", () => {
    expect(jsonLd.telephone).toBe("+16267882004");
    const hours = jsonLd.openingHoursSpecification as Array<{
      dayOfWeek: string;
      opens: string;
      closes: string;
    }>;
    expect(hours).toHaveLength(7);
    const monday = hours.find((h) => h.dayOfWeek === "Monday")!;
    expect(monday.opens).toBe("17:30");
    expect(monday.closes).toBe("20:00");
    const sunday = hours.find((h) => h.dayOfWeek === "Sunday")!;
    expect(sunday.opens).toBe("09:00");
    expect(sunday.closes).toBe("18:00");
    const cities = jsonLd.areaServed as Array<{ name: string }>;
    expect(cities.map((c) => c.name)).toContain("Pasadena");
  });

  it("contains no street address", () => {
    expect(JSON.stringify(jsonLd)).not.toMatch(/"address"/i);
    expect(jsonLd).not.toHaveProperty("address");
  });

  it("offers every sellable Service with its page URL", () => {
    const offers = jsonLd.makesOffer as Array<{ url: string }>;
    expect(offers).toHaveLength(7);
    expect(offers.some((o) => o.url.endsWith("/services/exterior-detail"))).toBe(
      true,
    );
  });
});
