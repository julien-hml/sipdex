"use client"

import { AuthScreen } from "@/components/auth/auth-screen"
import { ProfileView } from "@/components/auth/profile-view"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"

export const ProfileGate = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="py-6">
      {session ? <ProfileView email={session.user.email} /> : <AuthScreen />}
    </div>
  )
}
