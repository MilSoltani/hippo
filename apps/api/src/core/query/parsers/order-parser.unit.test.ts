import { describe, expect, it } from 'vitest'
import { parseOrder } from './order-parser'

describe('parseOrder', () => {
  it('should parse single sort with ascending direction', () => {
    const result = parseOrder('name:asc')
    expect(result).toEqual([{ field: 'name', direction: 'asc' }])
  })

  it('should parse single sort with descending direction', () => {
    const result = parseOrder('name:desc')
    expect(result).toEqual([{ field: 'name', direction: 'desc' }])
  })

  it('should default to ascending when direction omitted', () => {
    const result = parseOrder('name')
    expect(result).toEqual([{ field: 'name', direction: 'asc' }])
  })

  it('should parse multiple sorts', () => {
    const result = parseOrder('name:asc,createdAt:desc')
    expect(result).toEqual([
      { field: 'name', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ])
  })

  it('should return undefined when no sort provided', () => {
    const result = parseOrder()
    expect(result).toBeUndefined()
  })

  it('should return undefined when empty string', () => {
    const result = parseOrder('')
    expect(result).toBeUndefined()
  })

  it('should be case-insensitive for direction', () => {
    const result = parseOrder('name:DESC')
    expect(result).toEqual([{ field: 'name', direction: 'desc' }])
  })

  it('should skip invalid parts with no field name', () => {
    const result = parseOrder('name:asc,:desc')
    expect(result).toEqual([{ field: 'name', direction: 'asc' }])
  })

  it('should trim whitespace', () => {
    const result = parseOrder(' name : asc , createdAt : desc ')
    expect(result).toEqual([
      { field: 'name', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ])
  })
})
