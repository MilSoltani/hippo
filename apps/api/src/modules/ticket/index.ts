import { db } from '@api/database'
import { createTicketHandler } from './ticket.handler'
import { createTicketsRepository } from './ticket.repository'
import { createTicketService } from './ticket.service'

const ticketRepository = createTicketsRepository(db)
export const ticketService = createTicketService(ticketRepository)
export const ticketHandler = createTicketHandler(ticketService)

export type { TicketHandler } from './ticket.handler'
export * as TicketSchemas from './ticket.schema'
export type { TicketService } from './ticket.service'
