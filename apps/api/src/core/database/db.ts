import { env } from '@api/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as relations from './relations'
import * as tables from './tables'

const pool = new Pool({
  connectionString: env.DATABASE_URL!,
})

const schema = { ...tables, ...relations }

export function createDb(): ReturnType<typeof drizzle<typeof schema>> {
  return drizzle<typeof schema>(pool, {
    schema,
    logger: env.NODE_ENV !== 'production',
    casing: 'snake_case',
  })
}

export type DbType = ReturnType<typeof createDb>
