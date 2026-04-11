import { db } from '@api/core/database'
import { createTicketHandler } from './ticket.handler'
import { createTicketsRepository } from './ticket.repository'
import { createTicketService } from './ticket.service'

export function createTicketModule() {
  const repository = createTicketsRepository(db)
  const service = createTicketService(repository)
  const handler = createTicketHandler(service)

  return {
    handler,
    service,
    repository,
  }
}
