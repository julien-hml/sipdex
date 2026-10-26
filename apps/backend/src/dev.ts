import { serve } from "@hono/node-server"
import { env, logger } from "@sipdex/api/server"
import app from "./index"

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  logger.info(`🚀 sipdex-backend listening on http://localhost:${info.port}`)
})
