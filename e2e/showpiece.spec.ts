import { expect, test } from "@playwright/test";
import { realBeforeAfters } from "../src/content";

const hasRealPairs = realBeforeAfters().length > 0;

test.describe("Reveal-wipe showpiece — honesty gate", () => {
  test("the section renders only when the manifest has real pairs", async ({
    page,
  }) => {
    await page.goto("/");
    const slot = page.locator('[data-section="showpiece-slot"]');
    await expect(slot).toHaveCount(1);

    const wipeCount = await page.locator('[data-section="showpiece"]').count();
    expect(wipeCount).toBe(hasRealPairs ? 1 : 0);
  });

  test("an empty slot adds no height (no layout shift when absent)", async ({
    page,
  }) => {
    test.skip(hasRealPairs, "manifest has real pairs; slot is intentionally tall");
    await page.goto("/");
    const box = await page
      .locator('[data-section="showpiece-slot"]')
      .boundingBox();
    expect(box?.height ?? 0).toBe(0);
  });

  test("reduced motion shows the manual slider instead of the scrub", async ({
    page,
  }) => {
    test.skip(!hasRealPairs, "showpiece only mounts with real pairs");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByTestId("reveal-wipe-fallback")).toBeVisible();
    await expect(
      page.getByTestId("reveal-wipe-fallback").getByRole("slider"),
    ).toBeVisible();
    await expect(page.getByTestId("reveal-wipe")).toHaveCount(0);
  });

  test("full and lite motion mount the scrubbed wipe", async ({ page }) => {
    test.skip(!hasRealPairs, "showpiece only mounts with real pairs");
    await page.goto("/");
    await expect(page.getByTestId("reveal-wipe")).toBeVisible();
  });
});
