export type ParsedColumns = Record<string, boolean>

export interface ParsedSort {
  field: string
  direction: 'asc' | 'desc'
}

export interface ParsedPagination {
  limit: number
  offset: number
}

export interface ParsedFilterCondition {
  type: 'local' | 'relation'
  field: string
  relationName?: string
  relatedField?: string
  operator: OperatorKey
  value?: string
}

export interface ParsedFilters {
  conditions: ParsedFilterCondition[]
}

export interface RelationNode {
  columns?: Record<string, boolean>
  relations: Record<string, RelationNode>
}

export interface ParsedWith {
  relations: Record<string, RelationNode>
}

export interface ParsedQuery {
  columns: ParsedColumns
  where?: ParsedFilters
  orderBy?: ParsedSort[]
  limit: number
  offset: number
  with?: ParsedWith
}

export const UNARY_OPERATORS = ['isNull', 'isNotNull'] as const
export const BINARY_OPERATORS = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like'] as const
export const OPERATORS = [...UNARY_OPERATORS, ...BINARY_OPERATORS] as const

export type UnaryOp = (typeof UNARY_OPERATORS)[number]
export type BinaryOp = (typeof BINARY_OPERATORS)[number]
export type OperatorKey = UnaryOp | BinaryOp
