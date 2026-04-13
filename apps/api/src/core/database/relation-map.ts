import type { TableRelation } from './query-adapter/types'
import { eq } from 'drizzle-orm'
import { getSelectedColumns } from '../utils/db.util'
import { tickets, users } from './tables'

export function getRelationMap(): Record<string, TableRelation> {
  return {
    creator: {
      table: users,
      joinCondition: eq(users.id, tickets.creatorId),
      essentialColumns: getSelectedColumns(users, ['id', 'username']),
    },
    agent: {
      table: users,
      joinCondition: eq(users.id, tickets.agentId),
      essentialColumns: getSelectedColumns(users, ['id', 'username']),
    },
    createdTickets: {
      table: tickets,
      joinCondition: eq(tickets.creatorId, users.id),
      essentialColumns: getSelectedColumns(tickets, ['id', 'subject']),
    },
    assignedTickets: {
      table: tickets,
      joinCondition: eq(tickets.agentId, users.id),
      essentialColumns: getSelectedColumns(tickets, ['id', 'subject']),
    },
  }
}
