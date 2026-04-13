import type { ParsedQuery } from '@api/core/query'
import type { AnyPgTable } from 'drizzle-orm/pg-core'
import { getTableColumns } from 'drizzle-orm'

export function adaptColumns(
  table: AnyPgTable,
  parsedQuery: ParsedQuery,
  skipColumns: string[] = [],
): Record<string, boolean> {
  const tableColumnsObj = getTableColumns(table)
  const tableColumns = Object.keys(tableColumnsObj)
  const skipColumnsSet = new Set<string>(skipColumns)

  const validatedColumns: Record<string, boolean> = {}

  if (Object.keys(parsedQuery.columns).length === 0) {
    // Include all columns except skipped ones
    for (const col of tableColumns) {
      if (!skipColumnsSet.has(col)) {
        validatedColumns[col] = true
      }
    }
  }
  else {
    // Filter requested columns against available columns
    for (const [col, value] of Object.entries(parsedQuery.columns)) {
      if (tableColumns.includes(col) && !skipColumnsSet.has(col)) {
        validatedColumns[col] = value
      }
    }
  }

  return validatedColumns
}
