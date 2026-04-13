import type { ParsedSort } from '@api/core/query'
import type { Column } from 'drizzle-orm'
import { asc, desc } from 'drizzle-orm'

export function adaptOrderBy(
  tableColumns: Record<string, Column>,
  sortBy?: ParsedSort[],
): Array<any> | undefined {
  if (!sortBy || sortBy.length === 0) {
    return undefined
  }

  const orderBy = sortBy
    .map((sort) => {
      const column = tableColumns[sort.field]
      if (!column)
        return null
      return sort.direction === 'desc' ? desc(column) : asc(column)
    })
    .filter((o): o is any => o !== null)

  return orderBy.length > 0 ? orderBy : undefined
}
