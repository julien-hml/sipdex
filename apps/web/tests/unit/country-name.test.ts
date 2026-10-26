import { describe, expect, it } from "vitest"
import { getCountryName } from "@/lib/country-name"

describe("getCountryName", () => {
  it("localises the country name", () => {
    expect(getCountryName("ES", "en")).toBe("Spain")
    expect(getCountryName("ES", "fr")).toBe("Espagne")
  })

  it("falls back to the raw code", () => {
    expect(getCountryName("ZZ", "en")).toBe("ZZ")
  })
})
