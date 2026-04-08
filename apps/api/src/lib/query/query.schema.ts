export interface QueryParams {
  sort?: string // e.g., "createdAt:desc" or "name"
  select?: string // e.g., "id,name,email"
  page?: string // e.g., "1"
  limit?: string // e.g., "20"
  [key: string]: any // Catch-all for filters like age=gt:18
}
