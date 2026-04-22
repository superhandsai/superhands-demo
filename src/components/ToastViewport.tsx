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
    <div className="toast-viewport" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.tone}`} role="status">
          <span className="toast__icon" aria-hidden>{icon(t.tone)}</span>
          <div className="toast__body">
            <strong>{t.title}</strong>
            {t.body ? <p>{t.body}</p> : null}
          </div>
          <button
            type="button"
            className="toast__dismiss"
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
