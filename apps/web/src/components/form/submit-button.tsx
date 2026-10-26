"use client"

import { useStore } from "@tanstack/react-form"
import type { ReactNode } from "react"
import { useFormContext } from "@/components/form/form-context"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type SubmitButtonProps = {
  children: ReactNode
  isPending?: boolean
}

export const SubmitButton = ({
  children,
  isPending = false,
}: SubmitButtonProps) => {
  const form = useFormContext()
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
  const busy = isPending || isSubmitting

  return (
    <Button type="submit" size="lg" disabled={busy} className="w-full">
      {busy && <Spinner />}
      {children}
    </Button>
  )
}
