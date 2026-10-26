import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DrinkDetail } from "@/components/drinks/drink-detail"
import { fixtureDrinks } from "../fixtures/drinks"
import { mockFetch } from "./helpers/fetch-mock"
import { renderWithProviders } from "./helpers/render"

const session = vi.hoisted(() => ({
  current: null as { user: { id: string } } | null,
}))

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => ({ data: session.current, isPending: false }),
  },
}))

const [orange] = fixtureDrinks

describe("DrinkDetail", () => {
  beforeEach(() => {
    session.current = null
  })

  it("shows the drink with every country, localised", async () => {
    mockFetch({ "GET /api/drinks/drink-orange": () => ({ result: orange }) })

    renderWithProviders(<DrinkDetail id="drink-orange" />)

    expect(
      await screen.findByRole("heading", { name: "Orange" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Fanta")).toBeInTheDocument()
    expect(screen.getByText("Available in 2 countries")).toBeInTheDocument()
    expect(screen.getByText("France")).toBeInTheDocument()
    expect(screen.getByText("Germany")).toBeInTheDocument()
  })

  it("shows a not-found message for unknown drinks", async () => {
    mockFetch({})

    renderWithProviders(<DrinkDetail id="missing" />)

    expect(
      await screen.findByText("This drink doesn't exist"),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "All drinks" })).toHaveAttribute(
      "href",
      "/",
    )
  })

  it("toggles the tasted state", async () => {
    session.current = { user: { id: "user-1" } }
    mockFetch({
      "GET /api/drinks/drink-orange": () => ({
        result: { ...orange, tasted: true },
      }),
      "DELETE /api/drinks/drink-orange/taste": () => ({
        result: { drinkId: "drink-orange", tasted: false },
      }),
    })

    renderWithProviders(<DrinkDetail id="drink-orange" />)

    const toggle = await screen.findByRole("button", { name: "Tasted" })

    expect(toggle).toHaveAttribute("aria-pressed", "true")

    await userEvent.click(toggle)

    await vi.waitFor(() =>
      expect(toggle).toHaveAttribute("aria-pressed", "false"),
    )
  })
})
