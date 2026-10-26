import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "@/components/form/form-context"
import { ImageField } from "@/components/form/image-field"
import { MultiSelectField } from "@/components/form/multi-select-field"
import { SelectField } from "@/components/form/select-field"
import { SubmitButton } from "@/components/form/submit-button"
import { TextField } from "@/components/form/text-field"

// App-wide TanStack Form hook: `form.AppField` exposes the shared field
// components, `form.AppForm` the form-level ones.
export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, ImageField, SelectField, MultiSelectField },
  formComponents: { SubmitButton },
})
