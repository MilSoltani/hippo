import { usersTable } from '@api/core/database/schema'
import { extendZodWithOpenApi, z } from '@hono/zod-openapi'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

extendZodWithOpenApi(z)

// schemas

export const UserSchema = createSelectSchema(usersTable)
  .omit({
    password: true,
  })
  .strict()
  .openapi('User')

export const CreateUserSchema = createInsertSchema(usersTable, {
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

export const publicUserColumns = {
  id: usersTable.id,
  firstName: usersTable.firstName,
  lastName: usersTable.lastName,
  username: usersTable.username,
  email: usersTable.email,
  createdAt: usersTable.createdAt,
  updatedAt: usersTable.updatedAt,
}

// types

export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type UserBase = z.infer<typeof UserBaseSchema>
