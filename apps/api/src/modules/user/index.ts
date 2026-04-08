import { db } from '@api/database'
import { createUserHandler } from './user.handler'
import { createUsersRepository } from './user.repository'
import { createUserService } from './user.service'

const userRepository = createUsersRepository(db)
export const userService = createUserService(userRepository)
export const userHandler = createUserHandler(userService)

export type { UserHandler } from './user.handler'
export type { UserService } from './user.service'
export * as UserSchemas from './users.schema'
