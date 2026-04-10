import { users } from '@api/modules/user'
import { integer, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const ticketStatus = pgEnum('status', ['open', 'pending', 'working', 'resolved', 'closed'])

export const ticketPriority = pgEnum('priority', ['low', 'medium', 'high', 'urgent'])

export const tickets = pgTable('tickets', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  creatorId: integer().references(() => users.id, { onDelete: 'restrict' }).notNull(),
  agentId: integer().references(() => users.id, { onDelete: 'restrict' }),
  subject: varchar({ length: 512 }).notNull(),
  description: text().notNull(),
  status: ticketStatus().notNull().default('open'),
  priority: ticketPriority().notNull().default('low'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
