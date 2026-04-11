import type { TableColumns } from '../query.schema'
import { asc, desc } from 'drizzle-orm'

export function resolveOrder(
  tableColumns: TableColumns,
  sort?: string,
) {
  if (!sort)
    return undefined

  const sortParts = sort.split(',')

  const directions = sortParts
    .map((part) => {
      const [field, order = 'asc'] = part.split(':')
      const column = tableColumns[field]

      if (!column)
        return null

      return order.toLowerCase() === 'desc' ? desc(column) : asc(column)
    })
    .filter((d): d is ReturnType<typeof asc> | ReturnType<typeof desc> => d !== null)

  return directions.length > 0 ? directions : undefined
}
