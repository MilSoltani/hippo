import { describe, expect, it } from 'vitest'
import { parsePagination } from './pagination-parser'

describe('parsePagination', () => {
  it('should use default values when not provided', () => {
    const result = parsePagination()
    expect(result).toEqual({ limit: 10, offset: 0 })
  })

  it('should calculate offset from page number', () => {
    const result = parsePagination('2', '10')
    expect(result).toEqual({ limit: 10, offset: 10 })
  })

  it('should handle page 3 with limit 20', () => {
    const result = parsePagination('3', '20')
    expect(result).toEqual({ limit: 20, offset: 40 })
  })

  it('should default page to 1 if invalid', () => {
    const result = parsePagination('invalid', '10')
    expect(result).toEqual({ limit: 10, offset: 0 })
  })

  it('should enforce minimum limit of 1', () => {
    const result = parsePagination('1', '0')
    expect(result).toEqual({ limit: 1, offset: 0 })
  })

  it('should enforce maximum limit of 100', () => {
    const result = parsePagination('1', '200')
    expect(result).toEqual({ limit: 100, offset: 0 })
  })

  it('should enforce minimum page of 1', () => {
    const result = parsePagination('0', '10')
    expect(result).toEqual({ limit: 10, offset: 0 })
  })

  it('should enforce minimum page of 1 for negative numbers', () => {
    const result = parsePagination('-5', '10')
    expect(result).toEqual({ limit: 10, offset: 0 })
  })

  it('should handle string number parsing', () => {
    const result = parsePagination('2', '50')
    expect(result).toEqual({ limit: 50, offset: 50 })
  })
})
