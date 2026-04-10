import type { TableColumns } from './types'
import { asc, desc } from 'drizzle-orm'

export function parseSort(
  tableColumns: TableColumns,
  sort?: string,
) {
  if (!sort)
    return undefined

  const [field, order = 'asc'] = sort.split(':')
  const column = tableColumns[field]

  if (!column)
    return undefined

  const direction
    = order.toLowerCase() === 'desc' ? desc(column) : asc(column)

  return [direction]
}
