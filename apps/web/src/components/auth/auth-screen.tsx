"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { SignInForm } from "@/components/auth/sign-in-form"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AuthMode = "signIn" | "signUp"

export const AuthScreen = () => {
  const t = useTranslations("auth")
  const [mode, setMode] = useState<AuthMode>("signIn")
  const isSignIn = mode === "signIn"

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{t(`${mode}.title`)}</CardTitle>
        <CardDescription>{t(`${mode}.description`)}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Keyed so switching modes starts from a fresh form. */}
        {isSignIn ? (
          <SignInForm key="signIn" />
        ) : (
          <SignUpForm key="signUp" onSuccess={() => setMode("signIn")} />
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          variant="link"
          onClick={() => setMode(isSignIn ? "signUp" : "signIn")}
        >
          {t(isSignIn ? "toggleToSignUp" : "toggleToSignIn")}
        </Button>
      </CardFooter>
    </Card>
  )
}
