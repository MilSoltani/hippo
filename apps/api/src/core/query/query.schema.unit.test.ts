import { describe, expect, it } from 'vitest'
import { QueryParamsSchema } from './query.schema'

describe('queryParamsSchema', () => {
  it('should validate valid query params', () => {
    const query = {
      columns: 'id,name',
      sort: 'name:asc',
      page: '1',
      limit: '10',
      with: 'creator,tags',
    }
    const result = QueryParamsSchema.parse(query)
    expect(result).toEqual(query)
  })

  it('should allow optional fields', () => {
    const query = { columns: 'id,name' }
    const result = QueryParamsSchema.parse(query)
    expect(result).toEqual(query)
  })

  it('should allow any additional filter fields via catchall', () => {
    const query = {
      'columns': 'id,name',
      'status': 'active',
      'creator.username': 'john',
    }
    const result = QueryParamsSchema.parse(query)
    expect(result.status).toBe('active')
    expect(result['creator.username']).toBe('john')
  })

  it('should handle empty object', () => {
    const query = {}
    const result = QueryParamsSchema.parse(query)
    expect(result).toEqual({})
  })

  it('should reject non-string dynamic filter values', () => {
    const query = {
      status: ['active'],
    }

    expect(() => QueryParamsSchema.parse(query)).toThrow()
  })
})
