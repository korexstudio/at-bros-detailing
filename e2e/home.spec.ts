import { expect, test } from "@playwright/test";
import { SQUARE_BOOKING_PAGE, business, sellableServices } from "../src/content";

test.describe("Home — the Transformation narrative", () => {
  test("all sections render in order", async ({ page }) => {
    await page.goto("/");
    const order = await page
      .locator("[data-section]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-section")));
    // "showpiece" appears nested in the slot once the manifest holds real pairs.
    expect(order.filter((s) => s !== "showpiece")).toEqual([
      "hero",
      "problem",
      "process",
      "showpiece-slot",
      "before-after",
      "services",
      "why",
      "service-area",
      "closing",
    ]);
  });

  test("hero and closing CTAs link to Square; a Quote Request CTA is present", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("hero-book")).toHaveAttribute(
      "href",
      SQUARE_BOOKING_PAGE,
    );
    await expect(page.getByTestId("closing-book")).toHaveAttribute(
      "href",
      SQUARE_BOOKING_PAGE,
    );
    const smsLinks = page.locator('a[href^="sms:"]');
    expect(await smsLinks.count()).toBeGreaterThan(0);
  });

  test("services overview shows all seven with prices and a working toggle", async ({
    page,
  }) => {
    await page.goto("/");
    const overview = page.locator('[data-section="services"]');
    for (const s of sellableServices) {
      await expect(overview.getByText(s.name, { exact: true })).toBeVisible();
    }
    // Exterior Detail sedan: $80 mobile -> $65 drop-off.
    const prices = overview.locator("[data-price]");
    await expect(prices.first()).toHaveAttribute("data-price", "$80");
    await overview.getByRole("radio", { name: "Drop-off" }).click();
    await expect(prices.first()).toHaveAttribute("data-price", "$65");
  });

  test("process chapters appear wash -> decontaminate -> protect -> interior", async ({
    page,
  }) => {
    await page.goto("/");
    const chapters = await page
      .locator("[data-chapter]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-chapter")));
    expect(chapters).toEqual(["wash", "decontaminate", "protect", "interior"]);
  });

  test("no horizontal overflow at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("service area names the 626 cities", async ({ page }) => {
    await page.goto("/");
    const area = page.locator('[data-section="service-area"]');
    for (const city of business.cities.slice(0, 5)) {
      await expect(area.getByText(city, { exact: true })).toBeVisible();
    }
  });
});
