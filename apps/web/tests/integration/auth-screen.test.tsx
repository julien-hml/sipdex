import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { AuthScreen } from "@/components/auth/auth-screen"
import { renderWithProviders } from "./helpers/render"

const auth = vi.hoisted(() => ({
  signIn: vi.fn(() => Promise.resolve({ error: null })),
  signUp: vi.fn(() => Promise.resolve({ error: null })),
}))

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: { email: auth.signIn },
    signUp: { email: auth.signUp },
  },
}))

describe("AuthScreen", () => {
  beforeEach(() => {
    auth.signIn.mockClear()
    auth.signUp.mockClear()
  })

  it("only shows errors after a submit attempt", async () => {
    renderWithProviders(<AuthScreen />)

    await userEvent.type(screen.getByLabelText("Email"), "nope")

    expect(screen.queryByRole("alert")).toBeNull()

    await userEvent.click(screen.getByRole("button", { name: "Sign in" }))

    expect(
      await screen.findByText("Enter a valid email address"),
    ).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    )
    expect(auth.signIn).not.toHaveBeenCalled()
  })

  it("signs in with the trimmed email", async () => {
    renderWithProviders(<AuthScreen />)

    await userEvent.type(screen.getByLabelText("Email"), " user@sipdex.io ")
    await userEvent.type(screen.getByLabelText("Password"), "Password123!")
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }))

    await vi.waitFor(() =>
      expect(auth.signIn).toHaveBeenCalledWith({
        email: "user@sipdex.io",
        password: "Password123!",
      }),
    )
  })

  it("switches back to sign in after creating an account", async () => {
    renderWithProviders(<AuthScreen />)

    await userEvent.click(
      screen.getByRole("button", { name: "No account? Sign up" }),
    )
    await userEvent.type(screen.getByLabelText("Email"), "new@sipdex.io")
    await userEvent.type(screen.getByLabelText("Password"), "Password123!")
    await userEvent.type(
      screen.getByLabelText("Confirm password"),
      "Password123!",
    )
    await userEvent.click(
      screen.getByRole("button", { name: "Create account" }),
    )

    expect(
      await screen.findByRole("button", { name: "Sign in" }),
    ).toBeInTheDocument()
    expect(auth.signUp).toHaveBeenCalledWith({
      name: "",
      email: "new@sipdex.io",
      password: "Password123!",
    })
  })
})
