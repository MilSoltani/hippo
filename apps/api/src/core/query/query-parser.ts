import type { AnyPgTable } from 'drizzle-orm/pg-core'
import type { ColumnName, QueryParams, TableColumns } from './query.schema'
import { getTableColumns } from 'drizzle-orm'
import { parseOrderParams } from './order/order'
import { parsePaginationParams } from './pagination/pagination'
import { parseColumnsParam } from './select/columns'
import { resolveWhere } from './where'
import { parseWithParam } from './with/with'

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
    where: resolveWhere(tableColumns, filters),
    orderBy: parseOrderParams(tableColumns, sort),
    ...parsePaginationParams(page, limit),
    with: parseWithParam(withQuery),
  }
}
