import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { ticketModule, userModule } from './app'

const server = new OpenAPIHono()
  .doc('/doc', {
    openapi: '3.0.0',
    info: {
      title: 'hippo API',
      version: '1.0.0',
    },
  })
  .use('/*', cors())
  .use(logger())
  .route('/users', userModule.handler)
  .route('/tickets', ticketModule.handler)
  .notFound((c) => {
    return c.json({ error: 'Not Found!' }, 404)
  })
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse()
    }
    console.error(err)
    return c.text('Internal Server Error', 500)
  })
  .get('/ui', swaggerUI({ url: '/doc' }))

serve({
  fetch: server.fetch,
  port: 3000,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${info.port}`)
})
