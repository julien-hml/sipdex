import { DrinkDetail } from "@/components/drinks/drink-detail"

const DrinkPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  return <DrinkDetail id={id} />
}

export default DrinkPage
