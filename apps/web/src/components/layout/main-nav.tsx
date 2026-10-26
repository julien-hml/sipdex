"use client"

import { cn } from "cn"
import { House, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

type NavItem = {
  href: string
  label: "home"
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [{ href: "/", label: "home", icon: House }]

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href)

export const MainNav = () => {
  const t = useTranslations("nav")
  const pathname = usePathname()

  return (
    <nav aria-label={t("label")} className="ml-auto flex items-center gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href)

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : false}
            className={cn(
              "flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-muted text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            <span className="max-sm:sr-only">{t(label)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
