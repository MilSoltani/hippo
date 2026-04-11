import { db } from '@api/core/database'
import { createUserHandler } from './user.handler'
import { createUsersRepository } from './user.repository'
import { createUserService } from './user.service'

export function createUserModule() {
  const repository = createUsersRepository(db)
  const service = createUserService(repository)
  const handler = createUserHandler(service)

  return {
    handler,
    service,
    repository,
  }
}
