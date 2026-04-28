import { createStore } from './storage'

export interface PriceAlert {
  id: string
  from: string
  to: string
  depart: string
  returnDate?: string
  startingPriceGBP: number
  currentPriceGBP: number
  createdAt: string
}

export const alertsStore = createStore<PriceAlert[]>('tripma.alerts.v1', [])

function newId(): string {
  return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function addAlert(input: Omit<PriceAlert, 'id' | 'createdAt' | 'currentPriceGBP'>): PriceAlert {
  const alert: PriceAlert = {
    id: newId(),
    createdAt: new Date().toISOString(),
    currentPriceGBP: input.startingPriceGBP,
    ...input,
  }
  alertsStore.set(list => [alert, ...list])
  return alert
}

export function removeAlert(id: string): void {
  alertsStore.set(list => list.filter(a => a.id !== id))
}

export function simulatePriceDrop(id: string): { drop: number; price: number } | null {
  let result: { drop: number; price: number } | null = null
  alertsStore.set(list =>
    list.map(a => {
      if (a.id !== id) return a
      const drop = Math.max(10, Math.round(a.currentPriceGBP * (0.05 + Math.random() * 0.2)))
      const next = Math.max(29, a.currentPriceGBP - drop)
      result = { drop, price: next }
      return { ...a, currentPriceGBP: next }
    }),
  )
  return result
}
