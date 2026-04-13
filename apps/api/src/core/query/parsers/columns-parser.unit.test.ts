import { describe, expect, it } from 'vitest'
import { parseColumns } from './columns-parser'

describe('parseColumns', () => {
  it('should parse comma-separated columns', () => {
    const result = parseColumns('id,name,email')
    expect(result).toEqual({ id: true, name: true, email: true })
  })

  it('should trim whitespace from column names', () => {
    const result = parseColumns('id , name , email')
    expect(result).toEqual({ id: true, name: true, email: true })
  })

  it('should return empty object when no columns provided', () => {
    const result = parseColumns()
    expect(result).toEqual({})
  })

  it('should handle empty string', () => {
    const result = parseColumns('')
    expect(result).toEqual({})
  })

  it('should skip empty column names', () => {
    const result = parseColumns('id,,name')
    expect(result).toEqual({ id: true, name: true })
  })

  it('should handle single column', () => {
    const result = parseColumns('id')
    expect(result).toEqual({ id: true })
  })
})
