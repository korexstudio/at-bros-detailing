import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { business, galleryManifest, services } from "./index";

const PUBLIC_DIR = path.resolve(__dirname, "../../public");

describe("gallery manifest", () => {
  it("every manifest image file exists on disk", () => {
    const files = [
      ...galleryManifest.beforeAfters.flatMap((p) => [p.before, p.after]),
      ...galleryManifest.finishedCars.map((f) => f.src),
    ];
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      expect(existsSync(path.join(PUBLIC_DIR, file)), file).toBe(true);
    }
  });

  it("every entry names an alt text and a Service", () => {
    for (const p of [...galleryManifest.beforeAfters, ...galleryManifest.finishedCars]) {
      expect(p.alt.length).toBeGreaterThan(10);
      expect(services.some((s) => s.slug === p.service), p.id).toBe(true);
    }
  });
});

describe("copy hygiene", () => {
  it("no stale Square prices leak into descriptions", () => {
    // The Square exterior copy contains stale "$60.00" / "80.00" figures.
    for (const s of services) {
      const text = [s.pitch, ...s.description, ...s.included].join(" ");
      expect(text, s.slug).not.toMatch(/\$\s?\d/);
    }
  });

  it("no street address anywhere in the content module", () => {
    const blob = JSON.stringify({ business, services, galleryManifest });
    // The drop-off rule: address is shared on booking, never published.
    expect(blob).not.toMatch(/\d+\s+(N|S|E|W|North|South|East|West)?\.?\s?\w+\s(St|Ave|Blvd|Dr|Road|Rd|Lane|Ln)\b/i);
  });
});

describe("launch-gate parser stays honest", () => {
  it("the gate script's source-regex count matches realBeforeAfters()", async () => {
    // scripts/check-launch-gate.mjs cannot import TS, so it regex-counts
    // real pairs in gallery.ts source. This test pins the two together:
    // refactor gallery.ts in a way that breaks the regex and this fails.
    const { readFileSync } = await import("node:fs");
    const source = readFileSync(
      path.resolve(__dirname, "./gallery.ts"),
      "utf8",
    );
    const beforeAftersSection = source.split("finishedCars")[0];
    const parsedCount = (beforeAftersSection.match(/isPlaceholder:\s*false/g) ?? [])
      .length;
    const { realBeforeAfters } = await import("./gallery");
    expect(parsedCount).toBe(realBeforeAfters().length);
  });
});

describe("business facts", () => {
  it("carries hours for all seven days", () => {
    expect(business.hours).toHaveLength(7);
    expect(business.hours.map((h) => h.day)).toEqual([
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    ]);
  });

  it("phone forms agree", () => {
    expect(business.phoneE164).toBe("+16267882004");
    expect(business.phoneDisplay).toBe("(626) 788-2004");
  });

  it("serves cities in the San Gabriel Valley", () => {
    expect(business.cities.length).toBeGreaterThanOrEqual(10);
    expect(business.cities).toContain("Pasadena");
  });
});
