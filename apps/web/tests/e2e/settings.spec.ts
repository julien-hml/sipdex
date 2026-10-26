import { expect, test } from "@playwright/test"
import { mockApi } from "./support/api-mock"
import { captureScreenshot } from "./support/screenshot"

test.describe("settings", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page)
  })

  test("is reachable from the header", async ({ page }, testInfo) => {
    await page.goto("/")

    await page.getByRole("link", { name: "Settings" }).click()

    await expect(page).toHaveURL("/settings")
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible()
    await expect(page.getByLabel("Theme")).toHaveText("System")
    await expect(page.getByLabel("Language")).toHaveText("English")

    await captureScreenshot(page, testInfo, "settings")
  })

  test("switches and remembers the theme", async ({ page }, testInfo) => {
    await page.goto("/settings")

    await page.getByLabel("Theme").click()
    await captureScreenshot(page, testInfo, "settings-theme-open")
    await page.getByRole("option", { name: "Dark" }).click()

    await expect(page.locator("html")).toHaveClass(/dark/u)

    await page.reload()

    await expect(page.locator("html")).toHaveClass(/dark/u)
    await expect(page.getByLabel("Theme")).toHaveText("Dark")
  })

  test("switches and remembers the language", async ({ page }, testInfo) => {
    await page.goto("/settings")

    await page.getByLabel("Language").click()
    await page.getByRole("option", { name: "Français" }).click()

    await expect(
      page.getByRole("heading", { name: "Paramètres" }),
    ).toBeVisible()
    await expect(page.locator("html")).toHaveAttribute("lang", "fr")
    await captureScreenshot(page, testInfo, "settings-french")

    await page.goto("/")

    await expect(page.getByRole("heading", { name: "Boissons" })).toBeVisible()
  })
})
