import type { AnyPgTable } from 'drizzle-orm/pg-core'
import type { QueryParams } from './query.schema'
import type { ColumnName, TableColumns } from './types'
import { getTableColumns } from 'drizzle-orm'
import { parseOrderParams } from './order'
import { parsePaginationParams } from './pagination'
import { parseSelectParam } from './select'
import { parseWhereParams } from './where'

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
    select: parseSelectParam(tableColumns, skipColumns, selectCols),
    where: parseWhereParams(tableColumns, filters),
    orderBy: parseOrderParams(tableColumns, sort),
    ...parsePaginationParams(page, queryLimit),
  }
}
