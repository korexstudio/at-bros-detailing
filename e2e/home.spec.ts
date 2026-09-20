import { expect, test } from "@playwright/test";
import {
  DROP_OFF_DISCOUNT,
  business,
  sellableServices,
  serviceBySlug,
  squareBookingUrl,
} from "../src/content";

test.describe("Home — one page, in order", () => {
  test("all sections render in order", async ({ page }) => {
    await page.goto("/");
    const order = await page
      .locator("[data-section]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-section")));
    expect(order).toEqual([
      "hero",
      "trust",
      "services",
      "add-ons",
      "work",
      "problem",
      "book",
    ]);
  });

  test("hero offers Book now and a call; a Quote Request link is on the page", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("hero-book")).toHaveAttribute("href", "/#book");
    await expect(page.getByTestId("hero-call")).toHaveAttribute(
      "href",
      `tel:${business.phoneE164}`,
    );
    const smsLinks = page.locator('a[href^="sms:"]');
    expect(await smsLinks.count()).toBeGreaterThan(0);
  });

  test("pricing grid shows every sellable Service, every size, and a working toggle", async ({
    page,
  }) => {
    await page.goto("/");
    const grid = page.locator('[data-section="services"]');
    for (const s of sellableServices) {
      await expect(grid.getByRole("heading", { name: s.name, exact: true })).toBeVisible();
    }
    // Exterior Detail prices per size (Square, 2026-09-19); Full Detail is quoted above sedan.
    const exterior = grid.locator('[data-service="exterior-detail"]');
    await expect(exterior.locator('[data-size="sedan"] [data-price]')).toHaveAttribute("data-price", "$65");
    await expect(exterior.locator('[data-size="miniSuv"] [data-price]')).toHaveAttribute("data-price", "$75");
    await expect(exterior.locator('[data-size="truckSuv"] [data-price]')).toHaveAttribute("data-price", "$80");
    const full = grid.locator('[data-service="full-detail"]');
    await expect(full.locator('[data-size="sedan"] [data-price]')).toHaveAttribute("data-price", "$150");
    await expect(full.locator('[data-size="truckSuv"] [data-price]')).toHaveAttribute("data-price", "Quoted");
    await grid.getByRole("radio", { name: "Drop-off" }).click();
    await expect(exterior.locator('[data-size="sedan"] [data-price]')).toHaveAttribute(
      "data-price",
      `$${65 - DROP_OFF_DISCOUNT}`,
    );
  });

  test("Full Detail carries the Most Popular badge and no other card does", async ({
    page,
  }) => {
    await page.goto("/");
    const grid = page.locator('[data-section="services"]');
    await expect(grid.getByText("Most popular", { exact: true })).toHaveCount(1);
    await expect(
      grid.locator('[data-service="full-detail"]').getByText("Most popular"),
    ).toBeVisible();
  });

  test("Book <Service> on a card preselects it on the form and scrolls there without a reload", async ({
    page,
  }) => {
    await page.goto("/");
    // MotionLayer stamps this after hydration, so the link's handler is live.
    await expect(page.locator("html")).toHaveAttribute("data-motion", /./);
    await page.evaluate(() => {
      (window as Window & { __sameDocument?: boolean }).__sameDocument = true;
    });
    await page
      .locator('[data-service="clay-and-seal"]')
      .getByRole("link", { name: "Book Clay and Seal" })
      .click();
    await expect(page).toHaveURL(/#book$/);
    const book = page.locator('[data-section="book"]');
    await expect(book.getByTestId("book-service")).toHaveValue("clay-and-seal");
    await expect
      .poll(async () => {
        const box = await book.boundingBox();
        const viewport = page.viewportSize()!;
        return box !== null && box.y < viewport.height && box.y + box.height > 0;
      })
      .toBe(true);
    expect(
      await page.evaluate(
        () => (window as Window & { __sameDocument?: boolean }).__sameDocument,
      ),
    ).toBe(true);
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

  test("after Send & text us, the form gives way to a confirmation with call and DM", async ({
    page,
  }) => {
    await page.goto("/");
    const book = page.locator('[data-section="book"]');
    await book.getByTestId("book-text").click();
    const sent = book.getByTestId("book-sent");
    await expect(sent).toBeVisible();
    await expect(sent).toContainText("Thanks — you're set.");
    await expect(sent).toContainText("If it didn't open, call or DM us directly");
    await expect(sent.getByTestId("sent-call")).toHaveAttribute(
      "href",
      `tel:${business.phoneE164}`,
    );
    await expect(sent.getByTestId("sent-dm")).toHaveAttribute("href", business.instagramUrl);
    await sent.getByRole("button", { name: "Start over" }).click();
    await expect(book.getByTestId("book-text")).toBeVisible();
  });

  test("a full reload resets Vehicle Size and Service Mode to Sedan and Mobile", async ({
    page,
  }) => {
    await page.goto("/");
    const book = page.locator('[data-section="book"]');
    await book.getByTestId("book-service").selectOption("exterior-detail");
    await book.getByRole("button", { name: "Truck / Sprinter / SUV" }).click();
    await book.getByRole("radio", { name: "Drop-off" }).click();
    await expect(book.locator("[data-price]")).toHaveAttribute(
      "data-price",
      `$${80 - DROP_OFF_DISCOUNT}`,
    );
    await page.reload();
    await expect(book.locator("[data-price]")).toHaveAttribute("data-price", "$150");
    await expect(book.getByRole("button", { name: "Sedan" })).toHaveAttribute("aria-pressed", "true");
    await expect(book.getByRole("radio", { name: "Mobile" })).toBeChecked();
  });

  test("mobile bar Text link carries the Vehicle Size once chosen, not before", async ({
    page,
  }) => {
    test.skip(test.info().project.name !== "mobile", "the action bar is phone-only");
    await page.goto("/");
    const text = page.getByRole("navigation", { name: "Quick actions" }).getByRole("link", { name: "Text" });
    await expect(text).not.toHaveAttribute("href", /My%20vehicle%20\(/);
    await page
      .locator('[data-section="book"]')
      .getByRole("button", { name: "Mini SUV" })
      .click();
    await expect(text).toHaveAttribute("href", /My%20vehicle%20\(Mini%20SUV\)/);
  });

  test("our work shows every real Before/After pair", async ({ page }) => {
    await page.goto("/");
    const work = page.locator('[data-section="work"]');
    await work.scrollIntoViewIfNeeded();
    await expect(work.getByRole("heading", { name: "Real cars. Real results." })).toBeVisible();
    expect(await work.locator("img").count()).toBeGreaterThanOrEqual(6);
  });

  test("no horizontal overflow at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("footer names the 626 cities", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    for (const city of business.cities.slice(0, 5)) {
      await expect(footer.getByText(city, { exact: true })).toBeVisible();
    }
  });
});
