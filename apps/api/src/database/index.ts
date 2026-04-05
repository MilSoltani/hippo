import * as tables from '@api/database/tables'
import { env } from '@api/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: env.DATABASE_URL!,
})

export function createDb(schema = tables) {
  return drizzle<typeof schema>({ client: pool, schema })
}

export * as tables from './tables'
export type DbType = ReturnType<typeof createDb>
export const db = createDb()
