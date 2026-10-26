"use client"

import { ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { CountryList } from "@/components/drinks/country-list"
import { TasteButton } from "@/components/drinks/taste-button"
import { Skeleton } from "@/components/ui/skeleton"
import { useError } from "@/hooks/use-error"
import { useQuery } from "@/hooks/use-query"
import { client } from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import { drinkKeys } from "@/lib/drinks-cache"

type DrinkDetailProps = {
  id: string
}

const IMAGE_SIZE = 224
const LOGO_SIZE = 32
const NOT_FOUND_STATUS = 404

const BackLink = () => {
  const t = useTranslations("drinkDetail")

  return (
    <Link
      href="/"
      className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {t("back")}
    </Link>
  )
}

const DrinkDetailSkeleton = () => (
  <div className="flex flex-col items-center gap-6" aria-busy="true">
    <Skeleton className="size-56 rounded-xl" />
    <Skeleton className="h-8 w-40 rounded-md" />
    <Skeleton className="h-6 w-32 rounded-md" />
  </div>
)

export const DrinkDetail = ({ id }: DrinkDetailProps) => {
  const t = useTranslations()
  const { onError } = useError("drink")
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const { data, isPending, isError, error } = useQuery(
    () => client.api.drinks[":id"].$get({ param: { id } }),
    {
      queryKey: drinkKeys.detail(id, session?.user.id),
      enabled: !isSessionPending,
    },
  )

  useEffect(() => {
    if (error && error.status !== NOT_FOUND_STATUS) {
      onError(error)
    }
  }, [error, onError])

  if (isPending) {
    return <DrinkDetailSkeleton />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">
          {t(
            error.status === NOT_FOUND_STATUS
              ? "drinkDetail.notFound"
              : "errors.default",
          )}
        </p>
        <BackLink />
      </div>
    )
  }

  const { flavour, imageUrl, brand, countries, tasted } = data.result

  return (
    <article className="flex flex-col gap-8">
      <title>{`${flavour} · Sipdex`}</title>
      <BackLink />
      <div className="flex flex-col items-center gap-6 text-center">
        <Image
          src={imageUrl}
          alt={flavour}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          priority
          className="size-56 rounded-xl object-contain"
        />
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            {flavour}
          </h1>
          <div className="flex items-center gap-2">
            <Image
              src={brand.logoUrl}
              alt=""
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              className="size-8 rounded-full object-contain"
            />
            <span className="text-lg text-muted-foreground">{brand.name}</span>
          </div>
        </div>
        <TasteButton id={id} tasted={tasted} withLabel />
      </div>
      <CountryList countries={countries} />
    </article>
  )
}
