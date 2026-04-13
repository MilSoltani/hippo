import type { ParsedQuery, QueryParams } from '@api/core/query'
import type { AnyPgTable, PgTable } from 'drizzle-orm/pg-core'
import type { DbType } from '..'
import type { DrizzleQueryOptions } from './types'
import { parseQuery } from '@api/core/query'
import { getTableColumns } from 'drizzle-orm'
import { adaptColumns, adaptOrderBy, adaptWhere, adaptWith } from './adapters'

export function adaptQuery<T extends AnyPgTable>(
  db: DbType,
  table: T,
  query: QueryParams,
  skipColumns: string[] = [],
): DrizzleQueryOptions {
  return adaptQueryToDrizzle(db, table, parseQuery(query), skipColumns)
}

export function adaptQueryToDrizzle<T extends PgTable>(
  db: DbType,
  table: T,
  parsed: ParsedQuery,
  skipColumns: string[] = [],
): DrizzleQueryOptions {
  const tableCols = getTableColumns(table)

  return {
    columns: adaptColumns(table, parsed, skipColumns),
    where: adaptWhere(db, tableCols, parsed.where?.conditions ?? []),
    orderBy: adaptOrderBy(tableCols, parsed.orderBy),
    with: adaptWith(parsed.with),
    limit: parsed.limit,
    offset: parsed.offset,
  }
}
