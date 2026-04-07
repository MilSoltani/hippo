import type { AppEnvironment } from '@api/types'
import type { UserService } from './user.service'
import { OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { UserRoutes } from './user.routes'
import { UserSchema } from './users.schema'

export function createUserHandler(userService: UserService) {
  return new OpenAPIHono<AppEnvironment>()
    .openapi(UserRoutes.getAll, async (c) => {
      const query = c.req.query()

      const data = await userService.getAll(query)
      const parsedData = z.array(UserSchema).parse(data)
      return c.json(parsedData, 200)
    })
    .openapi(UserRoutes.getById, async (c) => {
      const { id } = c.req.valid('param')
      const data = await userService.getById(id)
      const parsedData = UserSchema.parse(data)
      return c.json(parsedData, 200)
    })
    .openapi(UserRoutes.create, async (c) => {
      const data = c.req.valid('json')
      const user = await userService.create(data)
      const parsedUser = UserSchema.parse(user)
      return c.json(parsedUser, 201)
    })
    .openapi(UserRoutes.update, async (c) => {
      const { id } = c.req.valid('param')
      const data = c.req.valid('json')
      const updatedUser = await userService.update(id, data)
      const parsedData = UserSchema.parse(updatedUser)
      return c.json(parsedData, 200)
    })
    .openapi(UserRoutes.remove, async (c) => {
      const { id } = c.req.valid('param')
      await userService.remove(id)
      return c.body(null, 204)
    })
}

export type UserHandler = ReturnType<typeof createUserHandler>
