import type { Column, SQL } from 'drizzle-orm'
import type { BinaryOp, OperatorKey, UnaryOp } from './operators'
import type { TableColumns } from './types'
import { and } from 'drizzle-orm'

import { BINARY_OPERATORS, OPERATORS, UNARY_OPERATORS } from './operators'

export function parseWhereParams(
  tableColumns: TableColumns,
  filters: Record<string, any>,
): SQL | undefined {
  const clauses = Object.entries(filters)
    .map(([key, value]) => {
      const column = tableColumns[key]
      const isValidValue = value !== undefined && value !== null

      if (!column || !isValidValue)
        return null

      return parseFilters(column, value)
    })
    .filter((clause): clause is SQL => clause !== null)

  return clauses.length ? and(...clauses) : undefined
}

export function parseFilters(column: Column, value?: string): SQL | undefined {
  if (!value)
    return undefined

  const { op, rawValue } = extractOperation(value)

  if (op in UNARY_OPERATORS) {
    return UNARY_OPERATORS[op as UnaryOp](column)
  }

  if (!rawValue)
    return undefined

  const parsedValue = parseColumnValue(column, rawValue, op)
  const executor = BINARY_OPERATORS[op as BinaryOp]

  return executor(column, parsedValue as any)
}

function extractOperation(value: string): { op: OperatorKey, rawValue: string } {
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

function parseColumnValue(column: Column, value: string, op: OperatorKey): string | Date {
  if (op === 'like') {
    return `%${value}%`
  }

  if (isDateColumn(column)) {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date
  }

  return value
}

function isDateColumn(column: Column): boolean {
  if (!column?.columnType)
    return false

  return (
    column.columnType.includes('Date')
    || column.columnType.includes('Timestamp')
  )
}
