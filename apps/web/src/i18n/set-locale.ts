"use server"

import { cookies } from "next/headers"
import { LOCALE_COOKIE, isLocale } from "@/i18n/config"

const ONE_YEAR_IN_SECONDS = 31_536_000

// Persists the chosen language; next-intl reads it on the next render.
export const setLocale = async (locale: string) => {
  if (!isLocale(locale)) {
    return
  }

  const cookieStore = await cookies()

  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: ONE_YEAR_IN_SECONDS,
    sameSite: "lax",
  })
}
