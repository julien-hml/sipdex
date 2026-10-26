export const locales = ["en", "fr"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

// Cookie next-intl reads the active locale from (no locale prefix in URLs).
export const LOCALE_COOKIE = "NEXT_LOCALE"

export const isLocale = (value: unknown): value is Locale =>
  locales.includes(value as Locale)
