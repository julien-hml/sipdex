"use client"

import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useAppForm } from "@/components/form/app-form"
import { authClient } from "@/lib/auth-client"
import { signUpSchema } from "@/schemas/auth"

type SignUpFormProps = {
  onSuccess: () => void
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const t = useTranslations()
  const form = useAppForm({
    defaultValues: { email: "", password: "", confirmPassword: "" },
    validators: { onChange: signUpSchema, onSubmit: signUpSchema },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signUp.email({
        name: "",
        email: value.email.trim(),
        password: value.password,
      })

      if (error) {
        toast.error(error.message ?? t("errors.default"))

        return
      }

      toast.success(t("auth.signUp.success"))
      onSuccess()
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
            autoComplete="new-password"
          />
        )}
      </form.AppField>
      <form.AppField name="confirmPassword">
        {(field) => (
          <field.TextField
            label={t("auth.confirmPassword")}
            type="password"
            autoComplete="new-password"
          />
        )}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton>{t("auth.signUp.submit")}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
