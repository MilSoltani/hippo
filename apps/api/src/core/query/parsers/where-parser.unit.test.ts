import { describe, expect, it } from 'vitest'
import { parseWhere } from './where-parser'

describe('parseWhere', () => {
  it('should parse local simple equality filter', () => {
    const result = parseWhere({ status: 'active' })
    expect(result).toEqual({
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

  it('should parse local filter with operator', () => {
    const result = parseWhere({ age: 'gte:18' })
    expect(result).toEqual({
      conditions: [
        {
          type: 'local',
          field: 'age',
          operator: 'gte',
          value: '18',
        },
      ],
    })
  })

  it('should parse relation filter', () => {
    const result = parseWhere({ 'creator.username': 'john' })
    expect(result).toEqual({
      conditions: [
        {
          type: 'relation',
          field: 'username',
          relationName: 'creator',
          relatedField: 'username',
          operator: 'eq',
          value: 'john',
        },
      ],
    })
  })

  it('should parse unary operators', () => {
    const result = parseWhere({ deletedAt: 'isNull' })
    expect(result).toEqual({
      conditions: [
        {
          type: 'local',
          field: 'deletedAt',
          operator: 'isNull',
          value: undefined,
        },
      ],
    })
  })

  it('should return undefined when no filters', () => {
    const result = parseWhere({})
    expect(result).toBeUndefined()
  })

  it('should skip null and undefined values', () => {
    const result = parseWhere({ status: 'active', deletedAt: null, archived: undefined })
    expect(result?.conditions).toHaveLength(1)
    expect(result?.conditions[0].field).toBe('status')
  })

  it('should parse multiple filters', () => {
    const result = parseWhere({ status: 'active', role: 'admin' })
    expect(result?.conditions).toHaveLength(2)
  })

  it('should support like operator', () => {
    const result = parseWhere({ name: 'like:%john%' })
    expect(result).toEqual({
      conditions: [
        {
          type: 'local',
          field: 'name',
          operator: 'like',
          value: '%john%',
        },
      ],
    })
  })

  it('should be case-insensitive for operators', () => {
    const result = parseWhere({ age: 'GTE:18' })
    expect(result?.conditions[0].operator).toBe('gte')
  })
})
