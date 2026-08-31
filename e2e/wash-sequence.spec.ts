import { expect, test } from "@playwright/test";

test.describe("Wash sequence", () => {
  test("desktop full-motion gets the pinned scrub with all four stages", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "mobile-lite gets stacked chapters");
    await page.goto("/");
    const pinned = page.getByTestId("wash-sequence-pinned");
    await expect(pinned).toBeVisible();
    const stages = await pinned
      .locator("[data-chapter]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-chapter")));
    expect(stages).toEqual(["wash", "decontaminate", "protect", "interior"]);
  });

  test("scrolling advances the wipe and it scrubs back", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "mobile-lite gets stacked chapters");
    await page.goto("/");
    const pinned = page.getByTestId("wash-sequence-pinned");
    // Jump to the pin START (scrollIntoView would land mid-spacer, mid-scrub).
    await page.evaluate(() => {
      const spacer =
        document.querySelector(".pin-spacer") ??
        document.querySelector('[data-testid="wash-sequence-pinned"]')!;
      window.scrollTo(0, spacer.getBoundingClientRect().top + window.scrollY);
    });
    await page.waitForTimeout(400);
    const secondLayer = pinned.locator('[data-chapter="decontaminate"]');
    // The hidden fraction of the layer: 100 = fully clipped, 0 = fully wiped in.
    const clippedPercent = () =>
      secondLayer.evaluate(
        (el) => Number(el.style.clipPath.match(/([\d.]+)%/)?.[1] ?? NaN),
      );

    // (Essentially) fully clipped at the pin start.
    expect(await clippedPercent()).toBeGreaterThan(98);

    // Scrub forward: the wipe advances well past the start.
    await page.mouse.wheel(0, 3500);
    await expect.poll(clippedPercent).toBeLessThan(90);

    // Scrub back to the top: fully clipped again.
    await page.mouse.wheel(0, -20000);
    await expect
      .poll(clippedPercent, { timeout: 10_000 })
      .toBeGreaterThan(98);
  });

  test("reduced motion gets stacked chapters, no pin", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByTestId("wash-sequence-stacked")).toBeVisible();
    await expect(page.getByTestId("wash-sequence-pinned")).toHaveCount(0);
    const stages = await page
      .locator("[data-chapter]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-chapter")));
    expect(stages).toEqual(["wash", "decontaminate", "protect", "interior"]);
  });

  test("every stage layer names the still it needs", async ({ page }) => {
    await page.goto("/");
    const labels = page.getByText(/Still \d —/);
    await expect(labels).toHaveCount(4);
  });
});
