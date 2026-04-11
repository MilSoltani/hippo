import { timestamps } from '@api/core/database/timestamps'

import { integer, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const ticketStatus = pgEnum('status', ['open', 'pending', 'working', 'resolved', 'closed'])

export const ticketPriority = pgEnum('priority', ['low', 'medium', 'high', 'urgent'])

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  ...timestamps,
})

export const tickets = pgTable('tickets', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  creatorId: integer('creator_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  agentId: integer('agent_id').references(() => users.id, { onDelete: 'restrict' }),
  subject: varchar({ length: 512 }).notNull(),
  description: text().notNull(),
  status: ticketStatus().notNull().default('open'),
  priority: ticketPriority().notNull().default('low'),
  ...timestamps,
})
