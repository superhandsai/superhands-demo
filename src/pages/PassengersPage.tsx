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
      <div className="bg-white p-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
        <p>No flight selected. Pick a flight first.</p>
        <Link
          to="/"
          className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
        >
          Back to home
        </Link>
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
    <div className="grid grid-cols-[1fr_340px] gap-6 items-start max-[900px]:grid-cols-1">
      <section>
        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="mt-0 mb-2 text-xl text-grey-900">Contact details</h2>
          <p className="mt-0 mb-4 text-grey-600 text-sm">We'll send your booking confirmation here.</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <label className="flex flex-col gap-1.5 text-sm text-grey-900">
              <span className="text-grey-600 font-semibold">Email</span>
              <input
                className="font-sans text-[15px] px-3 py-2.5 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-1"
                type="email"
                value={draft.contactEmail}
                onChange={e => checkoutStore.set(d => ({ ...d, contactEmail: e.target.value }))}
                required
              />
              {touched && !isValidEmail(draft.contactEmail) ? (
                <span className="text-[#b91c1c] text-[13px]">Enter a valid email address.</span>
              ) : null}
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-grey-900">
              <span className="text-grey-600 font-semibold">Phone</span>
              <input
                className="font-sans text-[15px] px-3 py-2.5 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-1"
                type="tel"
                value={draft.contactPhone}
                onChange={e => checkoutStore.set(d => ({ ...d, contactPhone: e.target.value }))}
                required
              />
              {touched && draft.contactPhone.trim().length < 6 ? (
                <span className="text-[#b91c1c] text-[13px]">Include your country code and number.</span>
              ) : null}
            </label>
          </div>
        </div>

        {draft.passengers.map((p, index) => (
          <div key={p.id} className="bg-white rounded-card p-6 shadow-card mb-4">
            <h2 className="mt-0 mb-2 text-xl text-grey-900">Traveller {index + 1}</h2>
            <p className="mt-0 mb-4 text-grey-600 text-sm">
              Enter names exactly as they appear on the passport.
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              <label className="flex flex-col gap-1.5 text-sm text-grey-900">
                <span className="text-grey-600 font-semibold">First name</span>
                <input
                  className="font-sans text-[15px] px-3 py-2.5 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-1"
                  value={p.firstName}
                  onChange={e => updatePassenger(p.id, { firstName: e.target.value })}
                />
                {touched && !p.firstName.trim() ? (
                  <span className="text-[#b91c1c] text-[13px]">Required</span>
                ) : null}
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-grey-900">
                <span className="text-grey-600 font-semibold">Last name</span>
                <input
                  className="font-sans text-[15px] px-3 py-2.5 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-1"
                  value={p.lastName}
                  onChange={e => updatePassenger(p.id, { lastName: e.target.value })}
                />
                {touched && !p.lastName.trim() ? (
                  <span className="text-[#b91c1c] text-[13px]">Required</span>
                ) : null}
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-grey-900">
                <span className="text-grey-600 font-semibold">Date of birth</span>
                <input
                  className="font-sans text-[15px] px-3 py-2.5 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-1"
                  type="date"
                  value={p.dob}
                  onChange={e => updatePassenger(p.id, { dob: e.target.value })}
                />
                {touched && !p.dob ? <span className="text-[#b91c1c] text-[13px]">Required</span> : null}
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-grey-900">
                <span className="text-grey-600 font-semibold">Passport number (optional)</span>
                <input
                  className="font-sans text-[15px] px-3 py-2.5 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-1"
                  value={p.passportNumber || ''}
                  onChange={e => updatePassenger(p.id, { passportNumber: e.target.value })}
                />
              </label>
            </div>
          </div>
        ))}
      </section>
      <aside className="sticky top-4">
        <PriceSummary
          draft={draft}
          cta={{ label: 'Continue to seats', onClick: onContinue, disabled: false }}
        />
      </aside>
    </div>
  )
}
