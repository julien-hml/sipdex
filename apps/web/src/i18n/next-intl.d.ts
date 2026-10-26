import type { Locale } from "@/i18n/config"
import type messages from "@/messages/en.json"

declare module "next-intl" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface AppConfig {
    Locale: Locale
    Messages: typeof messages
  }
}
