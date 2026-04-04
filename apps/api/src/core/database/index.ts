import * as schema from '@api/core/database/schema'
import { env } from '@api/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: env.DATABASE_URL!,
})

export const db = drizzle({ client: pool, schema })
