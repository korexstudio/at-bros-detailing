import { expect, test } from "@playwright/test";
import {
  DROP_OFF_DISCOUNT,
  business,
  sellableServices,
  serviceBySlug,
  squareBookingUrl,
} from "../src/content";

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
      "book",
      "why",
      "service-area",
      "closing",
    ]);
  });

  test("hero and closing CTAs lead to Book by text; a Quote Request CTA is present", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("hero-book")).toHaveAttribute("href", "/#book");
    await expect(page.getByTestId("closing-book")).toHaveAttribute("href", "/#book");
    const smsLinks = page.locator('a[href^="sms:"]');
    expect(await smsLinks.count()).toBeGreaterThan(0);
  });

  test("services overview shows every sellable Service with prices and a working toggle", async ({
    page,
  }) => {
    await page.goto("/");
    const overview = page.locator('[data-section="services"]');
    for (const s of sellableServices) {
      await expect(overview.getByText(s.name, { exact: true })).toBeVisible();
    }
    // Exterior Detail sedan: $65 mobile, minus the drop-off discount (Square, 2026-09-19).
    const prices = overview.locator("[data-price]");
    await expect(prices.first()).toHaveAttribute("data-price", "$65");
    await overview.getByRole("radio", { name: "Drop-off" }).click();
    await expect(prices.first()).toHaveAttribute("data-price", `$${65 - DROP_OFF_DISCOUNT}`);
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
    await expect(exterior).toHaveAttribute("data-price", `$${80 - DROP_OFF_DISCOUNT}`);
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

  test("Book by text composes a prefilled text from every choice, with Square one tap away", async ({
    page,
  }) => {
    const clay = serviceBySlug("clay-and-seal")!;
    await page.goto("/");
    const book = page.locator('[data-section="book"]');
    await book.getByTestId("book-service").selectOption("clay-and-seal");
    await book.getByRole("button", { name: "Truck / Sprinter / SUV" }).click();
    await book.getByRole("radio", { name: "Drop-off" }).click();
    await book.getByRole("radio", { name: "This week" }).click();
    await book.getByTestId("book-name").fill("Sam");
    await book.getByTestId("book-vehicle").fill("2019 Tacoma");
    await expect(book.locator("[data-price]")).toHaveAttribute(
      "data-price",
      `$${120 - DROP_OFF_DISCOUNT}`,
    );
    const href = (await book.getByTestId("book-text").getAttribute("href")) ?? "";
    expect(href.startsWith(`sms:${business.phoneE164}?&body=`)).toBe(true);
    expect(decodeURIComponent(href.split("?&body=")[1])).toBe(
      "Hi AT Bros, this is Sam! I'd like to book a Clay and Seal for my Truck / Sprinter / SUV, Drop-off. Timing: This week. My vehicle: 2019 Tacoma.",
    );
    await expect(book.getByTestId("book-square")).toHaveAttribute(
      "href",
      squareBookingUrl(clay, "truckSuv"),
    );
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
