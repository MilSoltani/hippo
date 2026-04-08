import type { Column } from 'drizzle-orm'
import type { OperatorKey } from './operators'

function isDateColumn(column: Column): boolean {
  if (!column?.columnType)
    return false

  return (
    column.columnType.includes('Date')
    || column.columnType.includes('Timestamp')
  )
}

export function parseColumnValue(column: Column, value: string, op: OperatorKey): string | Date {
  if (op === 'like') {
    return `%${value}%`
  }

  if (isDateColumn(column)) {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date
  }

  return value
}
