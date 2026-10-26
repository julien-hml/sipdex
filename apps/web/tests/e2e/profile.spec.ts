import { expect, test } from "@playwright/test"
import { fixtureSession, mockApi } from "./support/api-mock"
import { captureScreenshot } from "./support/screenshot"

const EMAIL = "user@sipdex.io"
const PASSWORD = "Password123!"

test.describe("profile", () => {
  test("signs in and out", async ({ page }, testInfo) => {
    const api = await mockApi(page, {
      routes: {
        "POST /api/auth/sign-in/email": () => {
          api.role = "user"

          return { redirect: false, token: "token", ...fixtureSession("user") }
        },
      },
    })
    await page.goto("/profile")

    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
    await captureScreenshot(page, testInfo, "profile-sign-in")

    await page.getByLabel("Email").fill(EMAIL)
    await page.getByLabel("Password").fill(PASSWORD)
    await page.getByRole("button", { name: "Sign in" }).click()

    await expect(page.getByText(`Signed in as ${EMAIL}`)).toBeVisible()
    await expect(page.getByText("Signed in", { exact: true })).toBeVisible()
    await captureScreenshot(page, testInfo, "profile-signed-in")

    await page.getByRole("button", { name: "Log out" }).click()

    await expect(page.getByLabel("Email")).toBeVisible()
  })

  test("validates the sign-in form before calling the API", async ({
    page,
  }) => {
    let signInCalls = 0

    await mockApi(page, {
      routes: {
        "POST /api/auth/sign-in/email": () => {
          signInCalls += 1

          return { status: 401, body: {} }
        },
      },
    })
    await page.goto("/profile")

    await page.getByLabel("Email").fill("not-an-email")
    await page.getByRole("button", { name: "Sign in" }).click()

    await expect(page.getByText("Enter a valid email address")).toBeVisible()
    await expect(page.getByText("Please enter your password")).toBeVisible()

    await page.getByLabel("Email").fill(EMAIL)
    await expect(page.getByText("Enter a valid email address")).toHaveCount(0)
    expect(signInCalls).toBe(0)
  })

  test("shows the API error for wrong credentials", async ({ page }) => {
    await mockApi(page, {
      routes: {
        "POST /api/auth/sign-in/email": () => ({
          status: 401,
          body: {
            code: "INVALID_EMAIL_OR_PASSWORD",
            message: "Invalid email or password",
          },
        }),
      },
    })
    await page.goto("/profile")

    await page.getByLabel("Email").fill(EMAIL)
    await page.getByLabel("Password").fill("wrong")
    await page.getByRole("button", { name: "Sign in" }).click()

    await expect(page.getByText("Invalid email or password")).toBeVisible()
  })

  test("creates an account then asks to sign in", async ({
    page,
  }, testInfo) => {
    await mockApi(page, {
      routes: { "POST /api/auth/sign-up/email": () => ({ result: true }) },
    })
    await page.goto("/profile")

    await page.getByRole("button", { name: "No account? Sign up" }).click()
    await page.getByLabel("Email").fill(EMAIL)
    await page.getByLabel("Password", { exact: true }).fill("weak")
    await page.getByLabel("Confirm password").fill("different")
    await page.getByRole("button", { name: "Create account" }).click()

    await expect(
      page.getByText("Password must be at least 8 characters"),
    ).toBeVisible()
    await expect(page.getByText("Passwords do not match")).toBeVisible()
    await captureScreenshot(page, testInfo, "profile-sign-up-errors")

    await page.getByLabel("Password", { exact: true }).fill(PASSWORD)
    await page.getByLabel("Confirm password").fill(PASSWORD)
    await page.getByRole("button", { name: "Create account" }).click()

    await expect(
      page.getByText("Account created, please sign in"),
    ).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
  })

  test("is reachable from the navigation", async ({ page }) => {
    await mockApi(page)
    await page.goto("/")

    await page.getByRole("link", { name: "Profile" }).click()

    await expect(page).toHaveURL("/profile")
  })
})
