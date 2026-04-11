import type { PgTable } from 'drizzle-orm/pg-core'
import type { TableColumns } from '../query'
import { getTableColumns } from 'drizzle-orm'

export function getSelectedColumns(table: PgTable, selectedColumns: Array<string>): TableColumns {
  const tableColumns = getTableColumns(table)

  return Object.fromEntries(
    Object.entries(tableColumns).filter(([key]) => selectedColumns.includes(key)),
  )
}
