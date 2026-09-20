import { expect, test } from "@playwright/test";
import { SQUARE_BOOKING_PAGE, business, sellableServices } from "../src/content";

test.describe("Home — the Transformation narrative", () => {
  test("all sections render in order", async ({ page }) => {
    await page.goto("/");
    const order = await page
      .locator("[data-section]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-section")));
    expect(order).toEqual([
      "hero",
      "problem",
      "process",
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
    // Exterior Detail sedan: $65 mobile -> $50 drop-off (Square, 2026-09-05).
    const prices = overview.locator("[data-price]");
    await expect(prices.first()).toHaveAttribute("data-price", "$65");
    await overview.getByRole("radio", { name: "Drop-off" }).click();
    await expect(prices.first()).toHaveAttribute("data-price", "$50");
  });

  test("Vehicle Size selector re-prices the overview: Truck makes Exterior $80 and Full Detail Quoted", async ({
    page,
  }) => {
    await page.goto("/");
    const overview = page.locator('[data-section="services"]');
    const exterior = overview.locator('[data-service="exterior-detail"] [data-price]');
    const full = overview.locator('[data-service="full-detail"] [data-price]');
    await expect(exterior).toHaveAttribute("data-price", "$65");
    await expect(full).toHaveAttribute("data-price", "$150");
    await overview.getByRole("button", { name: "Truck / Sprinter / SUV" }).click();
    await expect(exterior).toHaveAttribute("data-price", "$80");
    await expect(full).toHaveAttribute("data-price", "Quoted");
  });

  test("a full reload resets Vehicle Size and Service Mode to Sedan and Mobile", async ({
    page,
  }) => {
    await page.goto("/");
    const overview = page.locator('[data-section="services"]');
    const exterior = overview.locator('[data-service="exterior-detail"] [data-price]');
    await overview.getByRole("button", { name: "Truck / Sprinter / SUV" }).click();
    await overview.getByRole("radio", { name: "Drop-off" }).click();
    await expect(exterior).toHaveAttribute("data-price", "$65");
    await page.reload();
    await expect(exterior).toHaveAttribute("data-price", "$65");
    await expect(overview.getByRole("button", { name: "Sedan" })).toHaveAttribute("aria-pressed", "true");
    await expect(overview.getByRole("radio", { name: "Mobile" })).toBeChecked();
  });

  test("Full Detail carries the Most Popular badge and no other card does", async ({
    page,
  }) => {
    await page.goto("/");
    const overview = page.locator('[data-section="services"]');
    const badges = overview.getByText("Most popular", { exact: true });
    await expect(badges).toHaveCount(1);
    await expect(
      overview.locator('[data-service="full-detail"]').getByText("Most popular"),
    ).toBeVisible();
  });

  test("mobile bar Text link carries the Vehicle Size once chosen, not before", async ({
    page,
  }) => {
    test.skip(test.info().project.name !== "mobile", "the action bar is phone-only");
    await page.goto("/");
    const text = page.getByRole("navigation", { name: "Quick actions" }).getByRole("link", { name: "Text" });
    await expect(text).not.toHaveAttribute("href", /My%20vehicle%20\(/);
    await page
      .locator('[data-section="services"]')
      .getByRole("button", { name: "Mini SUV" })
      .click();
    await expect(text).toHaveAttribute("href", /My%20vehicle%20\(Mini%20SUV\)/);
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
