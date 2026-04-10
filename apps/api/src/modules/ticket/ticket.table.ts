import { timestamps } from '@api/database/timestamps'
import { users } from '@api/modules/user'
import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const ticketStatus = pgEnum('status', ['open', 'pending', 'working', 'resolved', 'closed'])

export const ticketPriority = pgEnum('priority', ['low', 'medium', 'high', 'urgent'])

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

export const ticketRelations = relations(tickets, ({ one }) => ({
  creator: one(users, {
    fields: [tickets.creatorId],
    references: [users.id],
    relationName: 'creator',
  }),
  agent: one(users, {
    fields: [tickets.agentId],
    references: [users.id],
    relationName: 'agent',
  }),
}))
