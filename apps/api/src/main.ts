import { createTicketModule } from '@api/modules/ticket'
import { createUserModule } from '@api/modules/user'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const userModule = createUserModule()
const ticketModule = createTicketModule()

const app = new Hono()
app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/users', userModule.handler)
app.route('/tickets', ticketModule.handler)

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${info.port}`)
})
