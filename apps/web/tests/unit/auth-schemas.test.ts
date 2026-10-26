import { describe, expect, it } from "vitest"
import { signInSchema, signUpSchema } from "@/schemas/auth"

const messagesOf = (result: { error?: { issues: { message: string }[] } }) =>
  result.error?.issues.map((issue) => issue.message) ?? []

describe("signInSchema", () => {
  it("accepts an email surrounded by spaces", () => {
    expect(
      signInSchema.safeParse({ email: " user@sipdex.io ", password: "x" })
        .success,
    ).toBe(true)
  })

  it("rejects an invalid email and an empty password", () => {
    expect(
      messagesOf(signInSchema.safeParse({ email: "nope", password: "" })),
    ).toEqual(["auth.errors.emailInvalid", "auth.errors.passwordRequired"])
  })
})

describe("signUpSchema", () => {
  const valid = {
    email: "user@sipdex.io",
    password: "Password123!",
    confirmPassword: "Password123!",
  }

  it("accepts a strong, confirmed password", () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true)
  })

  it("requires 8 characters", () => {
    expect(
      messagesOf(
        signUpSchema.safeParse({
          ...valid,
          password: "Pa1!",
          confirmPassword: "Pa1!",
        }),
      ),
    ).toEqual(["auth.errors.passwordMin"])
  })

  it("requires every character class", () => {
    expect(
      messagesOf(
        signUpSchema.safeParse({
          ...valid,
          password: "password123",
          confirmPassword: "password123",
        }),
      ),
    ).toEqual(["auth.errors.passwordWeak"])
  })

  it("requires matching passwords", () => {
    const result = signUpSchema.safeParse({
      ...valid,
      confirmPassword: "Password123?",
    })

    expect(messagesOf(result)).toEqual(["auth.errors.passwordMismatch"])
    expect(result.error?.issues[0].path).toEqual(["confirmPassword"])
  })
})
