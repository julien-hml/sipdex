import * as flags from "country-flag-icons/string/3x2"

type FlagCode = keyof typeof flags

const ONE_YEAR_IN_SECONDS = 31_536_000

const isFlagCode = (code: string): code is FlagCode =>
  Object.hasOwn(flags, code)

// Serves country flags as static SVG files (`/flags/FR`) so the ~250 flags never
// end up in the client bundle, and render the same on every OS (Windows has no
// flag emoji).
export const generateStaticParams = () =>
  Object.keys(flags).map((code) => ({ code }))

export const dynamicParams = false

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ code: string }> },
) => {
  const { code } = await params

  if (!isFlagCode(code)) {
    return new Response(null, { status: 404 })
  }

  return new Response(flags[code], {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": `public, max-age=${ONE_YEAR_IN_SECONDS}, immutable`,
    },
  })
}
