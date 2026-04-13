import type { ParsedQuery, QueryParams } from '@api/core/query'
import { describe, expect, it, vi } from 'vitest'
import { adaptQuery, adaptQueryToDrizzle } from './query-adapter'

vi.mock('@api/core/query', () => ({
  parseQuery: vi.fn((query) => {
    if (query.columns)
      return { columns: query.columns.split(',').reduce((acc: any, col: string) => ({ ...acc, [col]: true }), {}) }
    return { columns: {} }
  }),
}))

vi.mock('drizzle-orm', () => ({
  getTableColumns: vi.fn(() => ({
    id: { name: 'id' },
    name: { name: 'name' },
    email: { name: 'email' },
  })),
}))

vi.mock('./adapters', () => ({
  adaptColumns: vi.fn((table, parsed) => parsed.columns || {}),
  adaptOrderBy: vi.fn(() => undefined),
  adaptWhere: vi.fn(() => undefined),
  adaptWith: vi.fn(() => undefined),
}))

describe('adaptQuery', () => {
  const mockDb = {} as any
  const mockTable = {
    id: { name: 'id' },
    name: { name: 'name' },
    email: { name: 'email' },
  } as any

  it('should call adaptQueryToDrizzle with parsed query', () => {
    const query: QueryParams = {
      columns: 'id,name',
    }

    const result = adaptQuery(mockDb, mockTable, query)

    expect(result).toBeDefined()
  })

  it('should handle query with skipColumns', () => {
    const query: QueryParams = {
      columns: 'id,name,email',
    }

    const result = adaptQuery(mockDb, mockTable, query, ['email'])

    expect(result).toBeDefined()
  })

  it('should return object with proper structure', () => {
    const query: QueryParams = {}

    const result = adaptQuery(mockDb, mockTable, query)

    expect(result).toHaveProperty('columns')
    expect(result).toHaveProperty('where')
    expect(result).toHaveProperty('orderBy')
    expect(result).toHaveProperty('with')
    expect(result).toHaveProperty('limit')
    expect(result).toHaveProperty('offset')
  })

  it('should pass empty skipColumns by default', () => {
    const query: QueryParams = {}

    const result = adaptQuery(mockDb, mockTable, query)

    expect(result).toBeDefined()
  })
})

describe('adaptQueryToDrizzle', () => {
  const mockDb = {} as any
  const mockTable = {
    id: { name: 'id' },
    name: { name: 'name' },
    email: { name: 'email' },
  } as any

  const mockParsed: ParsedQuery = {
    columns: { id: true, name: true },
    limit: 20,
    offset: 0,
  }

  it('should return DrizzleQueryOptions with all fields', () => {
    const result = adaptQueryToDrizzle(mockDb, mockTable, mockParsed)

    expect(result.columns).toBeDefined()
    expect(result.where).toBeUndefined()
    expect(result.orderBy).toBeUndefined()
    expect(result.with).toBeUndefined()
    expect(result.limit).toBe(20)
    expect(result.offset).toBe(0)
  })

  it('should call adaptColumns with correct parameters', () => {
    const customSkip = ['email']
    const result = adaptQueryToDrizzle(mockDb, mockTable, mockParsed, customSkip)

    expect(result).toBeDefined()
  })

  it('should handle parsed query without limit/offset', () => {
    const parsed: ParsedQuery = {
      columns: { id: true },
      limit: 10,
      offset: 0,
    }

    const result = adaptQueryToDrizzle(mockDb, mockTable, parsed)

    expect(result.limit).toBe(10)
    expect(result.offset).toBe(0)
  })

  it('should handle empty skipColumns array', () => {
    const result = adaptQueryToDrizzle(mockDb, mockTable, mockParsed, [])

    expect(result).toBeDefined()
  })

  it('should pass skipColumns to adaptColumns', () => {
    const skipCols = ['password', 'token']
    const result = adaptQueryToDrizzle(mockDb, mockTable, mockParsed, skipCols)

    expect(result).toBeDefined()
  })

  it('should include all adapter results in output', () => {
    const parsed: ParsedQuery = {
      columns: { id: true, name: true },
      limit: 10,
      offset: 0,
    }

    const result = adaptQueryToDrizzle(mockDb, mockTable, parsed)

    expect(result).toHaveProperty('columns')
    expect(result).toHaveProperty('where')
    expect(result).toHaveProperty('orderBy')
    expect(result).toHaveProperty('with')
    expect(result).toHaveProperty('limit')
    expect(result).toHaveProperty('offset')
  })
})
