import { defineConfig, devices } from "@playwright/test"

const PORT = 3001
const BASE_URL = `http://localhost:${PORT}`
const isCI = Boolean(process.env.CI)

// The API is mocked at the network layer (see tests/e2e/support/api-mock.ts),
// so the suite only needs the Next.js app itself: no database or S3.
export default defineConfig({
  testDir: "tests/e2e",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    locale: "en-US",
    colorScheme: "light",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "pnpm build && pnpm start",
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
})
