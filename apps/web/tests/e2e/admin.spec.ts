import { expect, test } from "@playwright/test"
import { FIXTURE_IMAGE_HOST, fixtureDrinks } from "../fixtures/drinks"
import { mockApi } from "./support/api-mock"
import { captureScreenshot } from "./support/screenshot"
import { fixturePng } from "./support/upload"

const CAN_URL = `${FIXTURE_IMAGE_HOST}/drinks/drink-cherry.svg`
const LOGO_URL = `${FIXTURE_IMAGE_HOST}/brands/fanta.svg`

test.describe("admin", () => {
  test("is hidden from and closed to regular users", async ({ page }) => {
    await mockApi(page, { role: "user" })
    await page.goto("/")

    await expect(page.getByRole("link", { name: "Profile" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Admin" })).toHaveCount(0)

    await page.goto("/admin")

    await expect(page).toHaveURL("/")
  })

  test("creates a brand with its logo", async ({ page }, testInfo) => {
    let uploaded: string | null = null

    await mockApi(page, {
      role: "admin",
      routes: {
        "POST /api/brands": (request) => {
          uploaded = request.postData()

          return {
            status: 201,
            body: {
              result: { id: "brand-new", name: "Oasis", logoUrl: LOGO_URL },
            },
          }
        },
      },
    })
    await page.goto("/")
    await page.getByRole("link", { name: "Admin" }).click()

    await page.getByRole("button", { name: "Add brand" }).click()
    await expect(page.getByText("Please enter a brand name")).toBeVisible()
    await expect(page.getByText("Please add a logo")).toBeVisible()

    await page.getByRole("textbox", { name: "Brand" }).fill("Oasis")
    await page
      .getByLabel("Logo")
      .setInputFiles(await fixturePng(page, "oasis.png", LOGO_URL))
    await expect(
      page.getByRole("img", { name: "Selected image" }),
    ).toBeVisible()
    await captureScreenshot(page, testInfo, "admin-brand")

    await page.getByRole("button", { name: "Add brand" }).click()

    await expect(page.getByText("Oasis added")).toBeVisible()
    expect(uploaded).toContain('name="name"')
    expect(uploaded).toContain('filename="oasis.png"')
    await expect(page.getByRole("textbox", { name: "Brand" })).toHaveValue("")
  })

  test("explains why a country was rejected", async ({ page }, testInfo) => {
    await mockApi(page, {
      role: "admin",
      routes: {
        "POST /api/countries": () => ({
          status: 409,
          body: { error: "Conflict", key: "CONFLICT" },
        }),
      },
    })
    await page.goto("/admin")

    await page.getByRole("tab", { name: "Country" }).click()
    await page.getByRole("textbox", { name: "Country" }).fill("France")
    await page.getByRole("button", { name: "Add country" }).click()

    await expect(page.getByText("This country already exists")).toBeVisible()
    await captureScreenshot(page, testInfo, "admin-country")
  })

  test("creates a drink", async ({ page }, testInfo) => {
    let uploaded: string | null = null

    await mockApi(page, {
      role: "admin",
      routes: {
        "POST /api/drinks": (request) => {
          uploaded = request.postData()

          return { status: 201, body: { result: fixtureDrinks[3] } }
        },
      },
    })
    await page.goto("/admin")
    await page.getByRole("tab", { name: "Drink" }).click()

    await page.getByLabel("Flavour").fill("Cherry")
    await page.getByLabel("Brand").click()
    await page.getByRole("option", { name: "Coca-Cola" }).click()

    const countries = page.getByLabel("Countries")

    await countries.fill("can")
    await page.getByRole("option", { name: "Canada" }).click()
    await countries.fill("united k")
    await page.getByRole("option", { name: "United Kingdom" }).click()
    await page.keyboard.press("Escape")

    await page
      .getByLabel("Image")
      .setInputFiles(await fixturePng(page, "cherry.png", CAN_URL))
    await captureScreenshot(page, testInfo, "admin-drink")

    await page.getByRole("button", { name: "Add drink" }).click()

    await expect(page.getByText("Cherry added")).toBeVisible()
    expect(uploaded).toContain("CA,GB")
    expect(uploaded).toContain("8a7f6e0c-0f7a-4b8e-9c55-0a6c3b8f1a01")
  })
})
