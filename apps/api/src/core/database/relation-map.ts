import type { RelationInfo } from '@api/core/query'
import { ticketEssentialColumns } from '@api/modules/ticket/ticket.schema'
import { userEssentialColumns } from '@api/modules/user/user.schema'
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
      essentialColumns: ticketEssentialColumns,
    },
    assignedTickets: {
      table: tickets,
      joinCondition: eq(tickets.agentId, users.id),
      essentialColumns: ticketEssentialColumns,
    },
  }
}
