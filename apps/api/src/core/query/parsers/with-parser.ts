import type { ParsedWith, RelationNode } from '../query.schema'

export function parseWith(
  query?: string,
): ParsedWith | undefined {
  if (!query)
    return undefined

  const tree: Record<string, RelationNode> = {}

  const relationPaths = query.split(',').map(p => p.trim())

  for (const relationPath of relationPaths) {
    const keys = relationPath.split('.')
    let node = tree

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]

      // create node if missing
      if (!node[key]) {
        node[key] = { relations: {} }
      }

      // move node deeper into relation tree
      if (i < keys.length - 1) {
        node = node[key].relations
      }
    }
  }

  return { relations: tree }
}
