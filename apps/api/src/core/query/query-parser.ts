import type { ParsedQuery, QueryParams } from './query.schema'
import { parseColumns } from './parsers/columns-parser'
import { parseOrder } from './parsers/order-parser'
import { parsePagination } from './parsers/pagination-parser'
import { parseWhere } from './parsers/where-parser'
import { parseWith } from './parsers/with-parser'

export function parseQuery(query: QueryParams): ParsedQuery {
  const {
    sort,
    columns,
    page,
    limit,
    with: withQuery,
    ...filters
  } = query

  const result: ParsedQuery = {
    columns: parseColumns(columns),
    limit: 0,
    offset: 0,
  }

  const where = parseWhere(filters)
  if (where) {
    result.where = where
  }

  const orderBy = parseOrder(sort)
  if (orderBy) {
    result.orderBy = orderBy
  }

  const pagination = parsePagination(page, limit)
  result.limit = pagination.limit
  result.offset = pagination.offset

  const withResult = parseWith(withQuery)
  if (withResult) {
    result.with = withResult
  }

  return result
}
