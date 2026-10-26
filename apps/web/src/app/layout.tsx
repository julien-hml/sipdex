import { cn } from "cn"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getTranslations } from "next-intl/server"
import type { ReactNode } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { Providers } from "@/components/providers"
import "./globals.css"

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("metadata")

  return {
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("description"),
  }
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("antialiased", GeistSans.variable, GeistMono.variable)}
    >
      <body className="min-h-dvh">
        <NextIntlClientProvider>
          <Providers>
            <SiteHeader />
            <main className="mx-auto w-full max-w-3xl px-4 py-6">
              {children}
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
