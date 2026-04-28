import { createStore } from './storage'

export type NotificationType = 'alert' | 'deal' | 'booking' | 'system'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  createdAt: string
  read: boolean
  href?: string
  ctaLabel?: string
}

const KEY = 'tripma.notifications.v1'

const SEED: AppNotification[] = [
  {
    id: 'n-001',
    type: 'deal',
    title: 'Flash sale: London → Lisbon from £49',
    body: 'Limited seats available for travel in May and June. Ends Sunday.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
    href: '/flights?from=LHR&to=LIS&depart=2026-05-20&adults=1&trip=oneway',
    ctaLabel: 'See flights',
  },
  {
    id: 'n-002',
    type: 'alert',
    title: 'Weather disruption in AMS',
    body: 'Low visibility may delay Amsterdam departures today. Check your flight status before heading to the airport.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
    href: '/help',
    ctaLabel: 'Contact support',
  },
  {
    id: 'n-003',
    type: 'booking',
    title: 'Online check-in opens in 24 hours',
    body: "Your upcoming trip opens for check-in soon. We'll notify you when seats are available.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    href: '/trips',
    ctaLabel: 'View trips',
  },
  {
    id: 'n-004',
    type: 'system',
    title: 'New: trip planner',
    body: 'Combine flights, stays, and activities into a single itinerary.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
  },
]

export const notificationsStore = createStore<AppNotification[]>(KEY, SEED)

export function markNotificationRead(id: string) {
  notificationsStore.set(list =>
    list.map(n => (n.id === id ? { ...n, read: true } : n)),
  )
}

export function markAllNotificationsRead() {
  notificationsStore.set(list => list.map(n => ({ ...n, read: true })))
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - then)
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
