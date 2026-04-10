export function parsePagination(page?: string, limit?: string) {
  const p = Math.max(1, Number.parseInt(page || '1') || 1)
  const l = Math.min(100, Math.max(1, Number.parseInt(limit || '10') || 10))

  return { limit: l, offset: (p - 1) * l }
}
