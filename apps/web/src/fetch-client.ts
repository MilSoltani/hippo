class ResponseError extends Error {
  status: number
  data: any

  constructor(status: number, message: string, data: any) {
    super(message)
    this.name = 'ResponseError'
    this.status = status
    this.data = data
  }
}

const baseUrl = 'http://localhost:3000'

export async function fetchClient<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
  })

  let responseData: any = null
  try {
    responseData = await response.json()
  }
  catch {
    responseData = null
  }

  if (!response.ok) {
    throw new ResponseError(
      response.status,
      responseData?.message || 'Request failed',
      responseData,
    )
  }

  return {
    data: responseData,
    status: response.status,
    headers: response.headers,
  } as T
}
