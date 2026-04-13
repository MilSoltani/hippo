import type { ParsedWith } from '@api/core/query'
import { getRelationMap } from '../../relation-map'

interface RelationNode {
  columns?: Record<string, boolean>
  with?: Record<string, RelationNode>
  relations?: Record<string, RelationNode>
}

export function adaptWith(withQuery?: ParsedWith): Record<string, any> | undefined {
  const relations = withQuery?.relations

  if (!relations || Object.keys(relations).length === 0) {
    return undefined
  }

  const adapted = buildWithRelations(getRelationMap(), relations)
  return Object.keys(adapted).length > 0 ? adapted : undefined
}

function buildWithRelations(
  relationMap: Record<string, any>,
  relations: Record<string, RelationNode>,
): Record<string, RelationNode> {
  const result: Record<string, RelationNode> = {}

  for (const [name, node] of Object.entries(relations)) {
    const tableRel = relationMap[name]
    if (!tableRel)
      continue

    const columnSelection = Object.fromEntries(
      Object.keys(tableRel.essentialColumns).map(col => [col, true]),
    )

    result[name] = { columns: columnSelection }

    if (node.relations && Object.keys(node.relations).length > 0) {
      result[name].with = buildWithRelations(relationMap, node.relations)
    }
  }

  return result
}
