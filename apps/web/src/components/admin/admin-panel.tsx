"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CreateBrandForm } from "@/components/admin/create-brand-form"
import { CreateCountryForm } from "@/components/admin/create-country-form"
import { CreateDrinkForm } from "@/components/admin/create-drink-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { authClient } from "@/lib/auth-client"

const TABS = [
  { value: "brand", title: "brands.title", Form: CreateBrandForm },
  { value: "country", title: "countries.title", Form: CreateCountryForm },
  { value: "drink", title: "drink.title", Form: CreateDrinkForm },
] as const

export const AdminPanel = () => {
  const t = useTranslations("admin")
  const router = useRouter()
  const { isPending } = authClient.useSession()
  const isAdmin = useIsAdmin()

  // Same guard as mobile: non-admins are sent home. The API enforces the
  // permissions either way.
  useEffect(() => {
    if (!isPending && !isAdmin) {
      router.replace("/")
    }
  }, [isPending, isAdmin, router])

  if (!isAdmin) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <Tabs defaultValue="brand" className="gap-4">
      <TabsList className="w-full">
        {TABS.map(({ value }) => (
          <TabsTrigger key={value} value={value}>
            {t(`tabs.${value}`)}
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map(({ value, title, Form }) => (
        <TabsContent key={value} value={value}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t(title)}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
