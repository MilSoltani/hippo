import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar({ length: 255 }),
  lastName: varchar({ length: 255 }),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
