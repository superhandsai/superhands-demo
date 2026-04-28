import { createStore } from './storage'

export interface SavedFlight {
  id: string
  from: string
  to: string
  depart: string
  returnDate?: string
  priceGBP: number
  carrier: string
  savedAt: string
}

export interface SavedStay {
  id: string
  name: string
  location: string
  nightlyGBP: number
  savedAt: string
}

interface SavedState {
  flights: SavedFlight[]
  stays: SavedStay[]
}

export const savedStore = createStore<SavedState>('tripma.saved.v1', {
  flights: [],
  stays: [],
})

export function toggleSavedFlight(flight: Omit<SavedFlight, 'savedAt'>): boolean {
  let removed = false
  savedStore.set(s => {
    const exists = s.flights.some(f => f.id === flight.id)
    removed = exists
    return {
      ...s,
      flights: exists
        ? s.flights.filter(f => f.id !== flight.id)
        : [{ ...flight, savedAt: new Date().toISOString() }, ...s.flights],
    }
  })
  return !removed
}

export function toggleSavedStay(stay: Omit<SavedStay, 'savedAt'>): boolean {
  let removed = false
  savedStore.set(s => {
    const exists = s.stays.some(x => x.id === stay.id)
    removed = exists
    return {
      ...s,
      stays: exists
        ? s.stays.filter(x => x.id !== stay.id)
        : [{ ...stay, savedAt: new Date().toISOString() }, ...s.stays],
    }
  })
  return !removed
}

export function isFlightSaved(id: string): boolean {
  return savedStore.get().flights.some(f => f.id === id)
}

export function isStaySaved(id: string): boolean {
  return savedStore.get().stays.some(s => s.id === id)
}
