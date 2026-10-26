import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { SettingSelect } from "@/components/settings/setting-select"
import { renderWithProviders } from "./helpers/render"

const OPTIONS = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
]

const renderSelect = (onChange = vi.fn()) => {
  renderWithProviders(
    <SettingSelect
      id="language"
      label="Language"
      description="Interface language"
      value="en"
      options={OPTIONS}
      onChange={onChange}
    />,
  )

  return onChange
}

describe("SettingSelect", () => {
  it("labels the trigger and shows the selected option", () => {
    renderSelect()

    expect(screen.getByLabelText("Language")).toHaveTextContent("English")
  })

  it("reports the picked option", async () => {
    const onChange = renderSelect()

    await userEvent.click(screen.getByLabelText("Language"))
    await userEvent.click(
      await screen.findByRole("option", { name: "Français" }),
    )

    expect(onChange).toHaveBeenCalledWith("fr")
  })
})
