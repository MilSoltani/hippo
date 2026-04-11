import type { AnyPgTable } from 'drizzle-orm/pg-core'
import type { DbType } from '../database'
import type { ColumnName, QueryParams, TableColumns } from './query.schema'
import { getTableColumns } from 'drizzle-orm'
import { resolveOrder } from './order/order-resolver'
import { resolvePagination } from './pagination/pagination-resolver'
import { resolveColumns } from './select/columns-resolver'
import { resolveWhere } from './where'
import { resolveWith } from './with/with-resolver'

export function parseQuery<T extends AnyPgTable>(
  db: DbType,
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
    where: resolveWhere(db, tableColumns, filters),
    orderBy: resolveOrder(tableColumns, sort),
    ...resolvePagination(page, limit),
    with: resolveWith(withQuery),
  }
}
