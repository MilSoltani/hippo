import type { AnyPgTable } from 'drizzle-orm/pg-core'
import type { QueryParams } from './query.schema'
import type { ColumnName, TableColumns } from './types'
import { getTableColumns } from 'drizzle-orm'
import { parseColumnsParam } from './columns'
import { parseOrderParams } from './order'
import { parsePaginationParams } from './pagination'
import { parseWhereParams } from './where'

export function parseQuery<T extends AnyPgTable>(
  table: T,
  query: QueryParams,
  skipColumns: ColumnName<T>[] = [],
) {
  const tableColumns: TableColumns = getTableColumns(table)
  const {
    sort,
    select,
    page,
    limit: queryLimit,
    ...filters
  } = query

  return {
    columns: parseColumnsParam(tableColumns, skipColumns, select),
    where: parseWhereParams(tableColumns, filters),
    orderBy: parseOrderParams(tableColumns, sort),
    ...parsePaginationParams(page, queryLimit),
  }
}
