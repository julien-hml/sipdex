import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DrinkList } from "@/components/drinks/drink-list"
import { fixtureDrinks, withTasted } from "../fixtures/drinks"
import { mockFetch, requestsTo } from "./helpers/fetch-mock"
import { renderWithProviders } from "./helpers/render"

const session = vi.hoisted(() => ({
  current: null as { user: { id: string } } | null,
}))

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => ({ data: session.current, isPending: false }),
  },
}))

const SERVER_ERROR = 500

describe("DrinkList", () => {
  beforeEach(() => {
    session.current = null
  })

  it("lists every drink with its brand", async () => {
    mockFetch({ "GET /api/drinks": () => ({ result: fixtureDrinks }) })

    renderWithProviders(<DrinkList />)

    const items = await screen.findAllByRole("listitem")

    expect(items).toHaveLength(fixtureDrinks.length)
    expect(
      within(items[0]).getByRole("link", { name: "Orange" }),
    ).toHaveAttribute("href", "/drinks/drink-orange")
    expect(within(items[0]).getByText("Fanta")).toBeInTheDocument()
  })

  it("shows at most two flags and counts the others", async () => {
    mockFetch({ "GET /api/drinks": () => ({ result: fixtureDrinks }) })

    renderWithProviders(<DrinkList />)

    const cherry = (
      await screen.findByRole("link", { name: "Cherry" })
    ).closest("li")

    expect(cherry).not.toBeNull()
    expect(within(cherry!).getByLabelText("Canada")).toBeInTheDocument()
    expect(within(cherry!).getByLabelText("United Kingdom")).toBeInTheDocument()
    expect(within(cherry!).queryByLabelText("United States")).toBeNull()
    expect(within(cherry!).getByText("+1")).toBeInTheDocument()
  })

  it("hides the taste button from anonymous visitors", async () => {
    mockFetch({ "GET /api/drinks": () => ({ result: fixtureDrinks }) })

    renderWithProviders(<DrinkList />)

    await screen.findAllByRole("listitem")

    expect(screen.queryByRole("button", { name: "Mark as tasted" })).toBeNull()
  })

  it("lets a signed-in user mark a drink as tasted", async () => {
    session.current = { user: { id: "user-1" } }
    const fetchMock = mockFetch({
      "GET /api/drinks": () => ({ result: withTasted([]) }),
      "POST /api/drinks/drink-lemon/taste": () => ({
        status: 201,
        body: { result: { drinkId: "drink-lemon", tasted: true } },
      }),
    })

    renderWithProviders(<DrinkList />)

    const lemon = (await screen.findByRole("link", { name: "Lemon" })).closest(
      "li",
    )!
    const button = within(lemon).getByRole("button", { name: "Mark as tasted" })

    expect(button).toHaveAttribute("aria-pressed", "false")

    await userEvent.click(button)

    expect(
      await within(lemon).findByRole("button", { name: "Mark as not tasted" }),
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      requestsTo(fetchMock, "POST", "/api/drinks/drink-lemon/taste"),
    ).toHaveLength(1)
  })

  it("shows an empty state", async () => {
    mockFetch({ "GET /api/drinks": () => ({ result: [] }) })

    renderWithProviders(<DrinkList />)

    expect(await screen.findByText("No drinks yet")).toBeInTheDocument()
  })

  it("recovers from an error with the retry button", async () => {
    let attempts = 0

    mockFetch({
      "GET /api/drinks": () => {
        attempts += 1

        return attempts === 1
          ? {
              status: SERVER_ERROR,
              body: { error: "Boom", key: "INTERNAL_ERROR" },
            }
          : { result: fixtureDrinks }
      },
    })

    renderWithProviders(<DrinkList />)

    await userEvent.click(await screen.findByRole("button", { name: "Retry" }))

    expect(await screen.findAllByRole("listitem")).toHaveLength(
      fixtureDrinks.length,
    )
  })
})
