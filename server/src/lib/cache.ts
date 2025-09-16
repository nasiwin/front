type Entry<T> = { value: T; expiresAt: number }

export class MemoryCache {
  private store = new Map<string, Entry<unknown>>()

  constructor(private defaultTtlMs = 5 * 60 * 1000) {}

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.value as T
  }

  set<T>(key: string, value: T, ttlMs?: number) {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs)
    this.store.set(key, { value, expiresAt })
  }

  del(key: string) {
    this.store.delete(key)
  }
}

export const cache = new MemoryCache(24 * 60 * 60 * 1000) // по умолчанию 24 часа


