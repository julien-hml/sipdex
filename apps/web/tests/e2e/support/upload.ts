import type { Page } from "@playwright/test"
import { fixtureImage } from "./images"

// The API only accepts PNG/JPEG, so render a fixture SVG to a real PNG in a
// throwaway page of the same browser context.
export const fixturePng = async (page: Page, name: string, url: string) => {
  const renderer = await page.context().newPage()

  await renderer.setContent(
    `<style>svg{display:block;width:100%;height:100%}</style><div style="width:240px;height:240px">${fixtureImage(url)}</div>`,
  )
  const buffer = await renderer
    .locator("div")
    .screenshot({ omitBackground: true })

  await renderer.close()

  return { name, mimeType: "image/png", buffer }
}
