import { users } from '@api/database/tables'
import { extendZodWithOpenApi, z } from '@hono/zod-openapi'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

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

export const publicUserColumns = {
  id: users.id,
  firstName: users.firstName,
  lastName: users.lastName,
  username: users.username,
  email: users.email,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
}

export const UserQuerySchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

// types

export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type UserBase = z.infer<typeof UserBaseSchema>
export type UserQuery = z.infer<typeof UserQuerySchema>
