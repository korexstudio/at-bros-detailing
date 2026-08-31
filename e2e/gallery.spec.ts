import { expect, test } from "@playwright/test";
import { galleryManifest } from "../src/content";

test.describe("Gallery", () => {
  test("renders a compare slider per manifest pair with labelled sides", async ({
    page,
  }) => {
    await page.goto("/gallery");
    const sliders = page.getByTestId("compare-slider");
    await expect(sliders).toHaveCount(galleryManifest.beforeAfters.length);
    const first = sliders.first();
    await expect(first.getByText("Before", { exact: true })).toBeVisible();
    await expect(first.getByText("After", { exact: true })).toBeVisible();
  });

  test("slider moves with keyboard", async ({ page }) => {
    await page.goto("/gallery");
    const input = page
      .getByTestId("compare-slider")
      .first()
      .getByRole("slider");
    await input.focus();
    const before = await input.inputValue();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    const after = await input.inputValue();
    expect(Number(after)).toBe(Number(before) + 2);
  });

  test("slider moves with mouse drag", async ({ page }) => {
    await page.goto("/gallery");
    const slider = page.getByTestId("compare-slider").first();
    const box = (await slider.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.85, box.y + box.height / 2);
    await page.mouse.up();
    const value = await slider.getByRole("slider").inputValue();
    expect(Number(value)).toBeGreaterThan(70);
  });

  test("finished-car grid renders from the manifest with alt text", async ({
    page,
  }) => {
    await page.goto("/gallery");
    for (const car of galleryManifest.finishedCars) {
      const img = page.locator(`img[src="${car.src}"]`);
      await expect(img).toHaveAttribute("alt", car.alt);
    }
  });

  test("placeholder entries are clearly marked", async ({ page }) => {
    await page.goto("/gallery");
    const placeholderCount =
      galleryManifest.beforeAfters.filter((p) => p.isPlaceholder).length +
      galleryManifest.finishedCars.filter((c) => c.isPlaceholder).length;
    if (placeholderCount > 0) {
      await expect(
        page.getByText(/placeholder/i).first(),
      ).toBeVisible();
    }
  });
});
