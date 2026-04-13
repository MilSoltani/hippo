import type { OperatorKey, ParsedFilterCondition, ParsedFilters } from '../types'
import { BINARY_OPERATORS, UNARY_OPERATORS } from '../types'

export function parseWhere(
  filters: Record<string, any>,
): ParsedFilters | undefined {
  const conditions = Object.entries(filters)
    .flatMap(([key, value]) => {
      if (value === undefined || value === null)
        return []

      const [part1, part2] = key.split('.')

      // Relation Filter (e.g., "creator.username")
      if (part2) {
        const condition = parseConditionInfo(part2, value, 'relation')

        return condition
          ? [{
              ...condition,
              relationName: part1,
              relatedField: part2,
            } as ParsedFilterCondition]
          : []
      }

      // Local Table Filter (e.g., "status")
      const condition = parseConditionInfo(part1, value, 'local')
      return condition ? [condition] : []
    })

  return conditions.length > 0 ? { conditions } : undefined
}

function parseConditionInfo(
  field: string,
  value: string,
  type: 'local' | 'relation',
): Omit<ParsedFilterCondition, 'relationName' | 'relatedField'> | null {
  if (!value)
    return null

  const { op, rawValue } = extractOperation(value)

  return {
    type,
    field,
    operator: op,
    value: rawValue || undefined,
  }
}

function extractOperation(value: string): { op: OperatorKey, rawValue: string } {
  const separatorIndex = value.indexOf(':')
  const potentialOp = separatorIndex !== -1 ? value.slice(0, separatorIndex) : value
  const potentialOpLower = potentialOp.toLowerCase()

  const allOperators = [...UNARY_OPERATORS, ...BINARY_OPERATORS]
  const matchedOp = allOperators.find(op => op.toLowerCase() === potentialOpLower)

  if (matchedOp) {
    const rawValue = separatorIndex !== -1 ? value.slice(separatorIndex + 1) : ''
    return { op: matchedOp, rawValue }
  }

  return { op: 'eq', rawValue: value }
}
