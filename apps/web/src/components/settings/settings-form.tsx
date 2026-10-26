"use client"

import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useSyncExternalStore, useTransition } from "react"
import { SettingSelect } from "@/components/settings/setting-select"
import { FieldGroup } from "@/components/ui/field"
import { locales } from "@/i18n/config"
import { setLocale } from "@/i18n/set-locale"

const THEMES = ["system", "light", "dark"] as const

const noopSubscribe = () => () => null

// The saved theme lives in localStorage, so it's only known after hydration.
const useIsHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

export const SettingsForm = () => {
  const t = useTranslations("settings")
  const locale = useLocale()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const isHydrated = useIsHydrated()
  const [isChangingLocale, startTransition] = useTransition()

  const changeLocale = (next: string) => {
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  return (
    <FieldGroup>
      <SettingSelect
        id="theme"
        label={t("theme.label")}
        description={t("theme.description")}
        value={isHydrated ? (theme ?? "system") : null}
        disabled={!isHydrated}
        onChange={setTheme}
        options={THEMES.map((value) => ({
          value,
          label: t(`theme.${value}`),
        }))}
      />
      <SettingSelect
        id="language"
        label={t("language.label")}
        description={t("language.description")}
        value={locale}
        disabled={isChangingLocale}
        onChange={changeLocale}
        options={locales.map((value) => ({
          value,
          label: t(`language.${value}`),
        }))}
      />
    </FieldGroup>
  )
}
