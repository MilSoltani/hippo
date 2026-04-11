import { relations } from 'drizzle-orm'
import { tickets, users } from './tables'

export const userRelations = relations(users, ({ many }) => ({
  createdTickets: many(tickets, {
    relationName: 'creator',
  }),
  assignedTickets: many(tickets, {
    relationName: 'agent',
  }),
}))

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
