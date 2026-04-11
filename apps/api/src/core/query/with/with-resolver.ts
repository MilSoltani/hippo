import { getRelationMap } from '@api/core/database/relation-map'

interface RelationNode {
  columns?: Record<string, boolean>
  relations: Record<string, RelationNode>
}

export function resolveWith(
  query?: string,
): Record<string, RelationNode> | undefined {
  if (!query)
    return

  const relationMap = getRelationMap()

  const tree: Record<string, RelationNode> = {}

  const relationPaths = query.split(',').map(p => p.trim())

  for (const relationPath of relationPaths) {
    const keys = relationPath.split('.')
    let node = tree

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const isRoot = i === 0

      // reject unknown root relations
      if (isRoot && !(key in relationMap))
        break

      // create node if missing
      if (!node[key]) {
        node[key] = { relations: {} }

        // attach default columns for this relation node
        const cols = relationMap[key as keyof typeof relationMap]?.essentialColumns
        node[key].columns = Object.fromEntries(
          Object.keys(cols).map(col => [col, true]),
        )
      }

      // move node deeper into relation tree
      if (i < keys.length - 1) {
        node = node[key].relations
      }
    }
  }

  return tree
}
