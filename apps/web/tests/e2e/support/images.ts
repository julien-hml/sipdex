import { fixtureColors } from "../../fixtures/drinks"

const FALLBACK_COLOR = "#737373"

// A soda can, so screenshots look like the real catalogue without shipping
// binary fixtures.
const canSvg = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 200">
  <defs>
    <linearGradient id="body" x1="0" x2="1">
      <stop offset="0" stop-color="${color}" stop-opacity="0.75"/>
      <stop offset="0.45" stop-color="${color}"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0.6"/>
    </linearGradient>
    <linearGradient id="metal" x1="0" x2="1">
      <stop offset="0" stop-color="#a3a3a3"/>
      <stop offset="0.5" stop-color="#f5f5f5"/>
      <stop offset="1" stop-color="#a3a3a3"/>
    </linearGradient>
  </defs>
  <rect x="22" y="14" width="76" height="14" rx="6" fill="url(#metal)"/>
  <rect x="18" y="24" width="84" height="160" rx="12" fill="url(#body)"/>
  <rect x="22" y="178" width="76" height="10" rx="5" fill="url(#metal)"/>
  <rect x="30" y="40" width="10" height="128" rx="5" fill="#fff" opacity="0.25"/>
  <circle cx="60" cy="104" r="22" fill="#fff" opacity="0.9"/>
  <circle cx="60" cy="104" r="12" fill="${color}"/>
</svg>`

const logoSvg = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="${color}"/>
  <circle cx="32" cy="32" r="14" fill="#fff" opacity="0.9"/>
</svg>`

// `/drinks/<id>.svg` renders a can, `/brands/<slug>.svg` a round logo.
export const fixtureImage = (url: string) => {
  const { pathname } = new URL(url)
  const [, kind, file] = pathname.split("/")
  const color = fixtureColors[file.replace(/\.svg$/u, "")] ?? FALLBACK_COLOR

  return kind === "brands" ? logoSvg(color) : canSvg(color)
}
