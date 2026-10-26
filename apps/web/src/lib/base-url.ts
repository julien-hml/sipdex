const DEFAULT_API_URL = "http://localhost:3000"

// In the browser every request goes through this app's origin (`/api/*` is
// rewritten to the backend in next.config.ts). On the server, call the backend
// directly.
export const getBaseUrl = () =>
  typeof window === "undefined"
    ? (process.env.API_URL ?? DEFAULT_API_URL)
    : window.location.origin
