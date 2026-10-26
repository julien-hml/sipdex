import { type Locale, defaultLocale, isLocale } from "@/i18n/config"

// First supported language listed in an Accept-Language header, ignoring
// regions and quality values (e.g. "fr-CA,fr;q=0.9,en;q=0.8" -> "fr").
const fromAcceptLanguage = (header: string | null) =>
  (header ?? "")
    .split(",")
    .map((part) => part.split(";")[0].trim().split("-")[0].toLowerCase())
    .find(isLocale)

// A saved choice (cookie) wins, then the browser language, then the default.
export const resolveLocale = (
  cookieValue: string | undefined,
  acceptLanguage: string | null,
): Locale => {
  if (isLocale(cookieValue)) {
    return cookieValue
  }

  return fromAcceptLanguage(acceptLanguage) ?? defaultLocale
}
