import type { QueryParams } from '@api/core/query'
import type { UserRepository } from './user.repository'
import type { CreateUser, UpdateUser } from './user.schema'
import { NotFoundException } from '@api/errors'

export function createUserService(userRepository: UserRepository) {
  async function getAll(query: QueryParams) {
    const result = await userRepository.getAll(query)

    return result
  }

  async function getById(id: number) {
    const result = await userRepository.getById(id)

    if (!result)
      throw new NotFoundException('User')

    return result
  }

  async function create(data: CreateUser) {
    const result = await userRepository.create(data)

    return result
  }

  async function update(id: number, data: UpdateUser) {
    const result = await userRepository.update(id, data)

    if (!result)
      throw new NotFoundException('User')

    return result
  }

  async function remove(id: number) {
    const result = await userRepository.remove(id)

    if (!result)
      throw new NotFoundException('User')

    return result
  }

  return {
    getAll,
    getById,
    update,
    create,
    remove,
  }
}

export type UserService = ReturnType<typeof createUserService>
