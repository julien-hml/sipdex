import { describe, expect, it } from "vitest"
import { resolveLocale } from "@/i18n/resolve-locale"

describe("resolveLocale", () => {
  it("prefers a supported locale saved in the cookie", () => {
    expect(resolveLocale("fr", "en-US,en;q=0.9")).toBe("fr")
  })

  it("ignores an unsupported cookie value", () => {
    expect(resolveLocale("de", "fr-FR,fr;q=0.9")).toBe("fr")
  })

  it("picks the first supported browser language, ignoring regions", () => {
    expect(resolveLocale(undefined, "de-DE,fr-CA;q=0.8,en;q=0.5")).toBe("fr")
  })

  it("falls back to English", () => {
    expect(resolveLocale(undefined, "de-DE,es;q=0.8")).toBe("en")
    expect(resolveLocale(undefined, null)).toBe("en")
  })
})
