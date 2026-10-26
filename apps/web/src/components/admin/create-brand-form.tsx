"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useAppForm } from "@/components/form/app-form"
import { useError } from "@/hooks/use-error"
import { useMutation } from "@/hooks/use-mutation"
import { brandKeys } from "@/lib/admin-keys"
import { client } from "@/lib/api"
import { createBrandSchema } from "@/schemas/admin"

export const CreateBrandForm = () => {
  const t = useTranslations("admin")
  const { onError } = useError("brands")
  const queryClient = useQueryClient()

  const create = useMutation(client.api.brands.$post, {
    onError,
    onSuccess: (data) => {
      form.reset()
      void queryClient.invalidateQueries({ queryKey: brandKeys.all })

      if ("result" in data) {
        toast.success(t("brands.success", { name: data.result.name }))
      }
    },
  })

  const form = useAppForm({
    defaultValues: { name: "", image: null as File | null },
    validators: { onChange: createBrandSchema, onSubmit: createBrandSchema },
    onSubmit: ({ value: { name, image } }) => {
      if (image) {
        create.mutate({ form: { name: name.trim(), image } })
      }
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
            label={t("brands.label")}
            placeholder={t("brands.placeholder")}
            autoCapitalize="words"
          />
        )}
      </form.AppField>
      <form.AppField name="image">
        {(field) => <field.ImageField label={t("brands.image")} />}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton isPending={create.isPending}>
          {t("brands.submit")}
        </form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
