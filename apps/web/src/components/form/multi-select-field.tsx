"use client"

import { useFieldContext } from "@/components/form/form-context"
import type { FieldOption } from "@/components/form/select-field"
import { useFieldErrors } from "@/components/form/use-field-errors"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

type MultiSelectFieldProps = {
  label: string
  placeholder: string
  emptyText: string
  options: FieldOption[]
}

// Searchable multi-select: values are option values, search matches labels.
export const MultiSelectField = ({
  label,
  placeholder,
  emptyText,
  options,
}: MultiSelectFieldProps) => {
  const field = useFieldContext<string[]>()
  const errors = useFieldErrors()
  const anchor = useComboboxAnchor()
  const labels = new Map(options.map((option) => [option.value, option.label]))
  const labelOf = (value: string) => labels.get(value) ?? value

  return (
    <Field data-invalid={errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Combobox
        multiple
        autoHighlight
        items={options.map((option) => option.value)}
        itemToStringLabel={labelOf}
        value={field.state.value}
        onValueChange={(values) => field.handleChange(values)}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value}>{labelOf(value)}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id={field.name}
                  placeholder={values.length > 0 ? "" : placeholder}
                  onBlur={field.handleBlur}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>{emptyText}</ComboboxEmpty>
          <ComboboxList>
            {(value: string) => (
              <ComboboxItem key={value} value={value}>
                {labelOf(value)}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError errors={errors} />
    </Field>
  )
}
