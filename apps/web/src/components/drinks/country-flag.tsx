"use client"

import { cn } from "cn"
import { useLocale } from "next-intl"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getCountryName } from "@/lib/country-name"

type CountryFlagProps = {
  code: string
  className?: string
}

// Flags are 3:2.
const FLAG_WIDTH = 24
const FLAG_HEIGHT = 16

export const CountryFlag = ({ code, className }: CountryFlagProps) => {
  const locale = useLocale()
  const name = getCountryName(code, locale)

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={name}
        className={cn(
          "relative z-10 inline-flex aspect-3/2 h-4 overflow-hidden rounded-[3px] ring-1 ring-foreground/10",
          className,
        )}
      >
        <Image
          src={`/flags/${code.toUpperCase()}`}
          alt=""
          width={FLAG_WIDTH}
          height={FLAG_HEIGHT}
          className="size-full object-cover"
        />
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  )
}
