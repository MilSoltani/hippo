import type { Column, SQL } from 'drizzle-orm'
import type { AnyPgColumn, PgTable } from 'drizzle-orm/pg-core'
import type { QueryParams } from './query.schema'
import { publicUserColumns } from '@api/modules/user/users.schema'
import { and, asc, desc } from 'drizzle-orm'
import { parseRHSFilters } from './filter-parser'

export function parseQueryParams<T extends PgTable>(
  table: T,
  query: QueryParams,
) {
  const { sort, select: selectCols, page, limit: queryLimit, ...filters } = query
  return {
    select: getSelectedColumns(table, selectCols),
    where: getWhereClauses(publicUserColumns, filters),
    orderBy: getOrderBy(publicUserColumns, sort),
    ...getPagination(page, queryLimit),
  }
}

function getSelectedColumns(table: any, selectQuery?: string) {
  if (!selectQuery)
    return undefined

  const selected = selectQuery
    .split(',')
    .map(c => c.trim())
    .reduce((acc, key) => {
      if (key in table)
        acc[key] = table[key]
      return acc
    }, {} as Record<string, AnyPgColumn>)

  return Object.keys(selected).length > 0 ? selected : undefined
}

function getWhereClauses(columns: Record<string, Column>, filters: Record<string, any>) {
  const clauses = Object.entries(filters)
    .map(([key, value]) => (columns[key] && value ? parseRHSFilters(columns[key], value) : null))
    .filter((c): c is SQL => !!c)

  return clauses.length ? and(...clauses) : undefined
}

function getOrderBy(columns: Record<string, Column>, sort?: string) {
  if (!sort)
    return undefined

  const [field, order = 'asc'] = sort.split(':')
  const column = columns[field]

  if (!column)
    return undefined

  return order.toLowerCase() === 'desc' ? desc(column) : asc(column)
}

function getPagination(page?: string, limit?: string) {
  const p = Math.max(1, Number.parseInt(page || '1') || 1)
  const l = Math.min(100, Math.max(1, Number.parseInt(limit || '10') || 10))

  return { limit: l, offset: (p - 1) * l }
}
