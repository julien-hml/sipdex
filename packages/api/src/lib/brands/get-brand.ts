import { eq } from "drizzle-orm"
import { db } from "../../db"
import { brands } from "../../db/schema"

// Core select rather than `db.query`: Vercel's build-time type check loses the
// relational query's column types (`slug` comes out as `unknown`).
export const getBrand = async (
  id: string,
): Promise<{ id: string; slug: string } | null> => {
  const rows = await db
    .select({ id: brands.id, slug: brands.slug })
    .from(brands)
    .where(eq(brands.id, id))
    .limit(1)

  return rows.at(0) ?? null
}
