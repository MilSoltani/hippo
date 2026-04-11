import type { AnyPgTable } from 'drizzle-orm/pg-core'
import type { ColumnName, QueryParams, TableColumns } from './query.schema'
import { getTableColumns } from 'drizzle-orm'
import { parseColumnsParam } from './columns'
import { parseOrderParams } from './order'
import { parsePaginationParams } from './pagination'
import { parseWhereParams } from './where'
import { parseWithParam } from './with'

export function parseQuery<T extends AnyPgTable>(
  table: T,
  query: QueryParams,
  skipColumns: ColumnName<T>[] = [],
): Record<string, any> {
  const tableColumns: TableColumns = getTableColumns(table)

  const {
    sort,
    columns,
    page,
    limit,
    with: withQuery,
    ...filters
  } = query

  return {
    columns: parseColumnsParam(tableColumns, skipColumns, columns),
    where: parseWhereParams(tableColumns, filters),
    orderBy: parseOrderParams(tableColumns, sort),
    ...parsePaginationParams(page, limit),
    with: parseWithParam(withQuery),
  }
}
