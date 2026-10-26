import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

// The browser only ever talks to this origin: `/api/*` (REST + better-auth) is
// proxied to the Hono backend, so session cookies stay first-party.
const API_URL = process.env.API_URL ?? "http://localhost:3000"

const nextConfig: NextConfig = {
  images: {
    // Drink and brand images are served straight from the S3 bucket.
    unoptimized: true,
  },
  rewrites: () =>
    Promise.resolve([
      { source: "/api/:path*", destination: `${API_URL}/api/:path*` },
    ]),
}

export default withNextIntl(nextConfig)
