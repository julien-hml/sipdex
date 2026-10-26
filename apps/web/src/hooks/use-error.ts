import { useTranslations } from "next-intl"
import { useCallback } from "react"
import { toast } from "sonner"
import type { ApiClientError } from "@/lib/api-error"
import { getErrorMessageKey } from "@/lib/error-message-key"

// Resolves an API error to a user-facing toast.
export const useError = (scope: string) => {
  const t = useTranslations()

  const onError = useCallback(
    ({ key: code }: ApiClientError) => {
      // Keys are built at runtime, so they can't be checked against the
      // message catalogue; `t.has` guards each candidate instead.
      type MessageKey = Parameters<typeof t>[0]

      const key = getErrorMessageKey(scope, code, (candidate) =>
        t.has(candidate as MessageKey),
      )

      toast.error(t(key as MessageKey))
    },
    [t, scope],
  )

  return { onError }
}
