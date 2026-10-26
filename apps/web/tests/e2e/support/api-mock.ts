import type { Page, Request, Route } from "@playwright/test"
import { FIXTURE_IMAGE_HOST, fixtureDrinks } from "../../fixtures/drinks"
import { fixtureImage } from "./images"

type Role = "user" | "admin"

type Reply = { status?: number; body: unknown }

// Returns a `Reply`, or a bare JSON body (sent with a 200).
type Handler = (request: Request) => unknown

// Routes keyed by "METHOD /path", e.g. "GET /api/drinks". They override the
// defaults below.
type Routes = Record<string, Handler>

type MockApiOptions = {
  role?: Role | null
  routes?: Routes
}

const FAR_FUTURE = "2099-01-01T00:00:00.000Z"

export const fixtureSession = (role: Role) => ({
  session: {
    id: "session-1",
    userId: "user-1",
    token: "token",
    expiresAt: FAR_FUTURE,
    createdAt: FAR_FUTURE,
    updatedAt: FAR_FUTURE,
  },
  user: {
    id: "user-1",
    name: "",
    email: `${role}@sipdex.io`,
    emailVerified: false,
    image: null,
    role,
    banned: false,
    createdAt: FAR_FUTURE,
    updatedAt: FAR_FUTURE,
  },
})

const isReply = (value: unknown): value is Reply =>
  typeof value === "object" && value !== null && "body" in value

const fulfill = (route: Route, value: unknown) => {
  const { status = 200, body } = isReply(value) ? value : { body: value }

  return route.fulfill({ status, json: body })
}

// Replaces the backend with in-memory fixtures. Everything under `/api` is
// answered here, so the app runs without a database or object storage.
export const mockApi = async (page: Page, options: MockApiOptions = {}) => {
  const { role = null, routes = {} } = options
  const drinks = fixtureDrinks.map((drink) => ({
    ...drink,
    tasted: role ? false : null,
  }))
  const defaults: Routes = {
    "GET /api/auth/get-session": () => (role ? fixtureSession(role) : null),
    "GET /api/drinks": () => ({ result: drinks }),
    ...Object.fromEntries(
      drinks.map((drink) => [
        `GET /api/drinks/${drink.id}`,
        () => ({ result: drink }),
      ]),
    ),
  }
  const handlers = { ...defaults, ...routes }

  await page.route(`${FIXTURE_IMAGE_HOST}/**`, (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: fixtureImage(route.request().url()),
    }),
  )

  await page.route("**/api/**", (route) => {
    const request = route.request()
    const { pathname } = new URL(request.url())
    const key = `${request.method()} ${pathname}`

    if (!Object.hasOwn(handlers, key)) {
      return fulfill(route, {
        status: 404,
        body: { error: "Not found", key: "NOT_FOUND" },
      })
    }

    return fulfill(route, handlers[key](request))
  })
}
