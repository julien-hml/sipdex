import { describe, expect, it } from "vitest"
import { createBrandSchema, createDrinkSchema } from "@/schemas/admin"
import { MAXIMUM_FILE_SIZE } from "@/schemas/images"

const png = (size = 10) =>
  new File([new Uint8Array(size)], "logo.png", { type: "image/png" })

const messagesOf = (result: { error?: { issues: { message: string }[] } }) =>
  result.error?.issues.map((issue) => issue.message) ?? []

describe("createBrandSchema", () => {
  it("accepts a name and a PNG logo", () => {
    expect(
      createBrandSchema.safeParse({ name: "Oasis", image: png() }).success,
    ).toBe(true)
  })

  it("requires a name and a logo, and stops at the missing logo", () => {
    expect(
      messagesOf(createBrandSchema.safeParse({ name: " ", image: null })),
    ).toEqual([
      "admin.brands.errors.nameRequired",
      "admin.brands.errors.imageRequired",
    ])
  })

  it("rejects other image types", () => {
    const gif = new File(["x"], "logo.gif", { type: "image/gif" })

    expect(
      messagesOf(createBrandSchema.safeParse({ name: "Oasis", image: gif })),
    ).toEqual(["admin.image.errors.invalidType"])
  })

  it("rejects images over the API limit", () => {
    expect(
      messagesOf(
        createBrandSchema.safeParse({
          name: "Oasis",
          image: png(MAXIMUM_FILE_SIZE + 1),
        }),
      ),
    ).toEqual(["admin.image.errors.tooLarge"])
  })
})

describe("createDrinkSchema", () => {
  it("requires a brand and at least one country", () => {
    expect(
      messagesOf(
        createDrinkSchema.safeParse({
          flavour: "Cherry",
          brandId: "",
          countryCodes: [],
          image: png(),
        }),
      ),
    ).toEqual([
      "admin.drink.errors.brandRequired",
      "admin.drink.errors.countriesRequired",
    ])
  })
})
