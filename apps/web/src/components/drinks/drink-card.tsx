import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { CountryFlag } from "@/components/drinks/country-flag"
import { TasteButton } from "@/components/drinks/taste-button"
import { Card } from "@/components/ui/card"

type Country = { name: string; code: string }

type Brand = { id: string; name: string; logoUrl: string }

type DrinkCardProps = {
  id: string
  flavour: string
  imageUrl: string
  brand: Brand
  countries: Country[]
  tasted: boolean | null
}

const MAX_COUNTRIES_DISPLAYED = 2
const IMAGE_SIZE = 64

export const DrinkCard = ({
  id,
  flavour,
  imageUrl,
  brand,
  countries,
  tasted,
}: DrinkCardProps) => {
  const t = useTranslations("drink")
  const firstCountries = countries.slice(0, MAX_COUNTRIES_DISPLAYED)
  const hiddenCount = countries.length - firstCountries.length

  return (
    <Card
      size="sm"
      className="relative flex-row items-center gap-4 px-3 transition-colors hover:bg-muted/50"
    >
      <Image
        src={imageUrl}
        alt=""
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        className="size-16 shrink-0 rounded-md object-contain"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* The link covers the whole card; flags and the taste button sit above it. */}
        <Link
          href={`/drinks/${id}`}
          className="truncate text-base font-semibold after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
        >
          {flavour}
        </Link>
        <p className="truncate text-sm text-muted-foreground">{brand.name}</p>
        {firstCountries.length > 0 && (
          <div className="flex items-center gap-1.5">
            {firstCountries.map((country) => (
              <CountryFlag key={country.code} code={country.code} />
            ))}
            {hiddenCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {t("moreCountries", { count: hiddenCount })}
              </span>
            )}
          </div>
        )}
      </div>
      <TasteButton id={id} tasted={tasted} />
    </Card>
  )
}
