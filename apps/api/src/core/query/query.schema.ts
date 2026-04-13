import { extendZodWithOpenApi, z } from '@hono/zod-openapi'

extendZodWithOpenApi(z)

const filterOperators = 'eq | ne | gt | gte | lt | lte | like | isNull | isNotNull'

export const QueryParamsSchema = z
  .object({
    columns: z.string().optional().openapi({
      description: 'Comma-separated list of fields to select. Example: id,name,email',
      example: 'id,name',
    }),
    sort: z.string().optional().openapi({
      description: 'Comma-separated sort rules in format field[:asc|desc]. Default direction is asc.',
      example: 'name:asc,createdAt:desc',
    }),
    page: z.string().optional().openapi({
      description: 'Page number for pagination. Parsed as integer and clamped to minimum 1.',
      example: '1',
    }),
    limit: z.string().optional().openapi({
      description: 'Items per page. Parsed as integer and clamped to range 1..100.',
      example: '10',
    }),
    with: z.string().optional().openapi({
      description: 'Comma-separated relations to include. Supports dot notation for nested relations.',
      example: 'creator,tags,comments.author',
    }),
  })
  .catchall(
    z.string().openapi({
      description: `Dynamic filter value. Format: [operator:]value. Supported operators: ${filterOperators}.`,
      example: 'gte:18',
    }),
  )
  .openapi('QueryParams')

export type QueryParams = z.infer<typeof QueryParamsSchema>
