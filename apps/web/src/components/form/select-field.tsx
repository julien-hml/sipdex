"use client"

import { useFieldContext } from "@/components/form/form-context"
import { useFieldErrors } from "@/components/form/use-field-errors"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type FieldOption = { value: string; label: string }

type SelectFieldProps = {
  label: string
  placeholder: string
  options: FieldOption[]
}

export const SelectField = ({
  label,
  placeholder,
  options,
}: SelectFieldProps) => {
  const field = useFieldContext<string>()
  const errors = useFieldErrors()
  const invalid = errors.length > 0

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        items={options}
        value={field.state.value || null}
        onValueChange={(value) => field.handleChange(value ?? "")}
      >
        <SelectTrigger
          id={field.name}
          className="w-full"
          aria-invalid={invalid}
          onBlur={field.handleBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={errors} />
    </Field>
  )
}
