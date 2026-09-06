import { describe, expect, it } from "vitest";
import {
  DROP_OFF_DISCOUNT,
  priceFor,
  formatPrice,
  services,
  sellableServices,
  serviceBySlug,
  addOnsFor,
  SERVICE_MODES,
  VEHICLE_SIZES,
} from "./index";

describe("catalog shape", () => {
  it("has exactly seven sellable Services", () => {
    expect(sellableServices).toHaveLength(7);
  });

  it("has no duplicate slugs", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every Add-on points at an existing Service", () => {
    for (const s of services) {
      if (s.addOnFor) {
        expect(serviceBySlug(s.addOnFor), `${s.slug} addOnFor`).toBeDefined();
      }
    }
  });

  it("every related slug resolves", () => {
    for (const s of services) {
      for (const r of s.related) {
        expect(serviceBySlug(r), `${s.slug} -> ${r}`).toBeDefined();
      }
    }
  });

  it("Interior Detail carries Seat/Carpet Shampoo as its Add-on", () => {
    const interior = serviceBySlug("interior-detail")!;
    const addOns = addOnsFor(interior);
    expect(addOns.map((a) => a.slug)).toEqual(["seat-carpet-shampoo"]);
    expect(addOns[0].basePrice).toBe(50);
  });
});

describe("priceFor — every Service x Vehicle Size x Service Mode", () => {
  for (const service of services) {
    for (const size of VEHICLE_SIZES) {
      for (const mode of SERVICE_MODES) {
        it(`${service.slug} / ${size} / ${mode} resolves`, () => {
          const result = priceFor(service, size, mode);
          expect(["price", "quoted"]).toContain(result.kind);
          if (result.kind === "price") {
            expect(result.amount).toBeGreaterThan(0);
            expect(Number.isInteger(result.amount)).toBe(true);
          }
        });
      }
    }
  }

  it("Drop-off is exactly the discount less than Mobile wherever both price", () => {
    for (const service of services.filter((s) => !s.addOnFor)) {
      for (const size of VEHICLE_SIZES) {
        const mobile = priceFor(service, size, "mobile");
        const dropoff = priceFor(service, size, "dropoff");
        expect(dropoff.kind).toBe(mobile.kind);
        if (mobile.kind === "price" && dropoff.kind === "price") {
          expect(dropoff.amount).toBe(mobile.amount - DROP_OFF_DISCOUNT);
        }
      }
    }
  });

  it("Add-on pricing is flat: same price for every size and mode", () => {
    for (const addOn of services.filter((s) => s.addOnFor)) {
      for (const size of VEHICLE_SIZES) {
        for (const mode of SERVICE_MODES) {
          expect(priceFor(addOn, size, mode)).toEqual({
            kind: "price",
            amount: addOn.basePrice,
          });
        }
      }
    }
  });

  it("matches the captured Square prices (Mobile)", () => {
    const exterior = serviceBySlug("exterior-detail")!;
    // Square booking page as re-captured 2026-09-05.
    expect(priceFor(exterior, "sedan", "mobile")).toEqual({ kind: "price", amount: 65 });
    expect(priceFor(exterior, "miniSuv", "mobile")).toEqual({ kind: "price", amount: 75 });
    expect(priceFor(exterior, "truckSuv", "mobile")).toEqual({ kind: "price", amount: 80 });
    expect(priceFor(serviceBySlug("interior-detail")!, "sedan", "mobile")).toEqual({ kind: "price", amount: 90 });
    expect(priceFor(serviceBySlug("full-detail")!, "sedan", "mobile")).toEqual({ kind: "price", amount: 150 });
    expect(priceFor(serviceBySlug("clay-and-seal")!, "sedan", "mobile")).toEqual({ kind: "price", amount: 120 });
    expect(priceFor(serviceBySlug("paint-enhancement")!, "sedan", "mobile")).toEqual({ kind: "price", amount: 250 });
    expect(priceFor(serviceBySlug("maintenance-detail")!, "sedan", "mobile")).toEqual({ kind: "price", amount: 80 });
    expect(priceFor(serviceBySlug("basic-wash")!, "sedan", "mobile")).toEqual({ kind: "price", amount: 40 });
  });

  it("larger vehicles are quoted on Full Detail and Interior Detail (open owner questions)", () => {
    for (const slug of ["full-detail", "interior-detail"]) {
      const s = serviceBySlug(slug)!;
      expect(priceFor(s, "miniSuv", "mobile")).toEqual({ kind: "quoted" });
      expect(priceFor(s, "truckSuv", "dropoff")).toEqual({ kind: "quoted" });
      expect(priceFor(s, "sedan", "mobile").kind).toBe("price");
    }
  });

  it("formats prices and quoted markers", () => {
    expect(formatPrice({ kind: "price", amount: 80 })).toBe("$80");
    expect(formatPrice({ kind: "quoted" })).toBe("Quoted");
  });
});
