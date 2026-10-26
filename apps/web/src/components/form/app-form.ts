import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "@/components/form/form-context"
import { SubmitButton } from "@/components/form/submit-button"
import { TextField } from "@/components/form/text-field"

// App-wide TanStack Form hook: `form.AppField` exposes the shared field
// components, `form.AppForm` the form-level ones.
export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: { SubmitButton },
})
