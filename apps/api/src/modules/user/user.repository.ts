import type { DbType } from '@api/database'
import type { QueryParams } from '@api/lib'
import type { CreateUser, UpdateUser, User } from './user.schema'
import { tables } from '@api/database'
import { parseQueryParams } from '@api/lib'
import { asc, eq } from 'drizzle-orm'
import { publicColumns } from './user.schema'

export function createUsersRepository(db: DbType) {
  async function getAll(query: QueryParams = {}): Promise<User[]> {
    const { select, where, orderBy, limit, offset }
      = parseQueryParams(tables.users, query, publicColumns)

    // never select password
    const safeSelect = select
      ? Object.fromEntries(
          Object.entries(select).filter(([key]) => key !== 'password'),
        )
      : null

    const query_builder = (safeSelect && Object.keys(safeSelect).length > 0)
      ? db.select(safeSelect).from(tables.users)
      : db.select(publicColumns).from(tables.users)

    const result = await query_builder
      .where(where)
      .orderBy(orderBy ?? asc(tables.users.username))
      .limit(limit)
      .offset(offset)

    return result as User[]
  }

  async function getById(id: number): Promise<User | undefined> {
    const [result] = await db
      .select(publicColumns)
      .from(tables.users)
      .where(eq(tables.users.id, id))

    return result
  }

  async function create(data: CreateUser): Promise<User | undefined> {
    const [result] = await db
      .insert(tables.users)
      .values(data)
      .returning(publicColumns)

    return result
  }

  async function update(id: number, data: UpdateUser): Promise<User | undefined> {
    const [result] = await db
      .update(tables.users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tables.users.id, id))
      .returning(publicColumns)

    return result
  }

  async function remove(id: number): Promise<User | undefined> {
    const [result] = await db
      .delete(tables.users)
      .where(eq(tables.users.id, id))
      .returning(publicColumns)

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

export type UserRepository = ReturnType<typeof createUsersRepository>
