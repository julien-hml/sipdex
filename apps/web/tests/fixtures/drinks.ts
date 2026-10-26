// API-shaped fixtures shared by the integration (Vitest) and e2e (Playwright)
// suites. Images point to a fake host the e2e suite serves itself.
export const FIXTURE_IMAGE_HOST = "https://images.sipdex.test"

type FixtureCountry = { name: string; code: string }

export type FixtureDrink = {
  id: string
  flavour: string
  imageUrl: string
  brand: { id: string; name: string; logoUrl: string }
  countries: FixtureCountry[]
  tasted: boolean | null
  createdAt: string
}

const COUNTRIES = {
  BR: { name: "Brazil", code: "BR" },
  CA: { name: "Canada", code: "CA" },
  DE: { name: "Germany", code: "DE" },
  ES: { name: "Spain", code: "ES" },
  FR: { name: "France", code: "FR" },
  GB: { name: "United Kingdom", code: "GB" },
  IT: { name: "Italy", code: "IT" },
  JP: { name: "Japan", code: "JP" },
  US: { name: "United States of America", code: "US" },
} satisfies Record<string, FixtureCountry>

const brand = (id: string, name: string, slug: string) => ({
  id,
  name,
  logoUrl: `${FIXTURE_IMAGE_HOST}/brands/${slug}.svg`,
})

export const fixtureBrands = [
  brand("8a7f6e0c-0f7a-4b8e-9c55-0a6c3b8f1a01", "Coca-Cola", "coca-cola"),
  brand("8a7f6e0c-0f7a-4b8e-9c55-0a6c3b8f1a02", "Fanta", "fanta"),
  brand("8a7f6e0c-0f7a-4b8e-9c55-0a6c3b8f1a03", "Monster", "monster"),
  brand("8a7f6e0c-0f7a-4b8e-9c55-0a6c3b8f1a04", "Red Bull", "red-bull"),
]

const [COCA_COLA, FANTA, MONSTER, RED_BULL] = fixtureBrands

const drink = (
  [id, flavour]: [id: string, flavour: string],
  drinkBrand: FixtureDrink["brand"],
  countries: FixtureCountry[],
): FixtureDrink => ({
  id,
  flavour,
  imageUrl: `${FIXTURE_IMAGE_HOST}/drinks/${id}.svg`,
  brand: drinkBrand,
  countries,
  tasted: null,
  createdAt: "2026-10-01T12:00:00.000Z",
})

export const fixtureDrinks: FixtureDrink[] = [
  drink(["drink-orange", "Orange"], FANTA, [COUNTRIES.FR, COUNTRIES.DE]),
  drink(["drink-lemon", "Lemon"], FANTA, [COUNTRIES.IT]),
  drink(["drink-grape", "Grape"], COCA_COLA, [COUNTRIES.ES, COUNTRIES.US]),
  drink(["drink-cherry", "Cherry"], COCA_COLA, [
    COUNTRIES.CA,
    COUNTRIES.GB,
    COUNTRIES.US,
  ]),
  drink(["drink-strawberry", "Strawberry"], MONSTER, [COUNTRIES.JP]),
  drink(["drink-exotic", "Exotic"], RED_BULL, [COUNTRIES.BR, COUNTRIES.FR]),
  drink(["drink-watermelon", "Watermelon"], RED_BULL, [COUNTRIES.DE]),
]

// Tasted flags as a signed-in user sees them.
export const withTasted = (tastedIds: string[]) =>
  fixtureDrinks.map((item) => ({
    ...item,
    tasted: tastedIds.includes(item.id),
  }))

// Image colours for the generated e2e fixtures, keyed by drink / brand slug.
export const fixtureColors: Record<string, string> = {
  "drink-orange": "#f97316",
  "drink-lemon": "#eab308",
  "drink-grape": "#7c3aed",
  "drink-cherry": "#be123c",
  "drink-strawberry": "#ec4899",
  "drink-exotic": "#06b6d4",
  "drink-watermelon": "#16a34a",
  "coca-cola": "#dc2626",
  fanta: "#f97316",
  monster: "#22c55e",
  "red-bull": "#1d4ed8",
}
