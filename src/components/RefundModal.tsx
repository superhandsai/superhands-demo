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
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="refund-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(13,13,59,0.5)] border-0 cursor-pointer"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl w-[min(520px,100%)] py-6 px-7 shadow-modal">
        <header className="flex justify-between items-center mb-3">
          <h2 id="refund-title" className="m-0 text-[22px]">Cancel trip</h2>
          <button
            type="button"
            className="bg-transparent border-0 text-2xl text-grey-600 cursor-pointer"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        {phase === 'review' ? (
          <>
            <p>Review your refund estimate before confirming.</p>
            <dl className="grid grid-cols-[1fr_auto] gap-y-2 gap-x-6 my-4">
              <div className="contents">
                <dt className="text-grey-600 text-sm">Total paid</dt>
                <dd className="m-0 text-right text-grey-900 text-sm">£{booking.totalGBP.toLocaleString()}</dd>
              </div>
              <div className="contents">
                <dt className="text-grey-600 text-sm">Fare type</dt>
                <dd className="m-0 text-right text-grey-900 text-sm">{booking.fareType}</dd>
              </div>
              <div className="contents">
                <dt className="text-grey-600 text-sm">Cancellation fee</dt>
                <dd className="m-0 text-right text-grey-900 text-sm">{fee === 0 ? 'Free (Flex)' : `−£${fee}`}</dd>
              </div>
              <div className="contents">
                <dt className="text-grey-900 font-semibold pt-2 border-t border-grey-200 text-sm">Estimated refund</dt>
                <dd className="m-0 text-right text-grey-900 pt-2 border-t border-grey-200 text-lg">
                  <strong>£{refundAmount.toLocaleString()}</strong>
                </dd>
              </div>
            </dl>
            <p className="text-[13px] text-grey-600 m-0">Refunds typically take 5–10 working days to appear on your card.</p>
            <div className="flex justify-end gap-2.5 mt-5">
              <button
                type="button"
                className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] inline-flex items-center justify-center gap-2 transition-colors bg-white text-purple border border-purple hover:bg-purple-on disabled:cursor-not-allowed disabled:opacity-60"
                onClick={onClose}
              >Keep booking</button>
              <button
                type="button"
                className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] inline-flex items-center justify-center gap-2 transition-colors bg-purple text-white hover:bg-purple-hover disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => { setPhase('processing'); setStep(0) }}
              >
                Confirm cancellation
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-[14px] my-5" aria-live="polite">
              {steps.map((label, i) => {
                const isActive = i <= step
                const isDone = i < step
                const dotClass = isDone
                  ? 'bg-success border-success'
                  : isActive
                    ? 'bg-purple border-purple'
                    : 'bg-grey-200 border-grey-200'
                return (
                  <div
                    key={label}
                    className={`flex items-center gap-3 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${dotClass}`} />
                    <div>
                      <strong>{label}</strong>
                      {i === step && phase === 'processing' ? (
                        <span
                          className="inline-block w-3 h-3 ml-2 border-2 border-purple border-t-transparent rounded-full animate-spin-refund align-middle"
                          aria-hidden
                        />
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
            {phase === 'done' ? (
              <div className="flex justify-end gap-2.5 mt-5">
                <button type="button" className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] inline-flex items-center justify-center gap-2 transition-colors bg-purple text-white hover:bg-purple-hover disabled:cursor-not-allowed disabled:opacity-60" onClick={onClose}>Done</button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
