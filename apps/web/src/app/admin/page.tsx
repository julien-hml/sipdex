import type { Metadata } from "next"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
import { AdminPanel } from "@/components/admin/admin-panel"

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("admin")

  return { title: t("title") }
}

const AdminPage = () => {
  const t = useTranslations("admin")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <AdminPanel />
    </div>
  )
}

export default AdminPage
