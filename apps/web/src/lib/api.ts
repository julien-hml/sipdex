import type { AppType } from "@sipdex/api"
import { hc } from "hono/client"
import { getBaseUrl } from "@/lib/base-url"

export const client = hc<AppType>(getBaseUrl())
