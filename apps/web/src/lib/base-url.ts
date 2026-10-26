import { env } from "@/lib/env"

// In the browser every request goes through this app's origin (`/api/*` is
// rewritten to the backend in next.config.ts). On the server, call the backend
// directly.
export const getBaseUrl = () =>
  typeof window === "undefined"
    ? env.NEXT_PUBLIC_API_URL
    : window.location.origin
