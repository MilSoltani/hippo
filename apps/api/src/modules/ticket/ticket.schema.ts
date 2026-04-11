import { tickets } from '@api/core/database/tables'
import { getSelectedColumns } from '@api/core/utils/db.util'
import { extendZodWithOpenApi, z } from '@hono/zod-openapi'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

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

export const ticketEssentialColumns = getSelectedColumns(
  tickets,
  ['id', 'subject'],
)

// types

export type Ticket = z.infer<typeof TicketSchema>
export type CreateTicket = z.infer<typeof CreateTicketSchema>
export type UpdateTicket = z.infer<typeof UpdateTicketSchema>
export type TicketBase = z.infer<typeof TicketBaseSchema>
