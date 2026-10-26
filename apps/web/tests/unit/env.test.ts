import { afterEach, describe, expect, it, vi } from "vitest"

// `env` is parsed when the module loads, so each case re-imports it.
const loadEnv = async () => {
  vi.resetModules()

  const { env } = await import("@/lib/env")

  return env
}

describe("env", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("reads NEXT_PUBLIC_API_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.sipdex.io")

    expect((await loadEnv()).NEXT_PUBLIC_API_URL).toBe("https://api.sipdex.io")
  })

  it("defaults to the local backend", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", undefined)

    expect((await loadEnv()).NEXT_PUBLIC_API_URL).toBe("http://localhost:3000")
  })

  it("rejects an invalid URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "not-a-url")

    await expect(loadEnv()).rejects.toThrow()
  })
})
