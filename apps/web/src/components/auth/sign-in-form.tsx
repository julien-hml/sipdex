"use client"

import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useAppForm } from "@/components/form/app-form"
import { authClient } from "@/lib/auth-client"
import { signInSchema } from "@/schemas/auth"

export const SignInForm = () => {
  const t = useTranslations()
  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: signInSchema, onSubmit: signInSchema },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email({
        email: value.email.trim(),
        password: value.password,
      })

      if (error) {
        toast.error(error.message ?? t("errors.default"))

        return
      }

      toast.success(t("auth.signIn.success"))
    },
  })

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.AppField name="email">
        {(field) => (
          <field.TextField
            label={t("auth.email")}
            type="email"
            autoComplete="email"
          />
        )}
      </form.AppField>
      <form.AppField name="password">
        {(field) => (
          <field.TextField
            label={t("auth.password")}
            type="password"
            autoComplete="current-password"
          />
        )}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton>{t("auth.signIn.submit")}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
