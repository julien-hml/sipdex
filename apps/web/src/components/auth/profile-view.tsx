"use client"

import { LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"

type ProfileViewProps = {
  email: string
}

export const ProfileView = ({ email }: ProfileViewProps) => {
  const t = useTranslations("profile")
  const [isLoading, setIsLoading] = useState(false)

  const onLogout = async () => {
    setIsLoading(true)
    await authClient.signOut()
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <div
          aria-hidden
          className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-muted font-heading text-2xl font-semibold uppercase"
        >
          {email.charAt(0)}
        </div>
        <CardTitle className="text-xl">{t("title")}</CardTitle>
        <CardDescription>{t("signedInAs", { email })}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isLoading}
          onClick={() => void onLogout()}
        >
          {isLoading ? <Spinner /> : <LogOut />}
          {t("logout")}
        </Button>
      </CardContent>
    </Card>
  )
}
