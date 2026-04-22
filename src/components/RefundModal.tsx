import { useEffect, useState } from 'react'
import type { Booking } from '../lib/bookingsStore'
import { updateBooking } from '../lib/bookingsStore'
import { pushToast } from '../lib/toastStore'

type Phase = 'review' | 'processing' | 'done'

interface RefundModalProps {
  booking: Booking
  onClose: () => void
}

function feeFor(fareType: Booking['fareType']) {
  if (fareType === 'flex') return 0
  if (fareType === 'standard') return 45
  return 120
}

export function RefundModal({ booking, onClose }: RefundModalProps) {
  const fee = feeFor(booking.fareType)
  const refundAmount = Math.max(0, booking.totalGBP - fee)
  const [phase, setPhase] = useState<Phase>('review')
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (phase !== 'processing') return
    const timers: number[] = []
    timers.push(window.setTimeout(() => setStep(1), 600))
    timers.push(window.setTimeout(() => setStep(2), 1400))
    timers.push(window.setTimeout(() => {
      updateBooking(booking.pnr, b => ({ ...b, status: 'cancelled' }))
      setStep(3)
      setPhase('done')
      pushToast({
        tone: 'success',
        title: 'Trip cancelled',
        body: `Refund of £${refundAmount.toLocaleString()} initiated.`,
      })
    }, 2400))
    return () => { timers.forEach(t => window.clearTimeout(t)) }
  }, [phase, booking.pnr, refundAmount])

  const steps = ['Request received', 'Eligibility verified', 'Refund initiated', 'Funds released']

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="refund-title">
      <button type="button" className="modal-scrim" aria-label="Close" onClick={onClose} />
      <div className="modal">
        <header className="modal__head">
          <h2 id="refund-title">Cancel trip</h2>
          <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>×</button>
        </header>
        {phase === 'review' ? (
          <>
            <p>Review your refund estimate before confirming.</p>
            <dl className="refund-grid">
              <div>
                <dt>Total paid</dt>
                <dd>£{booking.totalGBP.toLocaleString()}</dd>
              </div>
              <div>
                <dt>Fare type</dt>
                <dd>{booking.fareType}</dd>
              </div>
              <div>
                <dt>Cancellation fee</dt>
                <dd>{fee === 0 ? 'Free (Flex)' : `−£${fee}`}</dd>
              </div>
              <div className="refund-grid__total">
                <dt>Estimated refund</dt>
                <dd><strong>£{refundAmount.toLocaleString()}</strong></dd>
              </div>
            </dl>
            <p className="manage-note">Refunds typically take 5–10 working days to appear on your card.</p>
            <div className="modal__actions">
              <button type="button" className="btn btn--secondary" onClick={onClose}>Keep booking</button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => { setPhase('processing'); setStep(0) }}
              >
                Confirm cancellation
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="refund-timeline" aria-live="polite">
              {steps.map((label, i) => (
                <div key={label} className={`refund-step ${i <= step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}>
                  <span className="refund-step__dot" />
                  <div>
                    <strong>{label}</strong>
                    {i === step && phase === 'processing' ? (
                      <span className="refund-step__spinner" aria-hidden />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            {phase === 'done' ? (
              <div className="modal__actions">
                <button type="button" className="btn btn--primary" onClick={onClose}>Done</button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
