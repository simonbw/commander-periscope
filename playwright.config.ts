import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests drive 8 isolated browser contexts (one per player) through
 * a real game against a local, anonymous Convex backend + the Vite dev server.
 *
 * Set E2E_BASE_URL to smoke-test a deployed site instead (no local servers):
 *   E2E_BASE_URL=https://commander-periscope.vercel.app npm run e2e
 */
const baseURL = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "e2e",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: baseURL ?? "http://localhost:8080",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  // Two servers so a dead backend fails fast instead of hanging on "Loading".
  webServer: baseURL ? [] : [
    {
      command: "CONVEX_AGENT_MODE=anonymous npx convex dev --tail-logs disable",
      url: "http://127.0.0.1:3212/version",
      reuseExistingServer: true,
      timeout: 120_000,
      stdout: "pipe",
    },
    {
      command: "npx vite",
      url: "http://localhost:8080",
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
