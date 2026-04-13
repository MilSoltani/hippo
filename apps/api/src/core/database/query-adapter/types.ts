import type { Column, SQL } from 'drizzle-orm'
import type { AnyPgTable } from 'drizzle-orm/pg-core'

export type TableColumns = Record<string, Column>

export interface TableRelation {
  table: AnyPgTable
  joinCondition: SQL
  essentialColumns: TableColumns
}

export interface DrizzleQueryOptions {
  columns: Record<string, boolean>
  where?: SQL
  orderBy?: Array<any>
  limit: number
  offset: number
  with?: Record<string, any>
}
