import { env } from '@api/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as tables from './tables'

const pool = new Pool({
  connectionString: env.DATABASE_URL!,
})
export function createDb(schema = tables): ReturnType<typeof drizzle<typeof tables>> {
  return drizzle<typeof schema>(pool, {
    schema,
    logger: env.NODE_ENV !== 'production',
    casing: 'snake_case',
  })
}

export type DbType = ReturnType<typeof createDb>
export const db = createDb()
