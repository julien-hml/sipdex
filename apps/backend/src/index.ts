import { createApp } from "@sipdex/api/server"

// Vercel picks up this default export and serves it as a function; locally,
// src/dev.ts wraps it in a Node server.
const app: ReturnType<typeof createApp> = createApp()

export default app
