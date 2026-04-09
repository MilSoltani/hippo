import type { AppEnvironment } from '@api/types'
import type { TicketService } from './ticket.service'
import { OpenAPIHono } from '@hono/zod-openapi'
import { TicketRoutes } from './ticket.routes'
import { TicketSchema } from './ticket.schema'

export function createTicketHandler(ticketService: TicketService) {
  return new OpenAPIHono<AppEnvironment>()
    .openapi(TicketRoutes.getAll, async (c) => {
      const query = c.req.query()

      const data = await ticketService.getAll(query)
      return c.json(data, 200)
    })
    .openapi(TicketRoutes.getById, async (c) => {
      const { id } = c.req.valid('param')
      const data = await ticketService.getById(id)
      const parsedData = TicketSchema.parse(data)
      return c.json(parsedData, 200)
    })
    .openapi(TicketRoutes.create, async (c) => {
      const data = c.req.valid('json')
      const ticket = await ticketService.create(data)
      const parsedTicket = TicketSchema.parse(ticket)
      return c.json(parsedTicket, 201)
    })
    .openapi(TicketRoutes.update, async (c) => {
      const { id } = c.req.valid('param')
      const data = c.req.valid('json')
      const updatedTicket = await ticketService.update(id, data)
      const parsedData = TicketSchema.parse(updatedTicket)
      return c.json(parsedData, 200)
    })
    .openapi(TicketRoutes.remove, async (c) => {
      const { id } = c.req.valid('param')
      await ticketService.remove(id)
      return c.body(null, 204)
    })
}

export type TicketHandler = ReturnType<typeof createTicketHandler>
