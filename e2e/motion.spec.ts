import { expect, test } from "@playwright/test";

test.describe("Motion layer — reduced motion", () => {
  test("scroll effects are disabled and content is fully visible", async ({
    page,
  }) => {
    // test.use({ reducedMotion }) does not reach matchMedia in this
    // environment; emulateMedia does.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
    // No smooth scroll bootstrapped.
    await expect(page.locator("html")).not.toHaveAttribute("data-smooth-scroll", "on");

    // Every section heading is visible without scrolling tricks.
    const headings = page.locator("[data-section] h2");
    const count = await headings.count();
    expect(count).toBeGreaterThan(4);
    for (let i = 0; i < count; i += 1) {
      const h = headings.nth(i);
      await h.scrollIntoViewIfNeeded();
      await expect(h).toBeVisible();
      const opacity = await h.evaluate((el) => getComputedStyle(el).opacity);
      expect(Number(opacity)).toBe(1);
    }

    // Hero atmosphere stays off.
    await expect(page.locator(".hero-sweep")).toBeHidden();
    await expect(page.locator(".hero-grain")).toBeHidden();
  });
});

test.describe("Motion layer — full motion", () => {
  test("desktop gets smooth scroll, parallax, and the hero atmosphere", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "mobile gets the lite treatment");
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
    await expect(page.locator("html")).toHaveAttribute("data-smooth-scroll", "on");
    await expect(page.locator(".hero-grain")).toBeVisible();
  });

  test("mobile gets the lite treatment", async ({ page, isMobile }) => {
    test.skip(!isMobile, "desktop-only assertion inverse");
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "lite");
    // No smooth scroll or parallax on lite.
    await expect(page.locator("html")).not.toHaveAttribute("data-smooth-scroll", "on");
  });

  test("content is reachable at the bottom under full motion", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("End");
    await expect(page.locator('[data-section="closing"] h2')).toBeVisible();
  });
});
