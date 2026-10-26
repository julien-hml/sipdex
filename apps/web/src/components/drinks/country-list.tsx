"use client"

import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { getCountryName } from "@/lib/country-name"

type CountryListProps = {
  countries: { code: string }[]
}

const FLAG_WIDTH = 36
const FLAG_HEIGHT = 24

export const CountryList = ({ countries }: CountryListProps) => {
  const t = useTranslations("drinkDetail")
  const locale = useLocale()

  return (
    <section className="flex flex-col gap-3" aria-labelledby="countries">
      <h2 id="countries" className="text-sm font-medium text-muted-foreground">
        {t("countries", { count: countries.length })}
      </h2>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {countries.map(({ code }) => (
          <li
            key={code}
            className="flex items-center gap-3 rounded-lg px-3 py-2 ring-1 ring-foreground/10"
          >
            <Image
              src={`/flags/${code.toUpperCase()}`}
              alt=""
              width={FLAG_WIDTH}
              height={FLAG_HEIGHT}
              className="aspect-3/2 h-6 w-auto shrink-0 rounded-[3px] ring-1 ring-foreground/10"
            />
            <span className="min-w-0 text-sm leading-snug">
              {getCountryName(code, locale)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
