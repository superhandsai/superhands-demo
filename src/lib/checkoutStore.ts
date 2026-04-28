import type { FlightOption } from '../data/flights'
import type { BookingExtras, PassengerDetails, SeatSelection } from './bookingsStore'
import { createStore, removeKey } from './storage'

export type FareType = 'basic' | 'standard' | 'flex'

export interface CheckoutDraft {
  flight: FlightOption | null
  fareType: FareType
  passengerCount: { adults: number; children: number }
  passengers: PassengerDetails[]
  seats: SeatSelection[]
  extras: BookingExtras
  contactEmail: string
  contactPhone: string
}

const KEY = 'tripma.checkout.v1'

const defaults: CheckoutDraft = {
  flight: null,
  fareType: 'standard',
  passengerCount: { adults: 1, children: 0 },
  passengers: [],
  seats: [],
  extras: {
    checkedBagsByPassenger: {},
    mealsByPassenger: {},
    insurance: false,
    priorityBoarding: false,
  },
  contactEmail: '',
  contactPhone: '',
}

export const checkoutStore = createStore<CheckoutDraft>(KEY, defaults)

export function startCheckout(flight: FlightOption, passengerCount: { adults: number; children: number }, fareType: FareType = 'standard'): void {
  checkoutStore.set({
    ...defaults,
    flight,
    fareType,
    passengerCount,
    passengers: Array.from({ length: passengerCount.adults + passengerCount.children }, (_, i) => ({
      id: `p${i + 1}`,
      firstName: '',
      lastName: '',
      dob: '',
    })),
  })
}

export function clearCheckout(): void {
  removeKey(KEY)
  checkoutStore.set(defaults)
}

export const FARE_PRICING: Record<FareType, { label: string; description: string; multiplier: number }> = {
  basic: { label: 'Basic', description: 'Underseat bag only. No changes.', multiplier: 1 },
  standard: { label: 'Standard', description: 'Cabin bag, seat selection, changes with fee.', multiplier: 1.25 },
  flex: { label: 'Flex', description: 'Checked bag, free changes, priority boarding.', multiplier: 1.6 },
}
