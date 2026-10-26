import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:3000"),
})

// Next.js inlines `process.env.NEXT_PUBLIC_*` at build time, so each variable
// must be read by its full name (no destructuring of `process.env`).
export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})
