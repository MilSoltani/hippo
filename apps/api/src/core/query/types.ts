import type { getTableColumns } from 'drizzle-orm'
import type { AnyPgTable } from 'drizzle-orm/pg-core'

export type ColumnName<T extends AnyPgTable> = keyof T['_']['columns'] & string
export type TableColumns = ReturnType<typeof getTableColumns>
