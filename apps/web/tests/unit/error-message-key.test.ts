import { describe, expect, it } from "vitest"
import { getErrorMessageKey } from "@/lib/error-message-key"

const catalogue = new Set(["errors.drink.CONFLICT", "errors.CONFLICT"])
const hasMessage = (key: string) => catalogue.has(key)

describe("getErrorMessageKey", () => {
  it("prefers the feature-scoped message", () => {
    expect(getErrorMessageKey("drink", "CONFLICT", hasMessage)).toBe(
      "errors.drink.CONFLICT",
    )
  })

  it("falls back to the global message for the code", () => {
    expect(getErrorMessageKey("brands", "CONFLICT", hasMessage)).toBe(
      "errors.CONFLICT",
    )
  })

  it("falls back to the default message for unknown codes", () => {
    expect(getErrorMessageKey("drink", "TEAPOT", hasMessage)).toBe(
      "errors.default",
    )
  })
})
