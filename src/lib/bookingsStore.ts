import type { FlightOption } from '../data/flights'
import { createStore } from './storage'

export interface PassengerDetails {
  id: string
  firstName: string
  lastName: string
  dob: string
  email?: string
  phone?: string
  passportNumber?: string
}

export interface BookingExtras {
  checkedBagsByPassenger: Record<string, number>
  mealsByPassenger: Record<string, string>
  insurance: boolean
  priorityBoarding: boolean
}

export interface SeatSelection {
  passengerId: string
  segmentId: string
  seat: string
}

export interface Booking {
  pnr: string
  createdAt: string
  status: 'confirmed' | 'cancelled' | 'flown'
  accountEmail: string | null
  flight: FlightOption
  fareType: 'basic' | 'standard' | 'flex'
  passengers: PassengerDetails[]
  seats: SeatSelection[]
  extras: BookingExtras
  totalGBP: number
  paymentLast4: string
  contactEmail: string
  contactPhone: string
}

const KEY = 'tripma.bookings.v1'

export const bookingsStore = createStore<Booking[]>(KEY, [])

export function addBooking(booking: Booking): void {
  bookingsStore.set(list => [booking, ...list])
}

export function updateBooking(pnr: string, updater: (b: Booking) => Booking): void {
  bookingsStore.set(list => list.map(b => (b.pnr === pnr ? updater(b) : b)))
}

export function getBooking(pnr: string): Booking | null {
  return bookingsStore.get().find(b => b.pnr === pnr) ?? null
}

export function generatePnr(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += letters[Math.floor(Math.random() * letters.length)]
  }
  return code
}
