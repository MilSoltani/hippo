import type { AnyPgTable } from 'drizzle-orm/pg-core'
import type { QueryParams } from './query.schema'
import type { ColumnName, TableColumns } from './types'
import { getTableColumns } from 'drizzle-orm'
import { parsePagination } from './pagination-parser'
import { parseSelect } from './select-parser'
import { parseSort } from './sort-parser'
import { parseWhere } from './where-parser'

export function parseQuery<T extends AnyPgTable>(
  table: T,
  query: QueryParams,
  skipColumns: ColumnName<T>[] = [],
) {
  const tableColumns: TableColumns = getTableColumns(table)
  const {
    sort,
    select: selectCols,
    page,
    limit: queryLimit,
    ...filters
  } = query

  return {
    select: parseSelect(tableColumns, skipColumns, selectCols),
    where: parseWhere(tableColumns, filters),
    orderBy: parseSort(tableColumns, sort),
    ...parsePagination(page, queryLimit),
  }
}
