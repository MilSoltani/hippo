import type { QueryParams } from '@api/core'
import type { DbType } from '@api/core/database'
import type { CreateUser, UpdateUser, User } from './user.schema'
import { parseQuery } from '@api/core'
import { asc, eq } from 'drizzle-orm'
import { publicColumns } from './user.schema'
import { users } from './user.table'

export function createUsersRepository(db: DbType) {
  async function getAll(query: QueryParams = {}): Promise<User[]> {
    const { columns, where, orderBy, limit, offset, with: withQuery }
      = parseQuery(users, query, ['password'])

    const result = await db.query.users.findMany({
      columns,
      where,
      orderBy: orderBy ?? asc(users.username),
      limit,
      offset,
      with: withQuery,
    })

    return result as User[]
  }

  async function getById(id: number): Promise<User | undefined> {
    const [result] = await db
      .select(publicColumns)
      .from(users)
      .where(eq(users.id, id))

    return result
  }

  async function create(data: CreateUser): Promise<User | undefined> {
    const [result] = await db
      .insert(users)
      .values(data)
      .returning(publicColumns)

    return result
  }

  async function update(id: number, data: UpdateUser): Promise<User | undefined> {
    const [result] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(users.id, id))
      .returning(publicColumns)

    return result
  }

  async function remove(id: number): Promise<User | undefined> {
    const [result] = await db
      .delete(users)
      .where(eq(users.id, id))
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
