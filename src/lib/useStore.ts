import { useSyncExternalStore } from 'react'

interface Store<T> {
  get: () => T
  subscribe: (fn: (v: T) => void) => () => void
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(
    store.subscribe,
    store.get,
    store.get,
  )
}
