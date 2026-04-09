import type { QueryParams } from '@api/lib'
import type { TicketRepository } from './ticket.repository'
import type { CreateTicket, UpdateTicket } from './ticket.schema'
import { NotFoundException } from '@api/errors'

export function createTicketService(ticketRepository: TicketRepository) {
  async function getAll(query: QueryParams) {
    const result = await ticketRepository.getAll(query)

    return result
  }

  async function getById(id: number) {
    const result = await ticketRepository.getById(id)

    if (!result)
      throw new NotFoundException('Ticket')

    return result
  }

  async function create(data: CreateTicket) {
    const result = await ticketRepository.create(data)

    return result
  }

  async function update(id: number, data: UpdateTicket) {
    const result = await ticketRepository.update(id, data)

    if (!result)
      throw new NotFoundException('Ticket')

    return result
  }

  async function remove(id: number) {
    const result = await ticketRepository.remove(id)

    if (!result)
      throw new NotFoundException('Ticket')

    return result
  }

  return {
    getAll,
    getById,
    update,
    create,
    remove,
  }
}

export type TicketService = ReturnType<typeof createTicketService>
