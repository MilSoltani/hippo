import type { Column } from 'drizzle-orm'
import type { TableColumns } from '../query.schema'
import { asc, desc } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { resolveOrder } from './order-resolver'

describe('resolveOrder', () => {
  const mockColumns: TableColumns = {
    id: {
      name: 'id',
      key: 'id',
      dataType: 'number',
      columnType: 'PgInteger',
    } as unknown as Column<any, object, object>,

    username: {
      name: 'user_name',
      key: 'username',
      dataType: 'string',
      columnType: 'PgVarchar',
      notNull: false,
    } as unknown as Column<any, object, object>,
  }

  it('returns undefined when sort is undefined', async () => {
    expect(resolveOrder(mockColumns, undefined)).toBeUndefined()
  })

  it('returns undefined when sort is empty string', async () => {
    expect(resolveOrder(mockColumns, '')).toBeUndefined()
  })

  it('returns undefined when field does not exist in tableColumns', async () => {
    expect(resolveOrder(mockColumns, 'firstName')).toBeUndefined()
  })

  it('defaults to asc', () => {
    const result = resolveOrder(mockColumns, 'username')

    const expectation = asc(mockColumns.username)

    expect(result).toEqual([expectation])
  })

  it('handles explicit ascending ("name:asc" → asc)', async () => {
    const result = resolveOrder(mockColumns, 'username:asc')

    const expectation = asc(mockColumns.username)

    expect(result).toEqual([expectation])
  })

  it('handles explicit descending ("name:desc" → desc)', async () => {
    const result = resolveOrder(mockColumns, 'username:desc')

    const expectation = desc(mockColumns.username)

    expect(result).toEqual([expectation])
  })

  it('treats order case-insensitively ("name:DESC" → desc)', async () => {
    const resultDesc = resolveOrder(mockColumns, 'username:DESC')
    const resultAsc = resolveOrder(mockColumns, 'username:ASC')

    const expectationDesc = desc(mockColumns.username)
    const expectationASC = asc(mockColumns.username)

    expect(resultDesc).toEqual([expectationDesc])
    expect(resultAsc).toEqual([expectationASC])
  })

  it.todo('falls back to ascending for invalid order ("name:invalid" → asc)')

  it.todo('handles extra colon parts ("name:desc:extra" → desc using first two parts)')

  it.todo('handles whitespace in input (" name : desc " → depends on trimming behavior)')

  it.todo('works with different column types (string, number, date columns)')

  it.todo('returns array with single element when valid ([direction])')

  it.todo('ensures returned direction uses correct column reference from tableColumns')

  it.todo('handles field with special characters if supported ("user_name:asc")')

  it.todo('does not mutate tableColumns')
})
