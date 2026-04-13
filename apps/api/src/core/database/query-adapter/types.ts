import type { Column, SQL } from 'drizzle-orm'
import type { AnyPgTable } from 'drizzle-orm/pg-core'

export type TableColumns = Record<string, Column>

export interface RelationInfo {
  table: AnyPgTable
  joinCondition: SQL
  essentialColumns: TableColumns
}
