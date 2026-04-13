import type { ParsedWith } from '@api/core/query'
import { describe, expect, it, vi } from 'vitest'
import { adaptWith } from './with-adapter'

vi.mock('../../relation-map', () => ({
  getRelationMap: vi.fn(() => ({
    creator: {
      table: {},
      joinCondition: {},
      essentialColumns: { id: true, name: true },
    },
    assignee: {
      table: {},
      joinCondition: {},
      essentialColumns: { id: true, email: true },
    },
    team: {
      table: {},
      joinCondition: {},
      essentialColumns: { id: true, title: true },
    },
  })),
}))

describe('adaptWith', () => {
  it('should return undefined when withQuery is undefined', () => {
    const result = adaptWith(undefined)

    expect(result).toBeUndefined()
  })

  it('should return undefined when no relations in withQuery', () => {
    const parsed: ParsedWith = {
      relations: {},
    }

    const result = adaptWith(parsed)

    expect(result).toBeUndefined()
  })

  it('should adapt single relation', () => {
    const parsed: ParsedWith = {
      relations: {
        creator: {
          relations: {},
        },
      },
    }

    const result = adaptWith(parsed)

    expect(result).toBeDefined()
    expect(result?.creator).toBeDefined()
    expect(result?.creator.columns).toEqual({ id: true, name: true })
  })

  it('should adapt multiple relations', () => {
    const parsed: ParsedWith = {
      relations: {
        creator: { relations: {} },
        assignee: { relations: {} },
      },
    }

    const result = adaptWith(parsed)

    expect(result).toBeDefined()
    expect(result?.creator).toBeDefined()
    expect(result?.assignee).toBeDefined()
    expect(result?.creator.columns).toEqual({ id: true, name: true })
    expect(result?.assignee.columns).toEqual({ id: true, email: true })
  })

  it('should skip non-existent relations', () => {
    const parsed: ParsedWith = {
      relations: {
        creator: { relations: {} },
        nonexistent: { relations: {} },
      },
    }

    const result = adaptWith(parsed)

    expect(result).toBeDefined()
    expect(result?.creator).toBeDefined()
    expect(result?.nonexistent).toBeUndefined()
  })

  it('should handle nested relations', () => {
    const parsed: ParsedWith = {
      relations: {
        creator: {
          relations: {
            team: { relations: {} },
          },
        },
      },
    }

    const result = adaptWith(parsed)

    expect(result).toBeDefined()
    expect(result?.creator).toBeDefined()
    expect(result?.creator.with).toBeDefined()
    expect(result?.creator.with?.team).toBeDefined()
  })

  it('should set columns from essential columns', () => {
    const parsed: ParsedWith = {
      relations: {
        assignee: { relations: {} },
      },
    }

    const result = adaptWith(parsed)

    expect(result?.assignee.columns).toEqual({ id: true, email: true })
  })

  it('should handle empty nested relations', () => {
    const parsed: ParsedWith = {
      relations: {
        creator: {
          relations: {},
        },
      },
    }

    const result = adaptWith(parsed)

    expect(result).toBeDefined()
    expect(result?.creator).toBeDefined()
    expect(result?.creator.with).toBeUndefined()
  })

  it('should return undefined when all relations are non-existent', () => {
    const parsed: ParsedWith = {
      relations: {
        nonexistent1: { relations: {} },
        nonexistent2: { relations: {} },
      },
    }

    const result = adaptWith(parsed)

    expect(result).toBeUndefined()
  })
})
