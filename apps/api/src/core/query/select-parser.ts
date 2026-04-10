import type { AnyPgTable } from 'drizzle-orm/pg-core'
import type { ColumnName, TableColumns } from './types'

export function parseSelect<T extends AnyPgTable>(
  tableColumns: TableColumns,
  skipColumns: ColumnName<T>[] = [],
  selectQuery?: string,
) {
  const skipSet = new Set<string>(skipColumns)
  const select = {} as Record<string, boolean>

  if (selectQuery) {
    selectQuery.split(',').forEach((c) => {
      const columnName = c.trim()
      if (columnName in tableColumns && !skipSet.has(columnName)) {
        select[columnName] = true
      }
    })
  }
  else {
    for (const columnName in tableColumns) {
      if (!skipSet.has(columnName)) {
        select[columnName] = true
      }
    }
  }

  return select
}
