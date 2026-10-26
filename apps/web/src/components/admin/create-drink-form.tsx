"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"
import { useAppForm } from "@/components/form/app-form"
import { useError } from "@/hooks/use-error"
import { useMutation } from "@/hooks/use-mutation"
import { useQuery } from "@/hooks/use-query"
import { brandKeys, countryKeys } from "@/lib/admin-keys"
import { client } from "@/lib/api"
import { getCountryName } from "@/lib/country-name"
import { drinkKeys } from "@/lib/drinks-cache"
import { createDrinkSchema } from "@/schemas/admin"

type DrinkFormValues = {
  flavour: string
  brandId: string
  countryCodes: string[]
  image: File | null
}

const DEFAULT_VALUES: DrinkFormValues = {
  flavour: "",
  brandId: "",
  countryCodes: [],
  image: null,
}

const useDrinkOptions = () => {
  const locale = useLocale()
  const { data: brands } = useQuery(client.api.brands.$get, {
    queryKey: brandKeys.all,
  })
  const { data: countries } = useQuery(client.api.countries.$get, {
    queryKey: countryKeys.all,
  })

  return {
    brandOptions: (brands?.result ?? []).map((brand) => ({
      value: brand.id,
      label: brand.name,
    })),
    countryOptions: (countries?.result ?? [])
      .map((country) => ({
        value: country.code,
        label: getCountryName(country.code, locale),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, locale)),
  }
}

export const CreateDrinkForm = () => {
  const t = useTranslations("admin.drink")
  const { onError } = useError("drink")
  const queryClient = useQueryClient()
  const { brandOptions, countryOptions } = useDrinkOptions()

  const create = useMutation(client.api.drinks.$post, {
    onError,
    onSuccess: (data) => {
      form.reset()
      void queryClient.invalidateQueries({ queryKey: drinkKeys.all })

      if ("result" in data && data.result) {
        toast.success(t("success", { flavour: data.result.flavour }))
      }
    },
  })

  const form = useAppForm({
    defaultValues: DEFAULT_VALUES,
    validators: { onChange: createDrinkSchema, onSubmit: createDrinkSchema },
    onSubmit: ({ value: { flavour, brandId, countryCodes, image } }) => {
      if (image) {
        create.mutate({
          form: {
            flavour: flavour.trim(),
            brandId,
            countryCodes: countryCodes.join(","),
            image,
          },
        })
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
      <form.AppField name="flavour">
        {(field) => (
          <field.TextField label={t("flavour")} autoCapitalize="words" />
        )}
      </form.AppField>
      <form.AppField name="brandId">
        {(field) => (
          <field.SelectField
            label={t("brand")}
            placeholder={t("brandPlaceholder")}
            options={brandOptions}
          />
        )}
      </form.AppField>
      <form.AppField name="countryCodes">
        {(field) => (
          <field.MultiSelectField
            label={t("countries")}
            placeholder={t("searchPlaceholder")}
            emptyText={t("empty")}
            options={countryOptions}
          />
        )}
      </form.AppField>
      <form.AppField name="image">
        {(field) => <field.ImageField label={t("image")} />}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton isPending={create.isPending}>
          {t("submit")}
        </form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
