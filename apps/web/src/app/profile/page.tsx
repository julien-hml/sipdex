import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ProfileGate } from "@/components/auth/profile-gate"

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("profile")

  return { title: t("title") }
}

const ProfilePage = () => <ProfileGate />

export default ProfilePage
