import type { DbType } from '@api/core/database'
import { createTicketHandler } from './ticket.handler'
import { createTicketsRepository } from './ticket.repository'
import { createTicketService } from './ticket.service'

export function createTicketModule(db: DbType) {
  const repository = createTicketsRepository(db)
  const service = createTicketService(repository)
  const handler = createTicketHandler(service)

  return {
    handler,
    service,
    repository,
  }
}
