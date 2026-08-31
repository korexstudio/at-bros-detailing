import { expect, test } from "@playwright/test";
import { business, sellableServices } from "../src/content";

const ROUTES = [
  "/",
  "/services",
  "/services/exterior-detail",
  "/services/clay-and-seal",
  "/gallery",
  "/about",
  "/contact",
];

test.describe("SEO layer", () => {
  test("every route has unique metadata and an OG image", async ({ page }) => {
    const titles: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      const title = await page.title();
      expect(title.length, `${route} title`).toBeGreaterThan(10);
      titles.push(title);
      const description = page.locator('meta[name="description"]');
      await expect(description, `${route} description`).toHaveAttribute(
        "content",
        /.{40,}/,
      );
      const ogImage = page.locator('meta[property="og:image"]').first();
      await expect(ogImage, `${route} og:image`).toHaveAttribute(
        "content",
        /opengraph-image/,
      );
    }
    expect(new Set(titles).size).toBe(titles.length);
  });

  test("Service page titles pair the Service with the locale", async ({
    page,
  }) => {
    for (const s of sellableServices.slice(0, 3)) {
      await page.goto(`/services/${s.slug}`);
      const title = await page.title();
      expect(title).toContain(s.name);
      expect(title).toMatch(/626|San Gabriel/);
    }
  });

  test("LocalBusiness JSON-LD carries hours, phone, cities — and no address", async ({
    page,
  }) => {
    await page.goto("/");
    const raw = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const jsonLd = JSON.parse(raw!);
    expect(jsonLd["@type"]).toContain("LocalBusiness");
    expect(jsonLd.telephone).toBe(business.phoneE164);
    expect(jsonLd.openingHoursSpecification.length).toBe(7);
    expect(
      jsonLd.areaServed.map((c: { name: string }) => c.name),
    ).toContain("Pasadena");
    expect(jsonLd).not.toHaveProperty("address");
  });

  test("sitemap lists all pages", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBe(true);
    const xml = await res.text();
    for (const s of sellableServices) {
      expect(xml).toContain(`/services/${s.slug}`);
    }
    for (const path of ["/services", "/gallery", "/about", "/contact"]) {
      expect(xml).toContain(path);
    }
  });

  test("robots allows indexing and points at the sitemap", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBe(true);
    const text = await res.text();
    expect(text).toMatch(/Allow: \//);
    expect(text).not.toMatch(/Disallow: \/$/m);
    expect(text).toContain("sitemap.xml");
  });

  test("OG images actually render", async ({ request }) => {
    for (const path of ["/opengraph-image", "/services/exterior-detail/opengraph-image"]) {
      const res = await request.get(path);
      expect(res.ok(), path).toBe(true);
      expect(res.headers()["content-type"]).toContain("image/png");
    }
  });
});
