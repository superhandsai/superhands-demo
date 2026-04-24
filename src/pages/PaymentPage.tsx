import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PriceSummary, computeTotal } from '../components/PriceSummary'
import { checkoutStore, clearCheckout } from '../lib/checkoutStore'
import { useStore } from '../lib/useStore'
import {
  addBooking,
  generatePnr,
  type Booking,
} from '../lib/bookingsStore'
import { sessionStore, updateAccount } from '../lib/sessionStore'

function last4(num: string): string {
  return num.replace(/\s+/g, '').slice(-4)
}

function formatCard(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

const fieldLabelCls = 'flex flex-col gap-1.5 text-sm text-grey-900'
const fieldLabelFullCls = `${fieldLabelCls} col-span-full`
const fieldInputCls =
  'font-sans text-[15px] px-3 py-2.5 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-1'

export function PaymentPage() {
  const draft = useStore(checkoutStore)
  const session = useStore(sessionStore)
  const navigate = useNavigate()
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [postcode, setPostcode] = useState('')
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!draft.flight) {
    return (
      <div className="bg-white p-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
        <p>No flight selected.</p>
        <Link
          className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
          to="/"
        >
          Back to home
        </Link>
      </div>
    )
  }

  const total = computeTotal(draft)
  const discount = promoApplied ? Math.round(total * 0.1) : 0
  const finalTotal = Math.max(0, total - discount)

  function onPay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!cardName.trim() || cardNumber.replace(/\s+/g, '').length < 13 || !expiry || cvv.length < 3) {
      setError('Please check your card details.')
      return
    }
    setSubmitting(true)
    window.setTimeout(() => {
      const pnr = generatePnr()
      const booking: Booking = {
        pnr,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        accountEmail: session.account?.email ?? null,
        flight: draft.flight!,
        fareType: draft.fareType,
        passengers: draft.passengers,
        seats: draft.seats,
        extras: draft.extras,
        totalGBP: finalTotal,
        paymentLast4: last4(cardNumber),
        contactEmail: draft.contactEmail,
        contactPhone: draft.contactPhone,
      }
      addBooking(booking)
      if (session.account) {
        updateAccount(a => ({ ...a, rewardsPoints: a.rewardsPoints + Math.round(finalTotal) }))
      }
      clearCheckout()
      navigate(`/book/confirmation?pnr=${pnr}`)
    }, 700)
  }

  function applyPromo() {
    if (promo.trim().toUpperCase() === 'TRIPMA10') {
      setPromoApplied(true)
    } else {
      setPromoApplied(false)
      setError('Promo code not recognised.')
    }
  }

  return (
    <form
      className="grid grid-cols-[1fr_340px] gap-6 items-start max-[900px]:grid-cols-1"
      onSubmit={onPay}
    >
      <section>
        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="mt-0 mb-2 text-xl text-grey-900">Payment</h2>
          <p className="mt-0 mb-4 text-grey-600 text-sm">
            Payments are processed securely. Try card number <code>4111 1111 1111 1111</code>.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <label className={fieldLabelFullCls}>
              <span className="text-grey-600 font-semibold">Name on card</span>
              <input
                className={fieldInputCls}
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                autoComplete="cc-name"
                required
              />
            </label>
            <label className={fieldLabelFullCls}>
              <span className="text-grey-600 font-semibold">Card number</span>
              <input
                className={fieldInputCls}
                value={cardNumber}
                onChange={e => setCardNumber(formatCard(e.target.value))}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                required
              />
            </label>
            <label className={fieldLabelCls}>
              <span className="text-grey-600 font-semibold">Expiry (MM/YY)</span>
              <input
                className={fieldInputCls}
                value={expiry}
                onChange={e => setExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))}
                placeholder="MM/YY"
                autoComplete="cc-exp"
                required
              />
            </label>
            <label className={fieldLabelCls}>
              <span className="text-grey-600 font-semibold">CVV</span>
              <input
                className={fieldInputCls}
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                inputMode="numeric"
                autoComplete="cc-csc"
                required
              />
            </label>
            <label className={fieldLabelFullCls}>
              <span className="text-grey-600 font-semibold">Billing postcode</span>
              <input
                className={fieldInputCls}
                value={postcode}
                onChange={e => setPostcode(e.target.value)}
                autoComplete="postal-code"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="mt-0 mb-2 text-xl text-grey-900">Promo code</h2>
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2.5 border border-grey-200 rounded-sm"
              value={promo}
              onChange={e => setPromo(e.target.value)}
              placeholder="Enter a code (try TRIPMA10)"
            />
            <button
              type="button"
              className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on"
              onClick={applyPromo}
            >
              Apply
            </button>
          </div>
          {promoApplied ? <p className="text-[#15803d] text-sm mt-2 mb-0">10% off applied.</p> : null}
        </div>

        {error ? <p className="text-[#b91c1c] text-sm my-2">{error}</p> : null}
      </section>
      <aside className="sticky top-4">
        <PriceSummary draft={draft}>
          {promoApplied ? (
            <div className="flex justify-between py-1.5 text-sm">
              <span>Promo (TRIPMA10)</span>
              <strong>−£{discount.toLocaleString()}</strong>
            </div>
          ) : null}
          <div className="flex justify-between py-1.5 text-lg pt-3">
            <span>You pay</span>
            <strong className="text-grey-900">£{finalTotal.toLocaleString()}</strong>
          </div>
          <button
            type="submit"
            className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover disabled:cursor-not-allowed disabled:opacity-60 w-full mt-3"
            disabled={submitting}
          >
            {submitting ? 'Processing…' : `Pay £${finalTotal.toLocaleString()}`}
          </button>
          <p className="text-[13px] text-grey-600 my-2">
            By paying you agree to our Terms of service and fare rules.
          </p>
        </PriceSummary>
      </aside>
    </form>
  )
}
