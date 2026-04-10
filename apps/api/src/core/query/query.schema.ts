import type { getTableColumns } from 'drizzle-orm'

import type { AnyPgTable } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const QueryParamsSchema = z
  .object({
    columns: z.string().optional(),
    sort: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    with: z.string().optional(),
  })
  .catchall(z.any())

export type QueryParams = z.infer<typeof QueryParamsSchema>

export type ColumnName<T extends AnyPgTable> = keyof T['_']['columns'] & string
export type TableColumns = ReturnType<typeof getTableColumns>
