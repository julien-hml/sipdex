"use client"

import { useQueryClient } from "@tanstack/react-query"
import { cn } from "cn"
import { CupSoda } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { useError } from "@/hooks/use-error"
import { useMutation } from "@/hooks/use-mutation"
import { client } from "@/lib/api"
import { drinkKeys, setTastedInCache } from "@/lib/drinks-cache"

type TasteButtonProps = {
  id: string
  tasted: boolean | null
  className?: string
}

type CachedDrinks = Parameters<typeof setTastedInCache>[0]

export const TasteButton = ({ id, tasted, className }: TasteButtonProps) => {
  const t = useTranslations("drink")
  const { onError } = useError("drink")
  const queryClient = useQueryClient()

  const setTasted = (value: boolean) => {
    queryClient.setQueriesData<CachedDrinks>(
      { queryKey: drinkKeys.all },
      (old) => setTastedInCache(old, id, value),
    )
  }

  const taste = useMutation(client.api.drinks[":id"].taste.$post, {
    onError,
    onSuccess: () => setTasted(true),
  })
  const untaste = useMutation(client.api.drinks[":id"].taste.$delete, {
    onError,
    onSuccess: () => setTasted(false),
  })

  // Anonymous visitors get `null`: there is nothing to toggle.
  if (tasted === null) {
    return null
  }

  const mutation = tasted ? untaste : taste
  const label = t(tasted ? "markUntasted" : "markTasted")

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ param: { id } })}
      aria-label={label}
      aria-pressed={tasted}
      title={label}
      className={cn("relative z-10", className)}
    >
      <CupSoda className={cn("size-5", tasted && "fill-current")} />
    </Button>
  )
}
