import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userHandler } from './modules/user'

const app = new Hono()
app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/users', userHandler)

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${info.port}`)
})
