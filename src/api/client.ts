const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000'
const DEV_USER_ID = import.meta.env.VITE_DEV_USER_ID || 'demo-telegram-1'

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: unknown
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-user-id': DEV_USER_ID,
    ...(options.headers || {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${options.method || 'GET'} ${path} failed: ${res.status} ${text}`)
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T
  return (await res.json()) as T
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' })
}

export function apiPut<T, B = unknown>(path: string, body: B): Promise<T> {
  return request<T>(path, { method: 'PUT', body })
}

export { BASE_URL }


