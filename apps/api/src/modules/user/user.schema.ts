import { extendZodWithOpenApi, z } from '@hono/zod-openapi'
import { getTableColumns } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from './user.table'

extendZodWithOpenApi(z)

// schemas

export const UserSchema = createSelectSchema(users)
  .omit({
    password: true,
  })
  .strict()
  .openapi('User')

export const CreateUserSchema = createInsertSchema(users, {
  username: z.string().min(5).max(255),
  email: z.string().email().min(5).max(255),
  firstName: z.string().min(1).max(255).nullable(),
  lastName: z.string().min(1).max(255).nullable(),
}).omit({
  password: true, // handled by separate auth module
  createdAt: true,
  updatedAt: true,
}).strict().openapi('CreateUser')

export const UpdateUserSchema = CreateUserSchema
  .partial()
  .openapi('UpdateUser')

export const UserBaseSchema = UserSchema.omit({
  email: true,
  createdAt: true,
  updatedAt: true,
}).openapi('UserBase')

const { password, ...publicColumns } = getTableColumns(users)

const essentialColumns = Object.fromEntries(
  Object.entries(publicColumns).filter(([key]) =>
    key === 'id' || key === 'username'),
)

export { essentialColumns, publicColumns }

// types

export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type UserBase = z.infer<typeof UserBaseSchema>
