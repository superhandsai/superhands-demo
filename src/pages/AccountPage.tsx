import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { PageShell } from './PageShell'
import {
  sessionStore,
  updateAccount,
  type SavedTraveller,
  type PaymentMethod,
} from '../lib/sessionStore'
import { useStore } from '../lib/useStore'

type Tab = 'profile' | 'travellers' | 'payment' | 'preferences' | 'rewards'

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'profile', label: 'Profile' },
  { id: 'travellers', label: 'Saved travellers' },
  { id: 'payment', label: 'Payment methods' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'rewards', label: 'Rewards' },
]

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function AccountPage() {
  const session = useStore(sessionStore)
  const [tab, setTab] = useState<Tab>('profile')

  if (!session.account) return <Navigate to="/signin" state={{ from: '/account' }} replace />
  const account = session.account

  return (
    <PageShell
      title={`Hi, ${account.firstName}`}
      subtitle={account.email}
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Account' }]}
    >
      <nav className="account-tabs" aria-label="Account sections">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            className={`account-tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'profile' ? <ProfileTab /> : null}
      {tab === 'travellers' ? <TravellersTab /> : null}
      {tab === 'payment' ? <PaymentTab /> : null}
      {tab === 'preferences' ? <PreferencesTab /> : null}
      {tab === 'rewards' ? <RewardsTab /> : null}
    </PageShell>
  )
}

function ProfileTab() {
  const { account } = useStore(sessionStore)
  if (!account) return null
  return (
    <div className="detail-card">
      <h2>Profile</h2>
      <div className="field-grid">
        <label className="field">
          <span>First name</span>
          <input
            value={account.firstName}
            onChange={e => updateAccount(a => ({ ...a, firstName: e.target.value }))}
          />
        </label>
        <label className="field">
          <span>Last name</span>
          <input
            value={account.lastName}
            onChange={e => updateAccount(a => ({ ...a, lastName: e.target.value }))}
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input value={account.email} disabled />
        </label>
        <label className="field">
          <span>Phone</span>
          <input
            value={account.phone ?? ''}
            onChange={e => updateAccount(a => ({ ...a, phone: e.target.value }))}
            autoComplete="tel"
          />
        </label>
      </div>
    </div>
  )
}

function TravellersTab() {
  const { account } = useStore(sessionStore)
  const [draft, setDraft] = useState<Omit<SavedTraveller, 'id'>>({
    firstName: '',
    lastName: '',
    dob: '',
    passportNumber: '',
    passportCountry: '',
  })
  if (!account) return null

  function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!draft.firstName || !draft.lastName || !draft.dob) return
    updateAccount(a => ({ ...a, savedTravellers: [...a.savedTravellers, { id: newId(), ...draft }] }))
    setDraft({ firstName: '', lastName: '', dob: '', passportNumber: '', passportCountry: '' })
  }

  function onRemove(id: string) {
    updateAccount(a => ({ ...a, savedTravellers: a.savedTravellers.filter(t => t.id !== id) }))
  }

  return (
    <>
      <div className="detail-card">
        <h2>Saved travellers</h2>
        {account.savedTravellers.length === 0 ? (
          <p className="detail-card__sub">No saved travellers yet. Add frequent travellers to speed up checkout.</p>
        ) : (
          <ul className="traveller-list">
            {account.savedTravellers.map(t => (
              <li key={t.id}>
                <strong>{t.firstName} {t.lastName}</strong>
                <span>{t.dob}{t.passportNumber ? ` · passport ${t.passportNumber}` : ''}</span>
                <button type="button" className="link-more" onClick={() => onRemove(t.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form className="detail-card" onSubmit={onAdd}>
        <h3>Add a traveller</h3>
        <div className="field-grid">
          <label className="field"><span>First name</span>
            <input value={draft.firstName} onChange={e => setDraft({ ...draft, firstName: e.target.value })} /></label>
          <label className="field"><span>Last name</span>
            <input value={draft.lastName} onChange={e => setDraft({ ...draft, lastName: e.target.value })} /></label>
          <label className="field"><span>Date of birth</span>
            <input type="date" value={draft.dob} onChange={e => setDraft({ ...draft, dob: e.target.value })} /></label>
          <label className="field"><span>Passport number</span>
            <input value={draft.passportNumber ?? ''} onChange={e => setDraft({ ...draft, passportNumber: e.target.value })} /></label>
        </div>
        <button type="submit" className="btn btn--primary">Save traveller</button>
      </form>
    </>
  )
}

function PaymentTab() {
  const { account } = useStore(sessionStore)
  const [draft, setDraft] = useState<Omit<PaymentMethod, 'id'>>({
    brand: 'Visa',
    last4: '',
    expiryMonth: 12,
    expiryYear: 2030,
    nameOnCard: '',
  })
  if (!account) return null

  function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!draft.last4 || !draft.nameOnCard) return
    updateAccount(a => ({ ...a, paymentMethods: [...a.paymentMethods, { id: newId(), ...draft }] }))
    setDraft({ brand: 'Visa', last4: '', expiryMonth: 12, expiryYear: 2030, nameOnCard: '' })
  }

  function onRemove(id: string) {
    updateAccount(a => ({ ...a, paymentMethods: a.paymentMethods.filter(p => p.id !== id) }))
  }

  return (
    <>
      <div className="detail-card">
        <h2>Payment methods</h2>
        {account.paymentMethods.length === 0 ? (
          <p className="detail-card__sub">No cards saved yet.</p>
        ) : (
          <ul className="payment-list">
            {account.paymentMethods.map(p => (
              <li key={p.id}>
                <strong>{p.brand} •••• {p.last4}</strong>
                <span>{p.nameOnCard} · Exp {String(p.expiryMonth).padStart(2, '0')}/{p.expiryYear}</span>
                <button type="button" className="link-more" onClick={() => onRemove(p.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form className="detail-card" onSubmit={onAdd}>
        <h3>Add a card</h3>
        <div className="field-grid">
          <label className="field"><span>Brand</span>
            <select value={draft.brand} onChange={e => setDraft({ ...draft, brand: e.target.value as PaymentMethod['brand'] })}>
              <option>Visa</option><option>Mastercard</option><option>Amex</option>
            </select></label>
          <label className="field"><span>Last 4 digits</span>
            <input value={draft.last4} maxLength={4} onChange={e => setDraft({ ...draft, last4: e.target.value.replace(/\D/g, '').slice(0, 4) })} /></label>
          <label className="field"><span>Name on card</span>
            <input value={draft.nameOnCard} onChange={e => setDraft({ ...draft, nameOnCard: e.target.value })} /></label>
          <label className="field"><span>Exp month</span>
            <input type="number" value={draft.expiryMonth} min={1} max={12} onChange={e => setDraft({ ...draft, expiryMonth: Number(e.target.value) })} /></label>
          <label className="field"><span>Exp year</span>
            <input type="number" value={draft.expiryYear} min={2026} max={2040} onChange={e => setDraft({ ...draft, expiryYear: Number(e.target.value) })} /></label>
        </div>
        <button type="submit" className="btn btn--primary">Save card</button>
      </form>
    </>
  )
}

function PreferencesTab() {
  const { account } = useStore(sessionStore)
  if (!account) return null
  const p = account.preferences
  return (
    <div className="detail-card">
      <h2>Travel preferences</h2>
      <div className="field-grid">
        <label className="field">
          <span>Seat preference</span>
          <select
            value={p.seatPreference}
            onChange={e => updateAccount(a => ({ ...a, preferences: { ...a.preferences, seatPreference: e.target.value as typeof p.seatPreference } }))}
          >
            <option value="no-preference">No preference</option>
            <option value="window">Window</option>
            <option value="aisle">Aisle</option>
          </select>
        </label>
        <label className="field">
          <span>Meal preference</span>
          <select
            value={p.mealPreference}
            onChange={e => updateAccount(a => ({ ...a, preferences: { ...a.preferences, mealPreference: e.target.value as typeof p.mealPreference } }))}
          >
            <option value="standard">Standard</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="halal">Halal</option>
            <option value="kosher">Kosher</option>
            <option value="gluten-free">Gluten-free</option>
          </select>
        </label>
      </div>
      <label className="toggle-row">
        <input
          type="checkbox"
          checked={p.newsletter}
          onChange={e => updateAccount(a => ({ ...a, preferences: { ...a.preferences, newsletter: e.target.checked } }))}
        />
        <div>
          <strong>Tripma newsletter</strong>
          <span>Monthly picks and occasional deals. Unsubscribe any time.</span>
        </div>
      </label>
      <label className="toggle-row">
        <input
          type="checkbox"
          checked={p.priceAlerts}
          onChange={e => updateAccount(a => ({ ...a, preferences: { ...a.preferences, priceAlerts: e.target.checked } }))}
        />
        <div>
          <strong>Price alerts</strong>
          <span>We'll email when your watched routes drop in price.</span>
        </div>
      </label>
    </div>
  )
}

function RewardsTab() {
  const { account } = useStore(sessionStore)
  if (!account) return null
  const points = account.rewardsPoints
  const tier = points > 5000 ? 'Gold' : points > 1500 ? 'Silver' : 'Blue'
  return (
    <div className="detail-card rewards-card">
      <h2>Tripma Rewards</h2>
      <p className="rewards-card__tier">Current tier · <strong>{tier}</strong></p>
      <p className="rewards-card__points">
        <strong>{points.toLocaleString()}</strong> points
      </p>
      <p className="detail-card__sub">Earn 1 point per £1 spent. Redeem on future bookings or upgrade to Flex.</p>
    </div>
  )
}
