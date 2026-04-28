import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  clearExpiredToasts,
  dismissToast,
  toastStore,
  type ToastTone,
} from '../lib/toastStore'
import { useStore } from '../lib/useStore'

function icon(tone: ToastTone) {
  switch (tone) {
    case 'success':
      return '✓'
    case 'warn':
      return '⚠'
    case 'error':
      return '✕'
    case 'info':
      return 'i'
  }
}

function toneIconClass(tone: ToastTone) {
  switch (tone) {
    case 'success':
      return 'bg-success-soft text-success'
    case 'info':
      return 'bg-purple-soft text-purple'
    case 'warn':
      return 'bg-warn-soft text-warn'
    case 'error':
      return 'bg-danger-soft text-danger'
  }
}

export function ToastViewport() {
  const { toasts } = useStore(toastStore)

  useEffect(() => {
    if (toasts.length === 0) return
    const i = window.setInterval(() => clearExpiredToasts(Date.now()), 500)
    return () => window.clearInterval(i)
  }, [toasts.length])

  if (typeof document === 'undefined') return null
  if (toasts.length === 0) return null

  return createPortal(
    <div
      className="fixed top-5 right-5 flex flex-col gap-[10px] z-[1200] pointer-events-none max-w-[min(360px,calc(100vw-40px))]"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map(t => (
        <div
          key={t.id}
          className="bg-white border border-grey-200 rounded-xl py-3 px-[14px] grid grid-cols-[24px_1fr_auto] gap-[10px] items-start shadow-pop pointer-events-auto animate-toast-in"
          role="status"
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${toneIconClass(t.tone)}`}
            aria-hidden
          >
            {icon(t.tone)}
          </span>
          <div>
            <strong className="block text-sm text-grey-900">{t.title}</strong>
            {t.body ? <p className="mt-0.5 mb-0 text-[13px] text-grey-600">{t.body}</p> : null}
          </div>
          <button
            type="button"
            className="bg-transparent border-0 text-lg text-grey-400 hover:text-grey-900 cursor-pointer leading-none py-0 px-1"
            aria-label="Dismiss"
            onClick={() => dismissToast(t.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>,
    document.body,
  )
}
