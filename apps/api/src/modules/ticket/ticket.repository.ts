import type { DbType } from '@api/database'
import type { QueryParams } from '@api/lib'
import type { CreateTicket, Ticket, UpdateTicket } from './ticket.schema'
import { parseQueryParams } from '@api/lib'
import { asc, eq } from 'drizzle-orm'
import { tickets } from './ticket.table'

export function createTicketsRepository(db: DbType) {
  async function getAll(query: QueryParams = {}): Promise<Ticket[]> {
    const { select, where, orderBy, limit, offset }
      = parseQueryParams(tickets, query)

    const query_builder = select
      ? db.select(select).from(tickets)
      : db.select().from(tickets)

    const result = await query_builder
      .where(where)
      .orderBy(orderBy ?? asc(tickets.subject))
      .limit(limit)
      .offset(offset)

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
