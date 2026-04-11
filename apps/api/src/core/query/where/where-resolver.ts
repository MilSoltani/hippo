import type { DbType } from '@api/core/database'
import type { Column, SQL } from 'drizzle-orm'

import type { TableColumns } from '../query.schema'
import { getRelationMap } from '@api/core/database/relation-map'
import { and, getTableColumns } from 'drizzle-orm'
import { parseFilters, parseFiltersWithRelation } from './filter-parser'

export function resolveWhere(
  db: DbType,
  tableColumns: TableColumns,
  filters: Record<string, any>,
): SQL | undefined {
  const clauses = Object.entries(filters)
    .map(([key, value]) => {
      const isValidValue = value !== undefined && value !== null
      if (!isValidValue)
        return null

      const relationMap = getRelationMap()

      const parts = key.split('.')

      if (parts.length > 1) {
        const relation = parts[0]
        const column = parts[1]

        const relationInfo = relationMap[relation]

        if (!relationInfo)
          return null

        const relColumn = getTableColumns(relationInfo.table as any)[column] as Column | undefined
        if (!relColumn)
          return null

        return parseFiltersWithRelation(db, relColumn, value, relationInfo)
      }

      const tableColumn = tableColumns[parts[0]]
      if (!tableColumn)
        return null

      return parseFilters(tableColumn, value)
    })
    .filter((clause): clause is SQL => clause !== null)

  return clauses.length ? and(...clauses) : undefined
}
