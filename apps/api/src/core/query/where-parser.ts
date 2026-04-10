import type { SQL } from 'drizzle-orm'
import type { TableColumns } from './types'
import { and } from 'drizzle-orm'
import { parseRHSFilters } from './filter-parser'

export function parseWhere(
  tableColumns: TableColumns,
  filters: Record<string, any>,
): SQL | undefined {
  const clauses = Object.entries(filters)
    .map(([key, value]) => {
      const column = tableColumns[key]
      const isValidValue = value !== undefined && value !== null

      if (!column || !isValidValue)
        return null

      return parseRHSFilters(column, value)
    })
    .filter((clause): clause is SQL => clause !== null)

  return clauses.length ? and(...clauses) : undefined
}
