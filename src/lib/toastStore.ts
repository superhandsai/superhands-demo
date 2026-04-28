import { createStore } from './storage'

export type ToastTone = 'success' | 'info' | 'warn' | 'error'

export interface Toast {
  id: string
  tone: ToastTone
  title: string
  body?: string
  createdAt: number
}

interface ToastState {
  toasts: Toast[]
}

export const toastStore = createStore<ToastState>('tripma.toasts.v1', { toasts: [] })

function newId(): string {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function pushToast(input: { tone?: ToastTone; title: string; body?: string }): string {
  const id = newId()
  const toast: Toast = {
    id,
    tone: input.tone ?? 'info',
    title: input.title,
    body: input.body,
    createdAt: Date.now(),
  }
  toastStore.set(s => ({ toasts: [...s.toasts, toast] }))
  return id
}

export function dismissToast(id: string): void {
  toastStore.set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
}

export function clearExpiredToasts(now: number, ttlMs = 4000): void {
  toastStore.set(s => ({ toasts: s.toasts.filter(t => now - t.createdAt < ttlMs) }))
}
