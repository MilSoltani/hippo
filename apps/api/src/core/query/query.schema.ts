import { z } from 'zod'

export const QueryParamsSchema = z
  .object({
    select: z.string().optional(),
    sort: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  })
  .catchall(z.any())

export type QueryParams = z.infer<typeof QueryParamsSchema>
