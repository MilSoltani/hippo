import type { Column, SQL } from 'drizzle-orm'
import type { RelationInfo, TableColumns } from '../query.schema'
import type { BinaryOp, OperatorKey, UnaryOp } from './operators'

import { db } from '@api/core/database'
import { getRelationMap } from '@api/core/database/relation-map'
import { and, exists, getTableColumns } from 'drizzle-orm'
import { BINARY_OPERATORS, OPERATORS, UNARY_OPERATORS } from './operators'

export function parseWhereParams(
  tableColumns: TableColumns,
  filters: Record<string, any>,
): SQL | undefined {
  const clauses = Object.entries(filters)
    .map(([key, value]) => {
      const isValidValue = value !== undefined && value !== null
      if (!isValidValue)
        return null

      const relationMap = getRelationMap()

      const parts = key.split('.')

      if (parts.length > 1) {
        const relation = parts[0]
        const column = parts[1]

        const relationInfo = relationMap[relation]

        if (!relationInfo)
          return null

        const relColumn = getTableColumns(relationInfo.table as any)[column] as Column | undefined
        if (!relColumn)
          return null

        return parseFiltersWithRelation(relColumn, value, relationInfo)
      }

      const tableColumn = tableColumns[parts[0]]
      if (!tableColumn)
        return null

      return parseFilters(tableColumn, value)
    })
    .filter((clause): clause is SQL => clause !== null)

  return clauses.length ? and(...clauses) : undefined
}

function parseFiltersWithRelation(
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
