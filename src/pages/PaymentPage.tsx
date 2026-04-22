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
      <div className="empty-state">
        <p>No flight selected.</p>
        <Link className="btn btn--primary" to="/">Back to home</Link>
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
    <form className="checkout-layout" onSubmit={onPay}>
      <section className="checkout-main">
        <div className="detail-card">
          <h2>Payment</h2>
          <p className="detail-card__sub">Payments are processed securely. Try card number <code>4111 1111 1111 1111</code>.</p>
          <div className="field-grid">
            <label className="field field--full">
              <span>Name on card</span>
              <input value={cardName} onChange={e => setCardName(e.target.value)} autoComplete="cc-name" required />
            </label>
            <label className="field field--full">
              <span>Card number</span>
              <input
                value={cardNumber}
                onChange={e => setCardNumber(formatCard(e.target.value))}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                required
              />
            </label>
            <label className="field">
              <span>Expiry (MM/YY)</span>
              <input
                value={expiry}
                onChange={e => setExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))}
                placeholder="MM/YY"
                autoComplete="cc-exp"
                required
              />
            </label>
            <label className="field">
              <span>CVV</span>
              <input
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                inputMode="numeric"
                autoComplete="cc-csc"
                required
              />
            </label>
            <label className="field field--full">
              <span>Billing postcode</span>
              <input value={postcode} onChange={e => setPostcode(e.target.value)} autoComplete="postal-code" />
            </label>
          </div>
        </div>

        <div className="detail-card">
          <h2>Promo code</h2>
          <div className="promo-row">
            <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Enter a code (try TRIPMA10)" />
            <button type="button" className="btn btn--secondary" onClick={applyPromo}>Apply</button>
          </div>
          {promoApplied ? <p className="promo-ok">10% off applied.</p> : null}
        </div>

        {error ? <p className="form-error">{error}</p> : null}
      </section>
      <aside className="checkout-side">
        <PriceSummary draft={draft}>
          {promoApplied ? (
            <div className="summary-card__row">
              <span>Promo (TRIPMA10)</span>
              <strong>−£{discount.toLocaleString()}</strong>
            </div>
          ) : null}
          <div className="summary-card__row summary-card__row--total">
            <span>You pay</span>
            <strong>£{finalTotal.toLocaleString()}</strong>
          </div>
          <button
            type="submit"
            className="btn btn--primary summary-card__cta"
            disabled={submitting}
          >
            {submitting ? 'Processing…' : `Pay £${finalTotal.toLocaleString()}`}
          </button>
          <p className="summary-card__small">By paying you agree to our Terms of service and fare rules.</p>
        </PriceSummary>
      </aside>
    </form>
  )
}
