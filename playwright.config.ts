import { defineConfig, devices } from "@playwright/test";

/**
 * Seam B: e2e against the built site. `pnpm e2e` builds nothing itself —
 * the webServer runs `next start` over the last `pnpm build`.
 *
 * PORT picks the port (default 3000). With reuseExistingServer on, a
 * stranger's dev server on 3000 would silently be tested instead — set
 * PORT=3100 (or similar) when something else already holds 3000.
 */
const port = Number(process.env.PORT ?? 3000);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `pnpm start -p ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
