# @sipdex/web

Next.js web app for Sipdex — the browser counterpart of
[`apps/mobile`](../mobile).

| Concern   | Choice                                                                |
| --------- | --------------------------------------------------------------------- |
| Framework | Next.js (App Router, Turbopack)                                       |
| UI        | shadcn/ui on [Base UI](https://base-ui.com) (`base-nova` style)       |
| Data      | TanStack Query + the typed Hono client (`AppType` from `@sipdex/api`) |
| Auth      | better-auth React client                                              |
| i18n      | next-intl (locale from the `NEXT_LOCALE` cookie / `Accept-Language`)  |
| Tests     | Vitest (unit + jsdom integration), Playwright (e2e)                   |

## Running

```bash
pnpm web          # from the repo root, or `pnpm dev` here — http://localhost:3001
```

The browser only talks to this app: `next.config.ts` rewrites `/api/*` to the
Hono backend (`NEXT_PUBLIC_API_URL`, default `http://localhost:3000`), so better-auth
cookies are first-party. Add `http://localhost:3001` to the backend's
`TRUSTED_ORIGINS`.

## Tests

```bash
pnpm test               # Vitest: tests/unit (node) + tests/integration (jsdom)
pnpm test:e2e:install   # once: download Chromium for Playwright
pnpm test:e2e           # Playwright: builds + starts the app on :3001
```

The e2e suite mocks the API at the network layer
([`tests/e2e/support/api-mock.ts`](tests/e2e/support/api-mock.ts)), so it needs
no database or object storage. Each page spec saves light/dark screenshots for
desktop and mobile under `tests/e2e/screenshots/` (uploaded as a CI artifact).

## Adding shadcn components

```bash
pnpm dlx shadcn@latest add <component>
```
