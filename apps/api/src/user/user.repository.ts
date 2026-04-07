import type { DbType } from '@api/database'
import type { SQL } from 'drizzle-orm'
import type { CreateUser, UpdateUser, User, UserQuery } from './users.schema'
import { tables } from '@api/database'
import { parseRHSFilters } from '@api/lib'
import { and, eq } from 'drizzle-orm'
import { publicUserColumns } from './users.schema'

export function createUsersRepository(db: DbType) {
  async function getAll(query: UserQuery): Promise<User[]> {
    const filters: (SQL | undefined)[] = [
      parseRHSFilters(tables.users.firstName, query.firstName),
      parseRHSFilters(tables.users.lastName, query.lastName),
      parseRHSFilters(tables.users.username, query.username),
      parseRHSFilters(tables.users.createdAt, query.createdAt),
      parseRHSFilters(tables.users.updatedAt, query.updatedAt),
    ]

    const result = await db
      .select(publicUserColumns)
      .from(tables.users)
      .where(and(...filters.filter(Boolean)))

    return result
  }

  async function getById(id: number): Promise<User | undefined> {
    const [result] = await db
      .select(publicUserColumns)
      .from(tables.users)
      .where(eq(tables.users.id, id))

    return result
  }

  async function create(data: CreateUser): Promise<User | undefined> {
    const [result] = await db
      .insert(tables.users)
      .values(data)
      .returning(publicUserColumns)

    return result
  }

  async function update(id: number, data: UpdateUser): Promise<User | undefined> {
    const [result] = await db
      .update(tables.users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tables.users.id, id))
      .returning(publicUserColumns)

    return result
  }

  async function remove(id: number): Promise<User | undefined> {
    const [result] = await db
      .delete(tables.users)
      .where(eq(tables.users.id, id))
      .returning(publicUserColumns)

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
