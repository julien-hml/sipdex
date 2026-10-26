import { expect, test } from "@playwright/test"
import { fixtureDrinks } from "../fixtures/drinks"
import { mockApi } from "./support/api-mock"
import { captureScreenshot } from "./support/screenshot"

test.describe("home", () => {
  test("lists the catalogue for anonymous visitors", async ({
    page,
  }, testInfo) => {
    await mockApi(page)
    await page.goto("/")

    await expect(page.getByRole("heading", { name: "Drinks" })).toBeVisible()
    await expect(page.getByRole("listitem")).toHaveCount(fixtureDrinks.length)
    await expect(page.getByRole("link", { name: "Orange" })).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Mark as tasted" }),
    ).toHaveCount(0)

    await captureScreenshot(page, testInfo, "home")
  })

  test("lets a signed-in user mark a drink as tasted", async ({
    page,
  }, testInfo) => {
    await mockApi(page, {
      role: "user",
      routes: {
        "POST /api/drinks/drink-orange/taste": () => ({
          status: 201,
          body: { result: { drinkId: "drink-orange", tasted: true } },
        }),
      },
    })
    await page.goto("/")

    const orange = page.getByRole("listitem").filter({ hasText: "Orange" })

    await orange.getByRole("button", { name: "Mark as tasted" }).click()

    await expect(
      orange.getByRole("button", { name: "Mark as not tasted" }),
    ).toHaveAttribute("aria-pressed", "true")

    await captureScreenshot(page, testInfo, "home-signed-in")
  })

  test("opens a drink from its card", async ({ page }) => {
    await mockApi(page)
    await page.goto("/")

    await page.getByRole("link", { name: "Grape" }).click()

    await expect(page).toHaveURL("/drinks/drink-grape")
    await expect(page.getByRole("heading", { name: "Grape" })).toBeVisible()
  })

  test("is translated in French", async ({ browser }) => {
    const context = await browser.newContext({ locale: "fr-FR" })
    const page = await context.newPage()

    await mockApi(page)
    await page.goto("/")

    await expect(page.getByRole("heading", { name: "Boissons" })).toBeVisible()
    await expect(page.locator("html")).toHaveAttribute("lang", "fr")

    await context.close()
  })

  test("offers a retry when the catalogue fails to load", async ({ page }) => {
    let isDown = true

    await mockApi(page, {
      routes: {
        "GET /api/drinks": () =>
          isDown
            ? { status: 500, body: { error: "Boom", key: "INTERNAL_ERROR" } }
            : { result: fixtureDrinks },
      },
    })
    await page.goto("/")

    await expect(page.getByText("A server error occurred")).toBeVisible()
    isDown = false
    await page.getByRole("button", { name: "Retry" }).click()

    await expect(page.getByRole("listitem")).toHaveCount(fixtureDrinks.length)
  })
})
