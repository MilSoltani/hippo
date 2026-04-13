import type { ParsedSort } from '../types'

export function parseOrder(sort?: string): ParsedSort[] | undefined {
  if (!sort)
    return undefined

  const sortParts = sort.split(',')

  const directions = sortParts
    .map((part) => {
      const [field, order = 'asc'] = part.split(':')

      if (!field.trim())
        return null

      return {
        field: field.trim(),
        direction: (order.trim().toLowerCase() === 'desc' ? 'desc' : 'asc'),
      }
    })
    .filter((d): d is ParsedSort => d !== null)

  return directions.length > 0 ? directions : undefined
}
