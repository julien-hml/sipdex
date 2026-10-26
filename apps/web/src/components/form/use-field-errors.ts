import { useStore } from "@tanstack/react-form"
import { useTranslations } from "next-intl"
import { useFieldContext } from "@/components/form/form-context"

type FieldError = string | { message?: string } | undefined

const toMessageKey = (error: FieldError) =>
  typeof error === "string" ? error : error?.message

// Validation messages are translation keys (see src/schemas). Like
// react-hook-form on mobile, errors only show once the form was submitted, then
// follow every change.
export const useFieldErrors = () => {
  const t = useTranslations()
  const field = useFieldContext<unknown>()
  const submitted = useStore(
    field.form.store,
    (state) => state.submissionAttempts > 0,
  )
  const errors = useStore(
    field.store,
    // Errors are untyped: the field context is shared by every form.
    (state) => state.meta.errors as FieldError[],
  )

  type MessageKey = Parameters<typeof t>[0]

  if (!submitted) {
    return []
  }

  return errors
    .map(toMessageKey)
    .filter((key): key is string => Boolean(key))
    .map((key) => ({ message: t(key as MessageKey) }))
}
