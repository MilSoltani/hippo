import type { Column } from 'drizzle-orm'
import type { OperatorKey } from './operators'
import { OPERATORS } from './operators'

export function extractOperation(value: string): { op: OperatorKey, rawValue: string } {
  const [maybeOp, ...rest] = value.split(':')
  const opKey = maybeOp.toLowerCase()

  if (opKey in OPERATORS) {
    return {
      op: opKey as OperatorKey,
      rawValue: rest.join(':'),
    }
  }

  return { op: 'eq', rawValue: value }
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

export function isDateColumn(column: Column): boolean {
  if (!column?.columnType)
    return false

  return (
    column.columnType.includes('Date')
    || column.columnType.includes('Timestamp')
  )
}
