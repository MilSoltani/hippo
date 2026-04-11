import type { RelationInfo } from '@api/core/query'
import { getEssentialColumns } from '@api/core/utils/db.util'
import { essentialColumns as userEssentialColumns } from '@api/modules/user/user.schema'
import { eq } from 'drizzle-orm'
import { tickets, users } from './tables'

export function getRelationMap(): Record<string, RelationInfo> {
  return {
    creator: {
      table: users,
      joinCondition: eq(users.id, tickets.creatorId),
      essentialColumns: userEssentialColumns,
    },
    agent: {
      table: users,
      joinCondition: eq(users.id, tickets.agentId),
      essentialColumns: userEssentialColumns,
    },
    createdTickets: {
      table: tickets,
      joinCondition: eq(tickets.creatorId, users.id),
      essentialColumns: getEssentialColumns(tickets, ['id', 'username']),
    },
    assignedTickets: {
      table: tickets,
      joinCondition: eq(tickets.agentId, users.id),
      essentialColumns: getEssentialColumns(tickets, ['id', 'username']),
    },
  }
}
