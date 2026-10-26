import { z } from "zod"
import { imageSchema } from "@/schemas/images"

// Messages are translation keys, resolved by the form fields.
export const createBrandSchema = z.object({
  name: z.string().trim().min(1, "admin.brands.errors.nameRequired"),
  image: imageSchema("admin.brands.errors.imageRequired"),
})

export const createCountrySchema = z.object({
  name: z.string().trim().min(1, "admin.countries.errors.nameRequired"),
})

export const createDrinkSchema = z.object({
  flavour: z.string().trim().min(1, "admin.drink.errors.flavourRequired"),
  brandId: z.string().min(1, "admin.drink.errors.brandRequired"),
  countryCodes: z
    .array(z.string())
    .min(1, "admin.drink.errors.countriesRequired"),
  image: imageSchema("admin.drink.errors.imageRequired"),
})
