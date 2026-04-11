import type { Column, SQL } from 'drizzle-orm'
import type { RelationInfo } from '../query.schema'
import type { BinaryOp, UnaryOp } from './operators'
import { db } from '@api/core/database'
import { and, exists } from 'drizzle-orm'
import { BINARY_OPERATORS, UNARY_OPERATORS } from './operators'
import { extractOperation, parseColumnValue } from './value-parser'

export function parseFiltersWithRelation(
  column: Column,
  value: string,
  { table, joinCondition }: RelationInfo,
): SQL | undefined {
  if (!value)
    return undefined

  const { op, rawValue } = extractOperation(value)

  if (op in UNARY_OPERATORS) {
    return exists(
      db.select()
        .from(table as any)
        .where(and(joinCondition, UNARY_OPERATORS[op as UnaryOp](column))),
    )
  }

  if (!rawValue)
    return undefined

  const parsedValue = parseColumnValue(column, rawValue, op)
  const executor = BINARY_OPERATORS[op as BinaryOp]

  return exists(
    db.select()
      .from(table as any)
      .where(and(joinCondition, executor(column, parsedValue as any))),
  )
}

export function parseFilters(
  column: Column,
  value?: string,
): SQL | undefined {
  if (!value)
    return undefined

  const { op, rawValue } = extractOperation(value)

  if (op in UNARY_OPERATORS) {
    return UNARY_OPERATORS[op as UnaryOp](column)
  }

  if (!rawValue)
    return undefined

  const parsedValue = parseColumnValue(column, rawValue, op)
  return BINARY_OPERATORS[op as BinaryOp](column, parsedValue as any)
}
