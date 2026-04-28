import { createStore, removeKey } from './storage'

export interface Account {
  email: string
  firstName: string
  lastName: string
  phone?: string
  savedTravellers: SavedTraveller[]
  paymentMethods: PaymentMethod[]
  preferences: AccountPreferences
  rewardsPoints: number
}

export interface SavedTraveller {
  id: string
  firstName: string
  lastName: string
  dob: string
  passportNumber?: string
  passportCountry?: string
}

export interface PaymentMethod {
  id: string
  brand: 'Visa' | 'Mastercard' | 'Amex'
  last4: string
  expiryMonth: number
  expiryYear: number
  nameOnCard: string
}

export interface AccountPreferences {
  seatPreference: 'window' | 'aisle' | 'no-preference'
  mealPreference: 'standard' | 'vegetarian' | 'vegan' | 'halal' | 'kosher' | 'gluten-free'
  newsletter: boolean
  priceAlerts: boolean
}

export interface Session {
  account: Account | null
}

const SESSION_KEY = 'tripma.session.v1'
const ACCOUNTS_KEY = 'tripma.accounts.v1'

const defaultSession: Session = { account: null }

export const sessionStore = createStore<Session>(SESSION_KEY, defaultSession)

function readAccounts(): Record<string, { password: string; account: Account }> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function writeAccounts(accounts: Record<string, { password: string; account: Account }>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch {
    /* noop */
  }
}

export function signIn(email: string, password: string): { ok: true } | { ok: false; error: string } {
  const key = email.trim().toLowerCase()
  if (!key) return { ok: false, error: 'Email is required' }
  const accounts = readAccounts()
  const record = accounts[key]
  if (!record) return { ok: false, error: 'No account found with that email' }
  if (record.password !== password) return { ok: false, error: 'Incorrect password' }
  sessionStore.set({ account: record.account })
  return { ok: true }
}

export function signUp(input: {
  email: string
  password: string
  firstName: string
  lastName: string
}): { ok: true } | { ok: false; error: string } {
  const key = input.email.trim().toLowerCase()
  if (!key) return { ok: false, error: 'Email is required' }
  if (!input.password || input.password.length < 6)
    return { ok: false, error: 'Password must be at least 6 characters' }
  const accounts = readAccounts()
  if (accounts[key]) return { ok: false, error: 'An account already exists for that email' }

  const account: Account = {
    email: key,
    firstName: input.firstName.trim() || 'Traveller',
    lastName: input.lastName.trim(),
    savedTravellers: [],
    paymentMethods: [],
    preferences: {
      seatPreference: 'no-preference',
      mealPreference: 'standard',
      newsletter: true,
      priceAlerts: true,
    },
    rewardsPoints: 0,
  }
  accounts[key] = { password: input.password, account }
  writeAccounts(accounts)
  sessionStore.set({ account })
  return { ok: true }
}

export function signOut(): void {
  sessionStore.set({ account: null })
  removeKey(SESSION_KEY)
}

export function updateAccount(updater: (a: Account) => Account): void {
  const current = sessionStore.get().account
  if (!current) return
  const next = updater(current)
  const accounts = readAccounts()
  const record = accounts[next.email]
  if (record) {
    accounts[next.email] = { password: record.password, account: next }
    writeAccounts(accounts)
  }
  sessionStore.set({ account: next })
}
