"use client"

import { Camera, ImagePlus } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { type ChangeEvent, useEffect, useMemo, useRef } from "react"
import { useFieldContext } from "@/components/form/form-context"
import { useFieldErrors } from "@/components/form/use-field-errors"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { ACCEPTED_IMAGE_TYPES } from "@/schemas/images"

type ImageFieldProps = {
  label: string
}

const PREVIEW_SIZE = 160
const ACCEPT = ACCEPTED_IMAGE_TYPES.join(",")

// Object URL for a picked file, revoked once the file changes or unmounts.
const useObjectUrl = (file: File | null) => {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(
    () => () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    },
    [url],
  )

  return url
}

// Mobile offers "Library" and "Camera"; on the web the camera input uses
// `capture`, which phones honour and desktops treat as a plain file picker.
export const ImageField = ({ label }: ImageFieldProps) => {
  const t = useTranslations("admin.image")
  const field = useFieldContext<File | null>()
  const errors = useFieldErrors()
  const libraryInput = useRef<HTMLInputElement>(null)
  const cameraInput = useRef<HTMLInputElement>(null)
  const previewUrl = useObjectUrl(field.state.value)

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    field.handleChange(event.target.files?.[0] ?? null)
    // Lets the same file be picked again after a reset.
    event.target.value = ""
  }

  return (
    <Field data-invalid={errors.length > 0}>
      <FieldLabel htmlFor={`${field.name}-library`}>{label}</FieldLabel>
      {/* Wrapped: Field stretches its direct children to full width. */}
      {previewUrl && (
        <div className="flex justify-center">
          <Image
            src={previewUrl}
            alt={t("preview")}
            width={PREVIEW_SIZE}
            height={PREVIEW_SIZE}
            className="size-40 rounded-lg bg-muted/50 object-contain p-2 ring-1 ring-foreground/10"
          />
        </div>
      )}
      <input
        ref={libraryInput}
        id={`${field.name}-library`}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        tabIndex={-1}
        onChange={onPick}
      />
      <input
        ref={cameraInput}
        type="file"
        accept={ACCEPT}
        capture="environment"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={onPick}
      />
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={() => libraryInput.current?.click()}
        >
          <ImagePlus />
          {t("pickImage")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => cameraInput.current?.click()}
        >
          <Camera />
          {t("takePhoto")}
        </Button>
      </div>
      <FieldError errors={errors} />
    </Field>
  )
}
