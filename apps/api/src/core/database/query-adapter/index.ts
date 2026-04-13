import type { BinaryOp, ParsedFilterCondition, ParsedQuery, ParsedSort, QueryParams, UnaryOp } from '@api/core/query'
import type { Column, SQL } from 'drizzle-orm'
import type { AnyPgTable, PgTable } from 'drizzle-orm/pg-core'
import type { DbType } from '..'
import { parseQuery } from '@api/core/query'
import { and, asc, desc, eq, exists, getTableColumns, gt, gte, ilike, isNotNull, isNull, lt, lte, ne } from 'drizzle-orm'
import { getRelationMap } from '../relation-map'

export interface DrizzleQueryOptions {
  columns: Record<string, boolean>
  where?: SQL
  orderBy?: Array<any>
  limit: number
  offset: number
  with?: Record<string, any>
}

export function queryAdapter<T extends AnyPgTable>(
  db: DbType,
  table: T,
  query: QueryParams,
  skipColumns: string[] = [],
): DrizzleQueryOptions {
  const tableColumnsObj = getTableColumns(table)
  const tableColumns = Object.keys(tableColumnsObj)
  const skipColumnsSet = new Set<string>(skipColumns as string[])

  const parsedQuery = parseQuery(query)

  // Validate and filter against available columns
  const validatedParsedQuery: ParsedQuery = {
    columns: {},
    limit: parsedQuery.limit,
    offset: parsedQuery.offset,
  }

  if (Object.keys(parsedQuery.columns).length === 0) {
    for (const col of tableColumns) {
      if (!skipColumnsSet.has(col)) {
        validatedParsedQuery.columns[col] = true
      }
    }
  }
  else {
    for (const [col, value] of Object.entries(parsedQuery.columns)) {
      if (tableColumns.includes(col) && !skipColumnsSet.has(col)) {
        validatedParsedQuery.columns[col] = value as boolean
      }
    }
  }

  // Validate where conditions
  if (parsedQuery.where) {
    const validatedConditions = parsedQuery.where.conditions.filter((condition: ParsedFilterCondition) => {
      if (condition.type === 'local') {
        return tableColumns.includes(condition.field)
      }
      if (condition.type === 'relation') {
        return true
      }
      return false
    })

    if (validatedConditions.length > 0) {
      validatedParsedQuery.where = { conditions: validatedConditions }
    }
  }

  // Validate order fields
  if (parsedQuery.orderBy) {
    const validatedOrderBy = parsedQuery.orderBy.filter((sort: ParsedSort) =>
      tableColumns.includes(sort.field),
    )

    if (validatedOrderBy.length > 0) {
      validatedParsedQuery.orderBy = validatedOrderBy
    }
  }

  if (parsedQuery.with) {
    validatedParsedQuery.with = parsedQuery.with
  }

  return adaptQueryToDrizzle(db, table, validatedParsedQuery)
}

export function adaptQueryToDrizzle<T extends PgTable>(
  db: DbType,
  table: T,
  parsedQuery: ParsedQuery,
): DrizzleQueryOptions {
  const tableColumns = getTableColumns(table)

  const result: DrizzleQueryOptions = {
    columns: parsedQuery.columns,
    limit: parsedQuery.limit,
    offset: parsedQuery.offset,
  }

  if (parsedQuery.where) {
    result.where = adaptWhereConditions(db, tableColumns, parsedQuery.where.conditions)
  }

  if (parsedQuery.orderBy) {
    result.orderBy = parsedQuery.orderBy.map((sort) => {
      const column = tableColumns[sort.field]
      if (!column)
        return null
      return sort.direction === 'desc' ? desc(column) : asc(column)
    }).filter((o): o is any => o !== null)
  }

  if (parsedQuery.with && Object.keys(parsedQuery.with.relations).length > 0) {
    const relationMap = getRelationMap()
    result.with = adaptRelationsToWith(relationMap, parsedQuery.with.relations)
  }

  return result
}

function adaptWhereConditions(
  db: DbType,
  tableColumns: Record<string, Column>,
  conditions: ParsedFilterCondition[],
): any {
  const relationMap = getRelationMap()
  const sqlConditions = conditions.map((condition) => {
    if (condition.type === 'local') {
      const column = tableColumns[condition.field]
      if (!column)
        return null
      return adaptConditionToSQL(column, condition.operator, condition.value)
    }

    // Relation filter
    const relationName = condition.relationName
    const relatedField = condition.relatedField
    if (!relationName || !relatedField)
      return null

    const relationInfo = relationMap[relationName]
    if (!relationInfo)
      return null

    const relColumns = getTableColumns(relationInfo.table as any)
    const relColumn = relColumns[relatedField]
    if (!relColumn)
      return null

    const condition_ = adaptConditionToSQL(relColumn, condition.operator, condition.value)
    return exists(
      db.select()
        .from(relationInfo.table as any)
        .where(and(relationInfo.joinCondition, condition_)),
    )
  }).filter((c): c is any => c !== null)

  return sqlConditions.length > 0 ? and(...sqlConditions) : undefined
}

function adaptConditionToSQL(
  column: Column,
  operator: string,
  value?: string,
): any {
  const UNARY_OPERATORS_MAP = { isNull, isNotNull }
  const BINARY_OPERATORS_MAP = { eq, ne, gt, gte, lt, lte, like: ilike }

  if (operator === 'isNull' || operator === 'isNotNull') {
    return UNARY_OPERATORS_MAP[operator as UnaryOp](column)
  }

  if (!value)
    return null

  const parsedValue = parseColumnValue(column, value, operator)
  const executor = BINARY_OPERATORS_MAP[operator as BinaryOp]
  return executor(column, parsedValue as any)
}

function parseColumnValue(column: Column, value: string, operator: string): string | Date {
  if (operator === 'like')
    return `%${value}%`

  if (isDateColumn(column)) {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date
  }

  return value
}

function isDateColumn(column: Column): boolean {
  const type = column?.columnType
  return !!type && (type.includes('Date') || type.includes('Timestamp'))
}

interface RelationNode {
  columns?: Record<string, boolean>
  relations?: Record<string, RelationNode>
  with?: Record<string, RelationNode>
}

function adaptRelationsToWith(
  relationMap: Record<string, any>,
  relations: Record<string, RelationNode>,
): Record<string, RelationNode> {
  const result: Record<string, RelationNode> = {}

  for (const [relationName, node] of Object.entries(relations)) {
    const relationInfo = relationMap[relationName]
    if (!relationInfo)
      continue

    const columnSelection: Record<string, boolean> = {}
    for (const columnName of Object.keys(relationInfo.essentialColumns)) {
      columnSelection[columnName] = true
    }

    result[relationName] = {
      columns: columnSelection,
    }

    if (node.relations && Object.keys(node.relations).length > 0) {
      result[relationName].with = adaptRelationsToWith(relationMap, node.relations)
    }
  }

  return result
}
