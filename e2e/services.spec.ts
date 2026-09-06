import { expect, test } from "@playwright/test";
import {
  DROP_OFF_DISCOUNT,
  sellableServices,
  squareBookingUrl,
} from "../src/content";

test.describe("Service pages", () => {
  for (const service of sellableServices) {
    test(`${service.slug}: Book now deep-links to Square`, async ({ page }) => {
      await page.goto(`/services/${service.slug}`);
      const bookNow = page.getByTestId("book-now");
      await expect(bookNow).toBeVisible();
      await expect(bookNow).toHaveAttribute("href", squareBookingUrl(service));
    });
  }

  test("Quote Request CTA is an sms: link", async ({ page }) => {
    await page.goto("/services/exterior-detail");
    const quote = page.getByTestId("quote-request");
    await expect(quote).toHaveAttribute("href", /^sms:\+16267882004/);
  });

  test("toggling Service Mode changes the price by exactly the discount", async ({
    page,
  }) => {
    await page.goto("/services/exterior-detail");
    const price = page.locator("[data-price]").first();

    await expect(price).toHaveAttribute("data-price", "$65");
    await page.getByRole("radio", { name: "Drop-off" }).click();
    await expect(price).toHaveAttribute(
      "data-price",
      `$${65 - DROP_OFF_DISCOUNT}`,
    );
    await page.getByRole("radio", { name: "Mobile" }).click();
    await expect(price).toHaveAttribute("data-price", "$65");
  });

  test("Vehicle Size selector changes the price on size-priced Services", async ({
    page,
  }) => {
    await page.goto("/services/exterior-detail");
    const price = page.locator("[data-price]").first();

    await page.getByRole("button", { name: "Mini SUV" }).click();
    await expect(price).toHaveAttribute("data-price", "$75");
    await page.getByRole("button", { name: "Truck / Sprinter / SUV" }).click();
    await expect(price).toHaveAttribute("data-price", "$80");
  });

  test("Book now follows the selected Vehicle Size on Exterior Detail", async ({
    page,
  }) => {
    const exterior = sellableServices.find((s) => s.slug === "exterior-detail")!;
    await page.goto("/services/exterior-detail");
    const bookNow = page.getByTestId("book-now");
    await expect(bookNow).toHaveAttribute("href", squareBookingUrl(exterior, "sedan"));
    await page.getByRole("button", { name: "Mini SUV" }).click();
    await expect(bookNow).toHaveAttribute("href", squareBookingUrl(exterior, "miniSuv"));
    await page.getByRole("button", { name: "Truck / Sprinter / SUV" }).click();
    await expect(bookNow).toHaveAttribute("href", squareBookingUrl(exterior, "truckSuv"));
    // Three distinct Square items.
    const hrefs = (["sedan", "miniSuv", "truckSuv"] as const).map((s) =>
      squareBookingUrl(exterior, s),
    );
    expect(new Set(hrefs).size).toBe(3);
  });

  test("larger vehicles on Full Detail show Quoted with a Quote Request handoff", async ({
    page,
  }) => {
    await page.goto("/services/full-detail");
    await page.getByRole("button", { name: "Mini SUV" }).click();
    await expect(page.locator("[data-price]").first()).toHaveAttribute(
      "data-price",
      "Quoted",
    );
    await expect(
      page.getByRole("link", { name: /text us for your price/i }),
    ).toHaveAttribute("href", /^sms:/);
  });

  test("Vehicle Size selector is absent where sizes don't exist", async ({
    page,
  }) => {
    await page.goto("/services/basic-wash");
    await expect(page.getByRole("button", { name: "Mini SUV" })).toHaveCount(0);
  });

  test("Interior Detail shows its Add-on", async ({ page }) => {
    await page.goto("/services/interior-detail");
    await expect(page.getByText("Seat/Carpet Shampoo")).toBeVisible();
  });
});
