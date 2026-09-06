import { expect, test } from "@playwright/test";
import { sellableServices } from "../src/content";

const ALL_ROUTES = [
  "/",
  "/services",
  ...sellableServices.map((s) => `/services/${s.slug}`),
  "/gallery",
  "/about",
  "/contact",
];

test.describe("QA — layout", () => {
  for (const route of ALL_ROUTES) {
    test(`no horizontal overflow at 375px on ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 720 });
      await page.goto(route);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test.describe("QA — accessibility", () => {
  for (const route of ALL_ROUTES) {
    test(`every interactive element and image is labelled on ${route}`, async ({
      page,
    }) => {
      await page.goto(route);
      const problems = await page.evaluate(() => {
        const bad: string[] = [];
        document.querySelectorAll<HTMLElement>("a, button").forEach((el) => {
          const name =
            (el.textContent || "").trim() ||
            el.getAttribute("aria-label") ||
            el.getAttribute("title");
          if (!name) bad.push(`unnamed <${el.tagName.toLowerCase()}> ${el.className}`);
        });
        document.querySelectorAll("img").forEach((img) => {
          if (img.getAttribute("alt") === null) {
            bad.push(`img without alt: ${img.getAttribute("src")}`);
          }
        });
        document.querySelectorAll("input").forEach((input) => {
          const labelled =
            input.getAttribute("aria-label") ||
            input.labels?.length ||
            input.getAttribute("aria-labelledby");
          if (!labelled) bad.push(`unlabelled input type=${input.type}`);
        });
        return bad;
      });
      expect(problems).toEqual([]);
    });
  }

  test("keyboard reaches the skip link, then the header Book now, with visible focus", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.locator(".skip-link");
    await expect(skip).toBeFocused();

    // Tab through the header: home link, then Book now (nav is hidden on mobile).
    const bookNow = page.locator("header").getByRole("link", { name: "Book now" });
    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press("Tab");
      if (await bookNow.evaluate((el) => el === document.activeElement)) break;
    }
    await expect(bookNow).toBeFocused();
    const outline = await bookNow.evaluate(
      (el) => getComputedStyle(el).outlineStyle,
    );
    expect(outline).not.toBe("none");
  });

  test("sticky mobile bar exposes Book, Text, and Call", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "mobile-only bar");
    await page.goto("/");
    const bar = page.getByRole("navigation", { name: "Quick actions" });
    await expect(bar.getByRole("link", { name: "Book" })).toBeVisible();
    await expect(bar.getByRole("link", { name: "Text" })).toBeVisible();
    await expect(bar.getByRole("link", { name: "Call" })).toBeVisible();
  });
});

test.describe("QA — images", () => {
  test("below-the-fold images lazy-load", async ({ page }) => {
    await page.goto("/gallery");
    const eager = await page.evaluate(() =>
      Array.from(document.querySelectorAll("#main img"))
        .filter((img) => img.getAttribute("loading") !== "lazy")
        .map((img) => img.getAttribute("src")),
    );
    expect(eager).toEqual([]);
  });
});

test.describe("QA — performance", () => {
  // A timing measurement under 4x CPU throttle is sensitive to whatever
  // else the machine is doing (other test workers, a game client, a dev
  // server). In isolation the hero paints at ~1.75s against the 4s budget;
  // a retry lands on a fresh worker once the parallel burst has passed.
  test.describe.configure({ retries: 2 });

  test("hero LCP within budget on throttled mobile", async ({
    page,
    browserName,
    isMobile,
  }) => {
    test.skip(browserName !== "chromium" || !isMobile, "CDP mobile throttle only");

    const client = await page.context().newCDPSession(page);
    // Fast 3G-ish network, 4x CPU slowdown.
    await client.send("Network.enable");
    await client.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    await page.goto("/", { waitUntil: "load" });
    const lcp = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            resolve(entries[entries.length - 1].startTime);
          }).observe({ type: "largest-contentful-paint", buffered: true });
          setTimeout(() => resolve(-1), 3000);
        }),
    );
    expect(lcp).toBeGreaterThan(0);
    expect(lcp).toBeLessThan(4000);
  });
});
