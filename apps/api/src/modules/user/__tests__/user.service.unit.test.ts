import type { UserRepository } from '../user.repository'
import type { User } from '../users.schema'
import { NotFoundException } from '@api/errors'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createUserService } from '../user.service'

const userRepository: UserRepository = {
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}

const UserService = createUserService(userRepository)

describe('userService', () => {
  const NON_EXISTENT_USER_ID = 999

  const USER_1: User = {
    id: 1,
    firstName: 'brian',
    lastName: 'adams',
    username: 'badams',
    email: 'badams@mail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const USER_2: User = {
    id: 2,
    firstName: 'john',
    lastName: 'smith',
    username: 'jsmith',
    email: 'jsmith@mail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getAll', () => {
    it('returns all users', async () => {
      vi.mocked(userRepository.getAll).mockResolvedValue([USER_1, USER_2])

      const result = await UserService.getAll()

      expect(userRepository.getAll).toHaveBeenCalledOnce()
      expect(result).toEqual([USER_1, USER_2])
    })
  })

  describe('getById', () => {
    it('returns user when found', async () => {
      vi.mocked(userRepository.getById).mockResolvedValue(USER_1)

      const result = await UserService.getById(1)

      expect(userRepository.getById).toHaveBeenCalledOnce()
      expect(result).toEqual(USER_1)
    })

    it('throws NotFoundException when user not found', async () => {
      vi.mocked(userRepository.getById).mockResolvedValue(undefined)

      await expect(UserService.getById(NON_EXISTENT_USER_ID))
        .rejects
        .toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('creates user with given payload', async () => {
      const { id, createdAt, updatedAt, ...user } = USER_1

      vi.mocked(userRepository.create).mockResolvedValue(USER_1)

      const result = await UserService.create(user)

      expect(userRepository.create).toHaveBeenCalledOnce()
      expect(userRepository.create).toHaveBeenCalledWith(user)
      expect(result).toEqual(USER_1)
    })
  })

  describe('update', () => {
    it('updates user when found', async () => {
      const email = 'test@test.com'

      vi.mocked(userRepository.update).mockResolvedValue(USER_1)

      const result = await UserService.update(1, { email })

      expect(userRepository.update).toHaveBeenCalledWith(1, { email })
      expect(result).toEqual(USER_1)
    })

    it('throws when user does not exist', async () => {
      vi.mocked(userRepository.update).mockResolvedValue(undefined)

      const email = 'mail@test.test'

      await expect(UserService.update(NON_EXISTENT_USER_ID, { email }))
        .rejects
        .toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('removes user when found', async () => {
      vi.mocked(userRepository.remove).mockResolvedValue(USER_1)

      const result = await UserService.remove(1)

      expect(userRepository.remove).toHaveBeenCalledWith(1)
      expect(result).toEqual(USER_1)
    })

    it('throws NotFoundException when user not found', async () => {
      vi.mocked(userRepository.remove).mockResolvedValue(undefined)

      await expect(UserService.remove(NON_EXISTENT_USER_ID))
        .rejects
        .toThrow(NotFoundException)
    })
  })
})
