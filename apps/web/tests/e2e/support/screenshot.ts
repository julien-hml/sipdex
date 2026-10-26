import type { Page, TestInfo } from "@playwright/test"

type ColorScheme = "light" | "dark"

// Saves a full-page screenshot under tests/e2e/screenshots/<project>/ so pull
// requests can show each page on desktop and mobile, in both themes.
export const captureScreenshot = async (
  page: Page,
  testInfo: TestInfo,
  name: string,
) => {
  // Park the pointer so no hover state leaks into the capture.
  await page.mouse.move(0, 0)
  // Drink images and flags load lazily; wait until every one has decoded.
  await page.waitForFunction(() =>
    Array.from(document.images).every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  )

  for (const colorScheme of ["light", "dark"] satisfies ColorScheme[]) {
    // Sequential on purpose: each capture needs the previous theme applied.
    // eslint-disable-next-line no-await-in-loop
    await page.emulateMedia({ colorScheme })
    // eslint-disable-next-line no-await-in-loop
    await page.screenshot({
      path: `tests/e2e/screenshots/${testInfo.project.name}/${name}-${colorScheme}.png`,
      fullPage: true,
      animations: "disabled",
    })
  }

  await page.emulateMedia({ colorScheme: "light" })
}
