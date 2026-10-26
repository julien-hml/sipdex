"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useAppForm } from "@/components/form/app-form"
import { useError } from "@/hooks/use-error"
import { useMutation } from "@/hooks/use-mutation"
import { countryKeys } from "@/lib/admin-keys"
import { client } from "@/lib/api"
import { createCountrySchema } from "@/schemas/admin"

export const CreateCountryForm = () => {
  const t = useTranslations("admin.countries")
  const { onError } = useError("countries")
  const queryClient = useQueryClient()

  const create = useMutation(client.api.countries.$post, {
    onError,
    onSuccess: (data) => {
      form.reset()
      void queryClient.invalidateQueries({ queryKey: countryKeys.all })

      if ("result" in data) {
        toast.success(t("success", { name: data.result.name }))
      }
    },
  })

  const form = useAppForm({
    defaultValues: { name: "" },
    validators: {
      onChange: createCountrySchema,
      onSubmit: createCountrySchema,
    },
    onSubmit: ({ value }) => {
      create.mutate({ json: { name: value.name.trim() } })
    },
  })

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.AppField name="name">
        {(field) => (
          <field.TextField
            label={t("label")}
            placeholder={t("placeholder")}
            autoCapitalize="none"
            autoCorrect="off"
          />
        )}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton isPending={create.isPending}>
          {t("submit")}
        </form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
