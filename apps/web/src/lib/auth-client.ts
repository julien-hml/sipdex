import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { getBaseUrl } from "@/lib/base-url"

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [adminClient()],
})
