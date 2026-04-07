import type { Column, SQL } from 'drizzle-orm'
import type { OperatorKey } from './operators'
import { BINARY_OPERATORS, OPERATORS, UNARY_OPERATORS } from './operators'
import { parseColumnValue } from './value-parser'

export function parseRHSFilters(
  column: Column,
  value?: string,
): SQL | undefined {
  if (!value)
    return

  const [maybeOp, ...rest] = value.split(':')
  const opKey = maybeOp.toLowerCase()
  const hasOp = opKey in OPERATORS

  const op = hasOp ? (opKey as OperatorKey) : 'eq'
  // If the first part was an operator, the rest is the value.
  // Otherwise, the whole string is the value (defaulting to 'eq').
  const rawValue = hasOp ? rest.join(':') : value

  // Handle Unary Operators (isNull, isNotNull)
  if (op in UNARY_OPERATORS) {
    return UNARY_OPERATORS[op as keyof typeof UNARY_OPERATORS](column)
  }

  // Handle Binary Operators - if no value is provided after the operator, ignore it
  if (!rawValue && hasOp)
    return

  const parsed = parseColumnValue(column, rawValue, op)
  const executor = BINARY_OPERATORS[op as keyof typeof BINARY_OPERATORS]

  return executor(column, parsed as any)
}
