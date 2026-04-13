import type { ParsedColumns } from '../types'

export function parseColumns(selectQuery?: string): ParsedColumns {
  const columns: ParsedColumns = {}

  if (selectQuery) {
    selectQuery.split(',').forEach((c) => {
      const columnName = c.trim()
      if (columnName) {
        columns[columnName] = true
      }
    })
  }

  return columns
}
