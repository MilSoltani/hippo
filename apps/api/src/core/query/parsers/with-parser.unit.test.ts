import { describe, expect, it } from 'vitest'
import { parseWith } from './with-parser'

describe('parseWith', () => {
  it('should parse single relation', () => {
    const result = parseWith('creator')
    expect(result).toEqual({
      relations: {
        creator: { relations: {} },
      },
    })
  })

  it('should parse multiple relations', () => {
    const result = parseWith('creator,tags')
    expect(result).toEqual({
      relations: {
        creator: { relations: {} },
        tags: { relations: {} },
      },
    })
  })

  it('should parse nested relations', () => {
    const result = parseWith('creator.role')
    expect(result).toEqual({
      relations: {
        creator: {
          relations: {
            role: { relations: {} },
          },
        },
      },
    })
  })

  it('should parse deeply nested relations', () => {
    const result = parseWith('creator.role.permissions')
    expect(result).toEqual({
      relations: {
        creator: {
          relations: {
            role: {
              relations: {
                permissions: { relations: {} },
              },
            },
          },
        },
      },
    })
  })

  it('should parse mixed relations', () => {
    const result = parseWith('creator,tags,comments.author')
    expect(result?.relations.creator).toEqual({ relations: {} })
    expect(result?.relations.tags).toEqual({ relations: {} })
    expect(result?.relations.comments).toEqual({
      relations: { author: { relations: {} } },
    })
  })

  it('should return undefined when not provided', () => {
    const result = parseWith()
    expect(result).toBeUndefined()
  })

  it('should return undefined for empty string', () => {
    const result = parseWith('')
    expect(result).toBeUndefined()
  })

  it('should trim whitespace', () => {
    const result = parseWith(' creator , tags ')
    expect(result).toEqual({
      relations: {
        creator: { relations: {} },
        tags: { relations: {} },
      },
    })
  })
})
