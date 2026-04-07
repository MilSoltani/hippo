import type { UserApi } from '@/apis'
import type { UserSchemas } from '@/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export function createUserQuery(api: UserApi) {
  const keys = {
    all: ['users'] as const,
    detail: (id: number) => ['users', id] as const,
  }

  function getAll() {
    return useQuery({
      queryKey: keys.all,
      queryFn: () => api.getAll(),
      staleTime: 1000 * 60 * 5,
      retry: 2,
    })
  }

  function getById(id: number) {
    return useQuery({
      queryKey: keys.detail(id),
      queryFn: () => api.getById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    })
  }

  function create() {
    const qc = useQueryClient()

    return useMutation({
      mutationFn: (payload: UserSchemas.CreateUser) => api.create(payload),

      onSuccess: () => {
        qc.invalidateQueries({ queryKey: keys.all })
      },
    })
  }

  function update() {
    const qc = useQueryClient()

    return useMutation({
      mutationFn: ({ id, payload }: {
        id: number
        payload: UserSchemas.UpdateUser
      }) => api.update(id, payload),

      onSuccess: (_, vars) => {
        qc.invalidateQueries({ queryKey: keys.all })
        qc.invalidateQueries({ queryKey: keys.detail(vars.id) })
      },
    })
  }

  function remove() {
    const qc = useQueryClient()

    return useMutation({
      mutationFn: (id: number) => api.remove(id),

      onSuccess: () => {
        qc.invalidateQueries({ queryKey: keys.all })
      },
    })
  }

  return {
    keys,
    getAll,
    getById,
    create,
    update,
    remove,
  }
}
