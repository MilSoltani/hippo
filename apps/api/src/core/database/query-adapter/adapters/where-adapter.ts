import type { BinaryOp, ParsedFilterCondition, UnaryOp } from '@api/core/query'
import type { Column, SQL } from 'drizzle-orm'
import type { DbType } from '../../db'
import { and, eq, exists, getTableColumns, gt, gte, ilike, isNotNull, isNull, lt, lte, ne } from 'drizzle-orm'
import { getRelationMap } from '../../relation-map'

const OPS = {
  unary: { isNull, isNotNull },
  binary: { eq, ne, gt, gte, lt, lte, like: ilike },
}

export function adaptWhere(db: DbType, tableColumns: Record<string, Column>, conditions: ParsedFilterCondition[]): SQL | undefined {
  const relMap = getRelationMap()

  const sqlConditions = conditions.map(({ type, field, relationName, relatedField, operator, value }) => {
    // 1. Local Filter
    if (type === 'local') {
      return conditionToSQL(tableColumns[field], operator, value)
    }

    // 2. Relation Filter
    const rel = relationName ? relMap[relationName] : null
    if (!rel || !relatedField)
      return null

    const relCol = getTableColumns(rel.table as any)[relatedField]
    const subClause = conditionToSQL(relCol, operator, value)

    return subClause
      ? exists(db.select().from(rel.table as any).where(and(rel.joinCondition, subClause)))
      : null
  }).filter((c): c is SQL => !!c)

  return sqlConditions.length ? and(...sqlConditions) : undefined
}

function conditionToSQL(col: Column | undefined, op: string, val?: string): SQL | null {
  if (!col)
    return null

  if (op in OPS.unary)
    return OPS.unary[op as UnaryOp](col)
  if (val === undefined || !(op in OPS.binary))
    return null

  const parsed = op === 'like' ? `%${val}%` : parseValue(col, val)
  return OPS.binary[op as BinaryOp](col, parsed as any)
}

function parseValue(col: Column, val: string): string | Date {
  const t = col.columnType
  if (t?.includes('Date') || t?.includes('Timestamp')) {
    const d = new Date(val)
    return Number.isNaN(d.getTime()) ? val : d
  }
  return val
}
