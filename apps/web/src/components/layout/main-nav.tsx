"use client"

import { cn } from "cn"
import { House, type LucideIcon, Shield, User } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useIsAdmin } from "@/hooks/use-is-admin"

type NavItem = {
  href: string
  label: "home" | "profile" | "admin"
  icon: LucideIcon
  adminOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "home", icon: House },
  { href: "/profile", label: "profile", icon: User },
  { href: "/admin", label: "admin", icon: Shield, adminOnly: true },
]

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href)

export const MainNav = () => {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const isAdmin = useIsAdmin()
  const items = NAV_ITEMS.filter(({ adminOnly }) => !adminOnly || isAdmin)

  return (
    <nav aria-label={t("label")} className="ml-auto flex items-center gap-1">
      {items.map(({ href, label, icon: Icon }) => {
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
