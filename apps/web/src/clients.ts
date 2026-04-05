import type { UserHandler } from '@hippo/api'
import { hc } from 'hono/client'

export const userClient = hc<UserHandler>('http://localhost:3000/users')
