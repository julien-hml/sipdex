import { useTranslations } from "next-intl"
import { DrinkList } from "@/components/drinks/drink-list"

const HomePage = () => {
  const t = useTranslations("home")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <DrinkList />
    </div>
  )
}

export default HomePage
