import {
  eq,
  gt,
  gte,
  ilike,
  isNotNull,
  isNull,
  lt,
  lte,
  ne,
} from 'drizzle-orm'

export const UNARY_OPERATORS = {
  null: isNull,
  notNull: isNotNull,
} as const

export const BINARY_OPERATORS = {
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  like: ilike,
} as const

export const OPERATORS = { ...UNARY_OPERATORS, ...BINARY_OPERATORS }

export type UnaryOp = keyof typeof UNARY_OPERATORS
export type BinaryOp = keyof typeof BINARY_OPERATORS
export type OperatorKey = UnaryOp | BinaryOp
