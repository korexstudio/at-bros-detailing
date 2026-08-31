import { expect, test } from "@playwright/test";
import { business } from "../src/content";

test.describe("About", () => {
  test("renders the story placeholder, hours, and cities from the content module", async ({
    page,
  }) => {
    await page.goto("/about");
    const main = page.locator("#main");
    await expect(main.locator('[data-placeholder="founder-story"]')).toBeVisible();
    await expect(main.getByText("5:30 PM – 8:00 PM").first()).toBeVisible();
    await expect(main.getByText("Pasadena", { exact: true })).toBeVisible();
    await expect(main.getByTestId("book-now")).toBeVisible();
  });
});

test.describe("Contact", () => {
  test("call and text actions use the link builders; number shown plainly", async ({
    page,
  }) => {
    await page.goto("/contact");
    const main = page.locator("#main");
    await expect(main.getByTestId("contact-call")).toHaveAttribute(
      "href",
      `tel:${business.phoneE164}`,
    );
    await expect(main.getByTestId("contact-text")).toHaveAttribute(
      "href",
      /^sms:\+16267882004\?&body=/,
    );
    await expect(
      main.getByRole("link", { name: business.phoneDisplay }),
    ).toBeVisible();
    await expect(main.getByTestId("book-now")).toBeVisible();
  });
});

test.describe("No street address anywhere", () => {
  for (const path of ["/", "/about", "/contact", "/gallery", "/services"]) {
    test(`no address pattern on ${path}`, async ({ page }) => {
      await page.goto(path);
      const text = await page.locator("body").innerText();
      expect(text).not.toMatch(
        /\d{2,5}\s+[A-Z][a-z]+\s+(St|Ave|Blvd|Dr|Rd|Lane|Ln|Way|Court|Ct)\b/,
      );
    });
  }
});
