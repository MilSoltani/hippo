import type { ParsedFilterCondition } from '@api/core/query'
import type { Column } from 'drizzle-orm'
import { describe, expect, it, vi } from 'vitest'
import { adaptWhere } from './where-adapter'

vi.mock('../../relation-map', () => ({
  getRelationMap: vi.fn(() => ({})),
}))

describe('adaptWhere', () => {
  const mockDb = {} as any

  const mockColumns: Record<string, Column> = {
    status: {
      name: 'status',
      columnType: 'string',
    } as any,
    age: {
      name: 'age',
      columnType: 'number',
    } as any,
    email: {
      name: 'email',
      columnType: 'string',
    } as any,
    createdAt: {
      name: 'createdAt',
      columnType: 'timestamp',
    } as any,
  }

  it('should return undefined when no conditions provided', () => {
    const result = adaptWhere(mockDb, mockColumns, [])

    expect(result).toBeUndefined()
  })

  it('should handle local filter with eq operator', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'status',
        operator: 'eq',
        value: 'active',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeDefined()
  })

  it('should handle local filter with ne operator', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'status',
        operator: 'ne',
        value: 'inactive',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeDefined()
  })

  it('should handle local filter with gt operator', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'age',
        operator: 'gt',
        value: '18',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeDefined()
  })

  it('should handle local filter with gte operator', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'age',
        operator: 'gte',
        value: '21',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeDefined()
  })

  it('should handle local filter with lt operator', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'age',
        operator: 'lt',
        value: '65',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeDefined()
  })

  it('should handle local filter with lte operator', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'age',
        operator: 'lte',
        value: '60',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeDefined()
  })

  it('should handle local filter with like operator', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'email',
        operator: 'like',
        value: 'example',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeDefined()
  })

  it('should handle unary operators isNull', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'email',
        operator: 'isNull',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeDefined()
  })

  it('should handle unary operators isNotNull', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'email',
        operator: 'isNotNull',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeDefined()
  })

  it('should filter out conditions with non-existent columns', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'nonexistent',
        operator: 'eq',
        value: 'test',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeUndefined()
  })

  it('should filter out binary operators without value', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'status',
        operator: 'eq',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeUndefined()
  })

  it('should handle multiple conditions', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'status',
        operator: 'eq',
        value: 'active',
      },
      {
        type: 'local',
        field: 'age',
        operator: 'gte',
        value: '18',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeDefined()
  })

  it('should parse timestamp columns correctly', () => {
    const conditions: ParsedFilterCondition[] = [
      {
        type: 'local',
        field: 'createdAt',
        operator: 'gt',
        value: '2024-01-01T00:00:00Z',
      },
    ]

    const result = adaptWhere(mockDb, mockColumns, conditions)

    expect(result).toBeDefined()
  })
})
