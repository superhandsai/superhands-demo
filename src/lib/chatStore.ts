import { createStore } from './storage'

export interface ChatMessage {
  id: string
  from: 'user' | 'agent'
  text: string
  at: string
}

interface ChatState {
  open: boolean
  typing: boolean
  messages: ChatMessage[]
}

const INITIAL: ChatState = {
  open: false,
  typing: false,
  messages: [
    {
      id: 'm-welcome',
      from: 'agent',
      text: "Hi! I'm Ava, your Tripma assistant. How can I help today?",
      at: new Date().toISOString(),
    },
  ],
}

export const chatStore = createStore<ChatState>('tripma.chat.v1', INITIAL)

function newId() {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`
}

export function openChat() { chatStore.set(s => ({ ...s, open: true })) }
export function closeChat() { chatStore.set(s => ({ ...s, open: false })) }
export function toggleChat() { chatStore.set(s => ({ ...s, open: !s.open })) }

const CANNED: Array<{ match: RegExp; reply: string }> = [
  { match: /(cancel|refund)/i, reply: "To cancel a booking, open My Trips, pick your trip, and tap 'Cancel trip'. Refund eligibility depends on the fare rules shown at booking." },
  { match: /(bag|baggage|luggage)/i, reply: 'Economy fares include one under-seat bag. Add a checked bag from extras or from your trip page for £30.' },
  { match: /(change|reschedule)/i, reply: "Fare rules vary — Flex allows free changes, Standard has a £45 fee plus fare difference, and Basic is non-changeable." },
  { match: /(check[- ]?in|boarding pass)/i, reply: 'Online check-in opens 24 hours before departure. Head to My Trips → Check in to generate your boarding passes.' },
  { match: /(seat|upgrade)/i, reply: 'You can select or change seats from My Trips. Upgrades to Premium are available at checkout or as a Rewards redemption.' },
  { match: /(loyalty|points|rewards)/i, reply: 'You earn 1 point per £1 spent. Redeem points from Account → Rewards for vouchers, lounge passes, and upgrades.' },
  { match: /(delay|status|gate)/i, reply: 'Check the latest status from the flight status page — search your flight number for live gate and delay info.' },
  { match: /(hello|hi|hey|thanks|thank you)/i, reply: 'Happy to help anytime. Anything else I can look up?' },
]

function cannedReply(text: string): string {
  for (const c of CANNED) if (c.match.test(text)) return c.reply
  return "I've passed this to our team — they'll email you within the hour. In the meantime, the Help Center covers most common questions."
}

export function sendMessage(text: string): void {
  const trimmed = text.trim()
  if (!trimmed) return
  const userMsg: ChatMessage = {
    id: newId(),
    from: 'user',
    text: trimmed,
    at: new Date().toISOString(),
  }
  chatStore.set(s => ({ ...s, messages: [...s.messages, userMsg], typing: true }))
  const delay = 600 + Math.round(Math.random() * 700)
  window.setTimeout(() => {
    const reply: ChatMessage = {
      id: newId(),
      from: 'agent',
      text: cannedReply(trimmed),
      at: new Date().toISOString(),
    }
    chatStore.set(s => ({ ...s, messages: [...s.messages, reply], typing: false }))
  }, delay)
}

export const QUICK_REPLIES = [
  'How do I cancel?',
  'What is the baggage allowance?',
  'Can I change my flight?',
  'When does check-in open?',
]
