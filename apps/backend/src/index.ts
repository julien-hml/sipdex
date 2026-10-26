import { createApp } from "@sipdex/api/server"
import { Hono } from "hono"

// Vercel serves this default export as a function, and only accepts an
// entrypoint that imports `hono` itself. `mount` hands every request to the
// API app as-is, so its own notFound/onError handlers still apply. Locally,
// src/dev.ts wraps it in a Node server.
const app = new Hono().mount("/", createApp().fetch)

export default app
