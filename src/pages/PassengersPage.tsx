import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PriceSummary } from '../components/PriceSummary'
import { checkoutStore, type CheckoutDraft } from '../lib/checkoutStore'
import { useStore } from '../lib/useStore'
import type { PassengerDetails } from '../lib/bookingsStore'
import { sessionStore } from '../lib/sessionStore'

function isValidEmail(v: string) {
  return /\S+@\S+\.\S+/.test(v)
}

export function PassengersPage() {
  const draft = useStore(checkoutStore)
  const session = useStore(sessionStore)
  const navigate = useNavigate()
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (draft.contactEmail === '' && session.account?.email) {
      checkoutStore.set(d => ({ ...d, contactEmail: session.account!.email }))
    }
  }, [draft.contactEmail, session.account])

  if (!draft.flight) {
    return (
      <div className="empty-state">
        <p>No flight selected. Pick a flight first.</p>
        <Link to="/" className="btn btn--primary">Back to home</Link>
      </div>
    )
  }

  function updatePassenger(id: string, patch: Partial<PassengerDetails>) {
    checkoutStore.set((d: CheckoutDraft) => ({
      ...d,
      passengers: d.passengers.map(p => (p.id === id ? { ...p, ...patch } : p)),
    }))
  }

  const allComplete = draft.passengers.every(p => p.firstName.trim() && p.lastName.trim() && p.dob)
  const contactOk = isValidEmail(draft.contactEmail) && draft.contactPhone.trim().length >= 6

  function onContinue() {
    setTouched(true)
    if (!allComplete || !contactOk) return
    navigate('/book/seats')
  }

  return (
    <div className="checkout-layout">
      <section className="checkout-main">
        <div className="detail-card">
          <h2>Contact details</h2>
          <p className="detail-card__sub">We'll send your booking confirmation here.</p>
          <div className="field-grid">
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={draft.contactEmail}
                onChange={e => checkoutStore.set(d => ({ ...d, contactEmail: e.target.value }))}
                required
              />
              {touched && !isValidEmail(draft.contactEmail) ? (
                <span className="field-error">Enter a valid email address.</span>
              ) : null}
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                type="tel"
                value={draft.contactPhone}
                onChange={e => checkoutStore.set(d => ({ ...d, contactPhone: e.target.value }))}
                required
              />
              {touched && draft.contactPhone.trim().length < 6 ? (
                <span className="field-error">Include your country code and number.</span>
              ) : null}
            </label>
          </div>
        </div>

        {draft.passengers.map((p, index) => (
          <div key={p.id} className="detail-card">
            <h2>Traveller {index + 1}</h2>
            <p className="detail-card__sub">
              Enter names exactly as they appear on the passport.
            </p>
            <div className="field-grid">
              <label className="field">
                <span>First name</span>
                <input
                  value={p.firstName}
                  onChange={e => updatePassenger(p.id, { firstName: e.target.value })}
                />
                {touched && !p.firstName.trim() ? (
                  <span className="field-error">Required</span>
                ) : null}
              </label>
              <label className="field">
                <span>Last name</span>
                <input
                  value={p.lastName}
                  onChange={e => updatePassenger(p.id, { lastName: e.target.value })}
                />
                {touched && !p.lastName.trim() ? (
                  <span className="field-error">Required</span>
                ) : null}
              </label>
              <label className="field">
                <span>Date of birth</span>
                <input
                  type="date"
                  value={p.dob}
                  onChange={e => updatePassenger(p.id, { dob: e.target.value })}
                />
                {touched && !p.dob ? <span className="field-error">Required</span> : null}
              </label>
              <label className="field">
                <span>Passport number (optional)</span>
                <input
                  value={p.passportNumber || ''}
                  onChange={e => updatePassenger(p.id, { passportNumber: e.target.value })}
                />
              </label>
            </div>
          </div>
        ))}
      </section>
      <aside className="checkout-side">
        <PriceSummary
          draft={draft}
          cta={{ label: 'Continue to seats', onClick: onContinue, disabled: false }}
        />
      </aside>
    </div>
  )
}
