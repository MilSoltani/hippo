import { timestamps } from '@api/database/timestamps'
import { tickets } from '@api/modules/ticket'
import { relations } from 'drizzle-orm'
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  ...timestamps,
})

export const userRelations = relations(users, ({ many }) => ({
  createdTickets: many(tickets, {
    relationName: 'creator',
  }),
  assignedTickets: many(tickets, {
    relationName: 'agent',
  }),
}))
