export function parseWithParam(
  withQuery: string | undefined,
) {
  if (!withQuery)
    return undefined

  const tables: Record<string, boolean> = withQuery
    .split(',')
    .reduce((acc, tableName) => {
      acc[tableName.trim()] = true

      return acc
    }, {} as Record<string, boolean>)

  return tables
}
