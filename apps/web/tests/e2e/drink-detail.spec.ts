import { expect, test } from "@playwright/test"
import { mockApi } from "./support/api-mock"
import { captureScreenshot } from "./support/screenshot"

test.describe("drink detail", () => {
  test("shows the drink, its brand and every country", async ({
    page,
  }, testInfo) => {
    await mockApi(page)
    await page.goto("/drinks/drink-cherry")

    await expect(page.getByRole("heading", { name: "Cherry" })).toBeVisible()
    await expect(page.getByText("Coca-Cola")).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Available in 3 countries" }),
    ).toBeVisible()
    await expect(page.getByRole("listitem")).toHaveText([
      "Canada",
      "United Kingdom",
      "United States of America",
    ])
    await expect(page).toHaveTitle("Cherry · Sipdex")
    await expect(page.getByRole("button", { name: "Tasted" })).toHaveCount(0)

    await captureScreenshot(page, testInfo, "drink-detail")
  })

  test("toggles the tasted state for a signed-in user", async ({
    page,
  }, testInfo) => {
    await mockApi(page, {
      role: "user",
      routes: {
        "POST /api/drinks/drink-exotic/taste": () => ({
          status: 201,
          body: { result: { drinkId: "drink-exotic", tasted: true } },
        }),
        "DELETE /api/drinks/drink-exotic/taste": () => ({
          result: { drinkId: "drink-exotic", tasted: false },
        }),
      },
    })
    await page.goto("/drinks/drink-exotic")

    const toggle = page.getByRole("button", { name: "Tasted" })

    await expect(toggle).toHaveAttribute("aria-pressed", "false")
    await toggle.click()
    await expect(toggle).toHaveAttribute("aria-pressed", "true")

    await captureScreenshot(page, testInfo, "drink-detail-tasted")

    await toggle.click()
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
  })

  test("goes back to the catalogue", async ({ page }) => {
    await mockApi(page)
    await page.goto("/drinks/drink-lemon")

    await page.getByRole("link", { name: "All drinks" }).click()

    await expect(page).toHaveURL("/")
    await expect(page.getByRole("heading", { name: "Drinks" })).toBeVisible()
  })

  test("explains when the drink does not exist", async ({ page }) => {
    await mockApi(page)
    await page.goto("/drinks/unknown")

    await expect(page.getByText("This drink doesn't exist")).toBeVisible()
  })
})
