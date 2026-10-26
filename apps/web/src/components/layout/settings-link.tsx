"use client"

import { cn } from "cn"
import { Settings } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"

// Gear in the header, like the mobile home screen's settings button.
export const SettingsLink = () => {
  const t = useTranslations("nav")
  const active = usePathname() === "/settings"

  return (
    <Link
      href="/settings"
      aria-label={t("settings")}
      title={t("settings")}
      aria-current={active ? "page" : false}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon-lg" }),
        "text-muted-foreground",
        active && "bg-muted text-foreground",
      )}
    >
      <Settings className="size-4.5" />
    </Link>
  )
}
