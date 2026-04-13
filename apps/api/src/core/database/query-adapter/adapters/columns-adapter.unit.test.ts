import type { ParsedQuery } from '@api/core/query'
import { describe, expect, it, vi } from 'vitest'
import { adaptColumns } from './columns-adapter'

// Mock getTableColumns from drizzle-orm
vi.mock('drizzle-orm', () => ({
  getTableColumns: vi.fn(() => ({
    id: { name: 'id' },
    name: { name: 'name' },
    email: { name: 'email' },
    password: { name: 'password' },
  })),
}))

describe('adaptColumns', () => {
  it('should return all columns when no columns are specified in query', () => {
    const parsed: ParsedQuery = {
      columns: {},
      limit: 10,
      offset: 0,
    }

    const result = adaptColumns({} as any, parsed)

    expect(result).toEqual({
      id: true,
      name: true,
      email: true,
      password: true,
    })
  })

  it('should filter columns based on parsed query', () => {
    const parsed: ParsedQuery = {
      columns: { id: true, name: true },
      limit: 10,
      offset: 0,
    }

    const result = adaptColumns({} as any, parsed)

    expect(result).toEqual({
      id: true,
      name: true,
    })
  })

  it('should skip columns in skipColumns array', () => {
    const parsed: ParsedQuery = {
      columns: { id: true, name: true, email: true, password: true },
      limit: 10,
      offset: 0,
    }

    const result = adaptColumns({} as any, parsed, ['password'])

    expect(result).toEqual({
      id: true,
      name: true,
      email: true,
    })
  })

  it('should exclude non-existent columns from query', () => {
    const parsed: ParsedQuery = {
      columns: { id: true, name: true, nonexistent: true },
      limit: 10,
      offset: 0,
    }

    const result = adaptColumns({} as any, parsed)

    expect(result).toEqual({
      id: true,
      name: true,
    })
  })

  it('should handle empty skipColumns', () => {
    const parsed: ParsedQuery = {
      columns: { id: true, name: true },
      limit: 10,
      offset: 0,
    }

    const result = adaptColumns({} as any, parsed, [])

    expect(result).toEqual({
      id: true,
      name: true,
    })
  })

  it('should respect false values in column selection', () => {
    const parsed: ParsedQuery = {
      columns: { id: true, name: false, email: true },
      limit: 10,
      offset: 0,
    }

    const result = adaptColumns({} as any, parsed)

    expect(result).toEqual({
      id: true,
      name: false,
      email: true,
    })
  })
})
