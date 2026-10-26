import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { CreateCountryForm } from "@/components/admin/create-country-form"
import { mockFetch, requestsTo } from "./helpers/fetch-mock"
import { renderWithProviders } from "./helpers/render"

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }))

vi.mock("sonner", () => ({ toast }))

const CONFLICT = 409

describe("CreateCountryForm", () => {
  it("posts the trimmed name and clears the form", async () => {
    const fetchMock = mockFetch({
      "POST /api/countries": () => ({
        status: 201,
        body: { result: { id: "c1", name: "France", code: "FR" } },
      }),
    })

    renderWithProviders(<CreateCountryForm />)

    const input = screen.getByLabelText("Country")

    await userEvent.type(input, "  France ")
    await userEvent.click(screen.getByRole("button", { name: "Add country" }))

    await vi.waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("France added"),
    )
    expect(input).toHaveValue("")

    const [request] = requestsTo(fetchMock, "POST", "/api/countries")

    expect(await request.json()).toEqual({ name: "France" })
  })

  it("shows the scoped API error", async () => {
    mockFetch({
      "POST /api/countries": () => ({
        status: CONFLICT,
        body: { error: "Conflict", key: "CONFLICT" },
      }),
    })

    renderWithProviders(<CreateCountryForm />)

    await userEvent.type(screen.getByLabelText("Country"), "France")
    await userEvent.click(screen.getByRole("button", { name: "Add country" }))

    await vi.waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("This country already exists"),
    )
  })

  it("validates before calling the API", async () => {
    const fetchMock = mockFetch({})

    renderWithProviders(<CreateCountryForm />)

    await userEvent.click(screen.getByRole("button", { name: "Add country" }))

    expect(
      await screen.findByText("Please enter a country"),
    ).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
