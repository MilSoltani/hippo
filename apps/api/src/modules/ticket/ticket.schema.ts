import { getEssentialColumns } from '@api/core/utils/db.util'
import { extendZodWithOpenApi, z } from '@hono/zod-openapi'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { tickets } from './ticket.table'

extendZodWithOpenApi(z)

// schemas

export const TicketSchema = createSelectSchema(tickets)
  .strict()
  .openapi('Ticket')

export const CreateTicketSchema = createInsertSchema(tickets).omit({
  createdAt: true,
  updatedAt: true,
}).strict().openapi('CreateTicket')

export const UpdateTicketSchema = CreateTicketSchema
  .partial()
  .openapi('UpdateTicket')

export const TicketBaseSchema = TicketSchema.pick({
  id: true,
  subject: true,
}).openapi('TicketBase')

export const essentialColumns = getEssentialColumns(
  tickets,
  ['id', 'subject'],
)

// types

export type Ticket = z.infer<typeof TicketSchema>
export type CreateTicket = z.infer<typeof CreateTicketSchema>
export type UpdateTicket = z.infer<typeof UpdateTicketSchema>
export type TicketBase = z.infer<typeof TicketBaseSchema>
