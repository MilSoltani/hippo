import type { UserSchemas } from '@/schemas'
import { userClient } from '@/clients'

export function createUserApi(client = userClient) {
  async function getAll() {
    return client.index.$get()
  }

  async function getById(id: number) {
    return client[':id'].$get(id)
  }

  async function create(payload: UserSchemas.CreateUser) {
    return client.index.$post(payload)
  }

  async function update(id: number, payload: UserSchemas.UpdateUser) {
    return client[':id'].$put(id, payload)
  }

  async function remove(id: number) {
    return client[':id'].$delete(id)
  }

  return {
    create,
    getAll,
    getById,
    remove,
    update,
  }
}

export type UserApi = ReturnType<typeof createUserApi>
