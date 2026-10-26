import { z } from "zod"

// Mirrors the API's upload rules (packages/api/src/schemas/images.ts).
export const MAXIMUM_FILE_SIZE = 5_000_000
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg"]

// `null` until a file is picked; `requiredMessage` is a translation key. The
// first check aborts so the others only ever see a file.
export const imageSchema = (requiredMessage: string) =>
  z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, { message: requiredMessage, abort: true })
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "admin.image.errors.invalidType",
    )
    .refine(
      (file) => file.size <= MAXIMUM_FILE_SIZE,
      "admin.image.errors.tooLarge",
    )
