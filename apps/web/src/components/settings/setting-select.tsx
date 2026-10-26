"use client"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SettingOption = {
  value: string
  label: string
}

type SettingSelectProps = {
  id: string
  label: string
  description: string
  value: string | null
  options: SettingOption[]
  onChange: (value: string) => void
  disabled?: boolean
}

export const SettingSelect = ({
  id,
  label,
  description,
  value,
  options,
  onChange,
  disabled = false,
}: SettingSelectProps) => (
  <Field>
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    <FieldDescription>{description}</FieldDescription>
    <Select
      items={options}
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        if (next) {
          onChange(next)
        }
      }}
    >
      <SelectTrigger id={id} className="w-full sm:w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </Field>
)
