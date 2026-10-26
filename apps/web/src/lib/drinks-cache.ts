type TastedDrink = { id: string; tasted: boolean | null }

type DrinksResponse = { result: TastedDrink | TastedDrink[] }

export const drinkKeys = {
  all: ["drinks"] as const,
  list: (userId?: string) => ["drinks", "list", userId ?? null] as const,
  detail: (id: string, userId?: string) =>
    ["drinks", "detail", id, userId ?? null] as const,
}

const markTasted = <T extends TastedDrink>(
  drink: T,
  id: string,
  tasted: boolean,
) => (drink.id === id ? { ...drink, tasted } : drink)

// Updates the `tasted` flag of one drink in a cached response, whether it holds
// the whole list or a single drink.
export const setTastedInCache = <T extends DrinksResponse>(
  data: T | undefined,
  id: string,
  tasted: boolean,
): T | undefined => {
  if (!data) {
    return data
  }

  const { result } = data

  return {
    ...data,
    result: Array.isArray(result)
      ? result.map((drink) => markTasted(drink, id, tasted))
      : markTasted(result, id, tasted),
  }
}
