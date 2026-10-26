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
// Returns the mutable session state: set `role` to sign the visitor in or out.
export const mockApi = async (page: Page, options: MockApiOptions = {}) => {
  const { routes = {} } = options
  const state = { role: options.role ?? null }
  const drink = (item: (typeof fixtureDrinks)[number]) => ({
    ...item,
    tasted: state.role ? false : null,
  })
  const defaults: Routes = {
    "GET /api/auth/get-session": () =>
      state.role ? fixtureSession(state.role) : null,
    "POST /api/auth/sign-out": () => {
      state.role = null

      return { success: true }
    },
    "GET /api/drinks": () => ({ result: fixtureDrinks.map(drink) }),
    ...Object.fromEntries(
      fixtureDrinks.map((item) => [
        `GET /api/drinks/${item.id}`,
        () => ({ result: drink(item) }),
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

  return state
}
