import type { Column } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { adaptOrderBy } from './order-adapter'

describe('adaptOrderBy', () => {
  const mockColumns: Record<string, Column> = {
    id: { name: 'id' } as any,
    name: { name: 'name' } as any,
    createdAt: { name: 'createdAt' } as any,
  }

  it('should return undefined when sortBy is undefined', () => {
    const result = adaptOrderBy(mockColumns, undefined)
    expect(result).toBeUndefined()
  })

  it('should return undefined when sortBy is empty array', () => {
    const result = adaptOrderBy(mockColumns, [])
    expect(result).toBeUndefined()
  })

  it('should adapt ascending sort', () => {
    const result = adaptOrderBy(mockColumns, [{ field: 'name', direction: 'asc' }])

    expect(result).toBeDefined()
    expect(result?.length).toBe(1)
  })

  it('should adapt descending sort', () => {
    const result = adaptOrderBy(mockColumns, [{ field: 'name', direction: 'desc' }])

    expect(result).toBeDefined()
    expect(result?.length).toBe(1)
  })

  it('should handle multiple sort fields', () => {
    const result = adaptOrderBy(mockColumns, [
      { field: 'name', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ])

    expect(result).toBeDefined()
    expect(result?.length).toBe(2)
  })

  it('should filter out non-existent columns', () => {
    const result = adaptOrderBy(mockColumns, [
      { field: 'name', direction: 'asc' },
      { field: 'nonexistent', direction: 'desc' },
    ])

    expect(result).toBeDefined()
    expect(result?.length).toBe(1)
  })

  it('should return undefined when all columns are non-existent', () => {
    const result = adaptOrderBy(mockColumns, [
      { field: 'nonexistent1', direction: 'asc' },
      { field: 'nonexistent2', direction: 'desc' },
    ])

    expect(result).toBeUndefined()
  })

  it('should handle single sort field correctly', () => {
    const result = adaptOrderBy(mockColumns, [{ field: 'id', direction: 'asc' }])

    expect(result).toBeDefined()
    expect(result?.length).toBe(1)
  })
})
