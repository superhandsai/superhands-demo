/**
 * Minimal localStorage helpers that no-op on the server and on quota errors.
 */

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / privacy mode — ignore */
  }
}

export function removeKey(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* noop */
  }
}

type Listener<T> = (value: T) => void

export function createStore<T>(key: string, initial: T) {
  let value: T = readJson<T>(key, initial)
  const listeners = new Set<Listener<T>>()

  function get(): T {
    return value
  }

  function set(next: T | ((prev: T) => T)): void {
    value = typeof next === 'function' ? (next as (p: T) => T)(value) : next
    writeJson(key, value)
    listeners.forEach(l => l(value))
  }

  function subscribe(listener: Listener<T>): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', e => {
      if (e.key !== key || e.newValue === null) return
      try {
        value = JSON.parse(e.newValue) as T
        listeners.forEach(l => l(value))
      } catch {
        /* noop */
      }
    })
  }

  return { get, set, subscribe }
}
