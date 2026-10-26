import { describe, expect, it } from "vitest"
import { drinkKeys, setTastedInCache } from "@/lib/drinks-cache"

const orange = { id: "orange", flavour: "Orange", tasted: false }
const lemon = { id: "lemon", flavour: "Lemon", tasted: false }

describe("setTastedInCache", () => {
  it("updates the matching drink in a list response", () => {
    const data = { result: [orange, lemon], meta: {} }

    expect(setTastedInCache(data, "lemon", true)).toEqual({
      result: [orange, { ...lemon, tasted: true }],
      meta: {},
    })
  })

  it("updates a single-drink response", () => {
    expect(setTastedInCache({ result: orange }, "orange", true)).toEqual({
      result: { ...orange, tasted: true },
    })
  })

  it("leaves other drinks untouched", () => {
    const data = { result: orange }

    expect(setTastedInCache(data, "lemon", true)).toEqual(data)
  })

  it("keeps an empty cache empty", () => {
    expect(setTastedInCache(undefined, "orange", true)).toBeUndefined()
  })
})

describe("drinkKeys", () => {
  it("scopes every key under the drinks prefix", () => {
    expect(drinkKeys.list("user-1").slice(0, 1)).toEqual(drinkKeys.all)
    expect(drinkKeys.detail("orange").slice(0, 1)).toEqual(drinkKeys.all)
  })

  it("separates anonymous and signed-in lists", () => {
    expect(drinkKeys.list()).not.toEqual(drinkKeys.list("user-1"))
  })
})
