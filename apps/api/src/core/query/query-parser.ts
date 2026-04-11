import type { AnyPgTable } from 'drizzle-orm/pg-core'
import type { ColumnName, QueryParams, TableColumns } from './query.schema'
import { getTableColumns } from 'drizzle-orm'
import { resolveOrder } from './order/order-resolver'
import { resolvePagination } from './pagination/pagination-resolver'
import { resolveColumns } from './select/columns-resolver'
import { resolveWhere } from './where'
import { resolveWith } from './with/with-resolver'

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
    columns: resolveColumns(tableColumns, skipColumns, columns),
    where: resolveWhere(tableColumns, filters),
    orderBy: resolveOrder(tableColumns, sort),
    ...resolvePagination(page, limit),
    with: resolveWith(withQuery),
  }
}
