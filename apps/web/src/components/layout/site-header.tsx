import { CupSoda } from "lucide-react"
import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"

export const SiteHeader = () => (
  <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
    <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-4 px-4">
      <Link
        href="/"
        className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight"
      >
        <CupSoda className="size-5" aria-hidden />
        Sipdex
      </Link>
      <MainNav />
    </div>
  </header>
)
