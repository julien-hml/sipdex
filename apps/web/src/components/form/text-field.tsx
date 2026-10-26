"use client"

import type { ComponentProps } from "react"
import { useFieldContext } from "@/components/form/form-context"
import { useFieldErrors } from "@/components/form/use-field-errors"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type TextFieldProps = {
  label: string
} & Omit<ComponentProps<"input">, "value" | "onChange" | "onBlur" | "name">

export const TextField = ({ label, ...inputProps }: TextFieldProps) => {
  const field = useFieldContext<string>()
  const errors = useFieldErrors()
  const invalid = errors.length > 0

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        {...inputProps}
      />
      <FieldError errors={errors} />
    </Field>
  )
}
