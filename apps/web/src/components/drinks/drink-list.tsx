"use client"

import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { DrinkCard } from "@/components/drinks/drink-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useError } from "@/hooks/use-error"
import { useQuery } from "@/hooks/use-query"
import { client } from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import { drinkKeys } from "@/lib/drinks-cache"

const SKELETON_COUNT = 6

const GRID_CLASS_NAME = "grid gap-3 sm:grid-cols-2"

export const DrinkList = () => {
  const t = useTranslations()
  const { onError } = useError("drink")
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const { data, isPending, isError, error, refetch } = useQuery(
    client.api.drinks.$get,
    {
      queryKey: drinkKeys.list(session?.user.id),
      // Wait for the session so the `tasted` flags match the visitor.
      enabled: !isSessionPending,
    },
  )

  useEffect(() => {
    if (error) {
      onError(error)
    }
  }, [error, onError])

  if (isPending) {
    return (
      <div className={GRID_CLASS_NAME} aria-busy="true">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-[88px] rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">{t("errors.default")}</p>
        <Button variant="outline" onClick={() => void refetch()}>
          {t("retry")}
        </Button>
      </div>
    )
  }

  if (data.result.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        {t("home.empty")}
      </p>
    )
  }

  return (
    <ul className={GRID_CLASS_NAME}>
      {data.result.map((drink) => (
        <li key={drink.id}>
          <DrinkCard {...drink} />
        </li>
      ))}
    </ul>
  )
}
