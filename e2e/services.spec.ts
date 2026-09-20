import { expect, test } from "@playwright/test";
import {
  DROP_OFF_DISCOUNT,
  sellableServices,
  squareBookingUrl,
} from "../src/content";

test.describe("Services index", () => {
  test("lists every Service with live prices, working controls, and the Most Popular badge", async ({
    page,
  }) => {
    await page.goto("/services");
    const main = page.locator("#main");
    for (const s of sellableServices) {
      await expect(main.getByText(s.name, { exact: true })).toBeVisible();
    }
    const exterior = main.locator('[data-service="exterior-detail"] [data-price]');
    await expect(exterior).toHaveAttribute("data-price", "$65");
    await main.getByRole("radio", { name: "Drop-off" }).click();
    await expect(exterior).toHaveAttribute("data-price", `$${65 - DROP_OFF_DISCOUNT}`);
    await main.getByRole("button", { name: "Mini SUV" }).click();
    await expect(exterior).toHaveAttribute("data-price", `$${75 - DROP_OFF_DISCOUNT}`);
    await expect(main.getByText("Most popular", { exact: true })).toHaveCount(1);
  });
});

test.describe("Service pages", () => {
  for (const service of sellableServices) {
    test(`${service.slug}: Book now is a prefilled text naming the Service; Square stays one tap away`, async ({
      page,
    }) => {
      await page.goto(`/services/${service.slug}`);
      const bookNow = page.getByTestId("book-now");
      await expect(bookNow).toBeVisible();
      const href = (await bookNow.getAttribute("href")) ?? "";
      expect(href.startsWith("sms:+16267882004?&body=")).toBe(true);
      expect(decodeURIComponent(href.split("?&body=")[1])).toContain(`book a ${service.name}`);
      await expect(page.getByTestId("book-square")).toHaveAttribute(
        "href",
        squareBookingUrl(service),
      );
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

  test("the Square link follows the selected Vehicle Size on Exterior Detail", async ({
    page,
  }) => {
    const exterior = sellableServices.find((s) => s.slug === "exterior-detail")!;
    await page.goto("/services/exterior-detail");
    const bookNow = page.getByTestId("book-square");
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
    await page.goto("/services/maintenance-detail");
    await expect(page.getByRole("button", { name: "Mini SUV" })).toHaveCount(0);
  });

  test("a Vehicle Size chosen on the home page follows the visitor to the Service page", async ({
    page,
  }) => {
    const exterior = sellableServices.find((s) => s.slug === "exterior-detail")!;
    await page.goto("/");
    const overview = page.locator('[data-section="services"]');
    await overview.getByRole("button", { name: "Truck / Sprinter / SUV" }).click();
    await overview.locator('[data-service="exterior-detail"] a').first().click();
    await expect(page).toHaveURL(/\/services\/exterior-detail$/);
    await expect(page.getByTestId("book-square")).toHaveAttribute(
      "href",
      squareBookingUrl(exterior, "truckSuv"),
    );
    await expect(page.locator("[data-price]").first()).toHaveAttribute("data-price", "$80");
  });

  test("Quote Request names the Vehicle Size only after it is chosen", async ({
    page,
  }) => {
    await page.goto("/services/full-detail");
    const quote = page.getByTestId("quote-request");
    await expect(quote).toHaveAttribute("href", /My%20vehicle%3A%20/);
    await expect(quote).not.toHaveAttribute("href", /My%20vehicle%20\(/);
    await page.getByRole("button", { name: "Mini SUV" }).click();
    await expect(quote).toHaveAttribute("href", /My%20vehicle%20\(Mini%20SUV\)%3A%20/);
  });

  test("Interior Detail shows its Add-on", async ({ page }) => {
    await page.goto("/services/interior-detail");
    await expect(page.getByText("Seat/Carpet Shampoo")).toBeVisible();
  });

  test("Paint Enhancement shows the 3-Year Ceramic Coating Add-on", async ({ page }) => {
    await page.goto("/services/paint-enhancement");
    await expect(page.getByText("3-Year Ceramic Coating")).toBeVisible();
  });
});
