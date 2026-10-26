import type { AbstractIntlMessages } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { cookies, headers } from "next/headers"
import { LOCALE_COOKIE } from "@/i18n/config"
import { resolveLocale } from "@/i18n/resolve-locale"

export default getRequestConfig(async () => {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  const locale = resolveLocale(
    cookieStore.get(LOCALE_COOKIE)?.value,
    headerStore.get("accept-language"),
  )
  const { default: messages } = (await import(
    `../../messages/${locale}.json`
  )) as { default: AbstractIntlMessages }

  return { locale, messages }
})
