import type { DbType } from '@api/core/database'
import type { QueryParams } from '@api/core/query'
import type { CreateTicket, Ticket, UpdateTicket } from './ticket.schema'
import { tickets } from '@api/core/database/tables'
import { parseQuery } from '@api/core/query'
import { desc, eq } from 'drizzle-orm'

export function createTicketsRepository(db: DbType) {
  async function getAll(query: QueryParams = {}): Promise<Ticket[]> {
    const { columns, where, orderBy, limit, offset, with: withQuery }
      = parseQuery(db, tickets, query)

    const result = await db.query.tickets.findMany({
      columns,
      where,
      orderBy: orderBy ?? desc(tickets.createdAt),
      limit,
      offset,
      with: withQuery,
    })

    return result as Ticket[]
  }

  async function getById(id: number): Promise<Ticket | undefined> {
    const [result] = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, id))

    return result
  }

  async function create(data: CreateTicket): Promise<Ticket | undefined> {
    const [result] = await db
      .insert(tickets)
      .values(data)
      .returning()

    return result
  }

  async function update(id: number, data: UpdateTicket): Promise<Ticket | undefined> {
    const [result] = await db
      .update(tickets)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(tickets.id, id))
      .returning()

    return result
  }

  async function remove(id: number): Promise<Ticket | undefined> {
    const [result] = await db
      .delete(tickets)
      .where(eq(tickets.id, id))
      .returning()

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

export type TicketRepository = ReturnType<typeof createTicketsRepository>
