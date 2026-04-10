import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { ticketModule, userModule } from './app'

const server = new Hono()
  .use(cors())
  .use(logger())
  .route('/users', userModule.handler)
  .route('/tickets', ticketModule.handler)

serve({
  fetch: server.fetch,
  port: 3000,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${info.port}`)
})
