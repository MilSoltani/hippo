import { describe, expect, it } from 'vitest'
import { parseQuery } from './query-parser'

describe('parseQuery', () => {
  it('should parse basic query with all parts', () => {
    const result = parseQuery({
      columns: 'id,name',
      sort: 'name:asc',
      page: '1',
      limit: '10',
      with: 'creator',
      status: 'active',
    })

    expect(result.columns).toEqual({ id: true, name: true })
    expect(result.orderBy).toEqual([{ field: 'name', direction: 'asc' }])
    expect(result.limit).toBe(10)
    expect(result.offset).toBe(0)
    expect(result.with).toEqual({ relations: { creator: { relations: {} } } })
    expect(result.where).toEqual({
      conditions: [
        {
          type: 'local',
          field: 'status',
          operator: 'eq',
          value: 'active',
        },
      ],
    })
  })

  it('should handle query with only columns', () => {
    const result = parseQuery({ columns: 'id,name' })
    expect(result.columns).toEqual({ id: true, name: true })
    expect(result.where).toBeUndefined()
    expect(result.orderBy).toBeUndefined()
  })

  it('should handle query with no optional fields', () => {
    const result = parseQuery({})
    expect(result.columns).toEqual({})
    expect(result.limit).toBe(10)
    expect(result.offset).toBe(0)
    expect(result.where).toBeUndefined()
    expect(result.orderBy).toBeUndefined()
    expect(result.with).toBeUndefined()
  })

  it('should parse query with pagination', () => {
    const result = parseQuery({ page: '2', limit: '25' })
    expect(result.limit).toBe(25)
    expect(result.offset).toBe(25)
  })

  it('should parse query with filters', () => {
    const result = parseQuery({
      'status': 'active',
      'creator.username': 'john',
    })
    expect(result.where?.conditions).toHaveLength(2)
  })

  it('should parse query with sort', () => {
    const result = parseQuery({ sort: 'name:asc,createdAt:desc' })
    expect(result.orderBy).toEqual([
      { field: 'name', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ])
  })

  it('should parse query with relations', () => {
    const result = parseQuery({ with: 'creator,tags,comments.author' })
    expect(result.with?.relations.creator).toBeDefined()
    expect(result.with?.relations.tags).toBeDefined()
    expect(result.with?.relations.comments).toBeDefined()
  })

  it('should enforce pagination limits', () => {
    const result = parseQuery({ page: '1', limit: '500' })
    expect(result.limit).toBe(100)
  })

  it('should enforce minimum page', () => {
    const result = parseQuery({ page: '-1', limit: '10' })
    expect(result.offset).toBe(0)
  })
})
