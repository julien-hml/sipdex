import { vi } from "vitest"

type Handler = (request: Request) => unknown

type MockResponse = { status?: number; body: unknown }

// Routes keyed by "METHOD /path", e.g. "GET /api/drinks".
type Routes = Record<string, Handler>

const NOT_FOUND = 404

const isMockResponse = (value: unknown): value is MockResponse =>
  typeof value === "object" && value !== null && "body" in value

const toResponse = (value: unknown) => {
  const { status = 200, body } = isMockResponse(value) ? value : { body: value }

  return Response.json(body, { status })
}

// Stubs the global `fetch` with an in-memory API. Returns the mock so tests can
// assert on the requests that were made.
export const mockFetch = (routes: Routes) => {
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init)
    const { pathname } = new URL(request.url)
    const key = `${request.method} ${pathname}`

    if (!Object.hasOwn(routes, key)) {
      return Promise.resolve(
        Response.json(
          { error: "Not found", key: "NOT_FOUND" },
          { status: NOT_FOUND },
        ),
      )
    }

    return Promise.resolve(toResponse(routes[key](request)))
  })

  vi.stubGlobal("fetch", fetchMock)

  return fetchMock
}

export const requestsTo = (
  fetchMock: ReturnType<typeof mockFetch>,
  method: string,
  pathname: string,
) =>
  fetchMock.mock.calls
    .map(([input, init]) => new Request(input, init))
    .filter(
      (request) =>
        request.method === method && new URL(request.url).pathname === pathname,
    )
