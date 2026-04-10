import type { Column, SQL } from 'drizzle-orm'
import type { BinaryOp, OperatorKey, UnaryOp } from './operators'
import { BINARY_OPERATORS, OPERATORS, UNARY_OPERATORS } from './operators'
import { parseColumnValue } from './value-parser'

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

export function parseRHSFilters(column: Column, value?: string): SQL | undefined {
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
