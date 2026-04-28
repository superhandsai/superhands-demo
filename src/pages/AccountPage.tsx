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
import { pushToast } from '../lib/toastStore'

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

const DETAIL_CARD = 'bg-white rounded-card p-6 shadow-card mb-4'
const DETAIL_CARD_SUB = 'mt-0 mb-4 text-grey-600 text-sm'
const FIELD = 'flex flex-col gap-1.5 text-sm text-grey-900'
const FIELD_SPAN = 'text-grey-600 font-semibold'
const FIELD_INPUT = 'font-sans text-[15px] py-2.5 px-3 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-[1px]'
const FIELD_GRID = 'grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4'
const BTN_PRIMARY = 'font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover disabled:cursor-not-allowed disabled:opacity-60'
const LINK_MORE = 'self-start mt-1 bg-transparent border-0 text-purple cursor-pointer p-0 text-xs'
const TOGGLE_ROW = 'flex gap-3 items-start py-3 border-t border-grey-200'

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
      <nav className="flex gap-2 mb-4 overflow-x-auto" aria-label="Account sections">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            className={`py-2.5 px-4 rounded-card cursor-pointer font-sans font-semibold border ${
              tab === t.id
                ? 'bg-purple text-white border-purple'
                : 'bg-white border-grey-200 text-grey-600'
            }`}
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
    <div className={DETAIL_CARD}>
      <h2 className="m-0 mb-2 text-xl text-grey-900">Profile</h2>
      <div className={FIELD_GRID}>
        <label className={FIELD}>
          <span className={FIELD_SPAN}>First name</span>
          <input
            className={FIELD_INPUT}
            value={account.firstName}
            onChange={e => updateAccount(a => ({ ...a, firstName: e.target.value }))}
          />
        </label>
        <label className={FIELD}>
          <span className={FIELD_SPAN}>Last name</span>
          <input
            className={FIELD_INPUT}
            value={account.lastName}
            onChange={e => updateAccount(a => ({ ...a, lastName: e.target.value }))}
          />
        </label>
        <label className={FIELD}>
          <span className={FIELD_SPAN}>Email</span>
          <input className={FIELD_INPUT} value={account.email} disabled />
        </label>
        <label className={FIELD}>
          <span className={FIELD_SPAN}>Phone</span>
          <input
            className={FIELD_INPUT}
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
      <div className={DETAIL_CARD}>
        <h2 className="m-0 mb-2 text-xl text-grey-900">Saved travellers</h2>
        {account.savedTravellers.length === 0 ? (
          <p className={DETAIL_CARD_SUB}>No saved travellers yet. Add frequent travellers to speed up checkout.</p>
        ) : (
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {account.savedTravellers.map(t => (
              <li key={t.id} className="flex flex-col py-2.5 border-b border-grey-200">
                <strong className="text-grey-900">{t.firstName} {t.lastName}</strong>
                <span className="text-grey-600 text-xs">{t.dob}{t.passportNumber ? ` · passport ${t.passportNumber}` : ''}</span>
                <button type="button" className={LINK_MORE} onClick={() => onRemove(t.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form className={DETAIL_CARD} onSubmit={onAdd}>
        <h3 className="mt-4 mb-2 text-base text-grey-900">Add a traveller</h3>
        <div className={FIELD_GRID}>
          <label className={FIELD}><span className={FIELD_SPAN}>First name</span>
            <input className={FIELD_INPUT} value={draft.firstName} onChange={e => setDraft({ ...draft, firstName: e.target.value })} /></label>
          <label className={FIELD}><span className={FIELD_SPAN}>Last name</span>
            <input className={FIELD_INPUT} value={draft.lastName} onChange={e => setDraft({ ...draft, lastName: e.target.value })} /></label>
          <label className={FIELD}><span className={FIELD_SPAN}>Date of birth</span>
            <input className={FIELD_INPUT} type="date" value={draft.dob} onChange={e => setDraft({ ...draft, dob: e.target.value })} /></label>
          <label className={FIELD}><span className={FIELD_SPAN}>Passport number</span>
            <input className={FIELD_INPUT} value={draft.passportNumber ?? ''} onChange={e => setDraft({ ...draft, passportNumber: e.target.value })} /></label>
        </div>
        <button type="submit" className={BTN_PRIMARY}>Save traveller</button>
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
      <div className={DETAIL_CARD}>
        <h2 className="m-0 mb-2 text-xl text-grey-900">Payment methods</h2>
        {account.paymentMethods.length === 0 ? (
          <p className={DETAIL_CARD_SUB}>No cards saved yet.</p>
        ) : (
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {account.paymentMethods.map(p => (
              <li key={p.id} className="flex flex-col py-2.5 border-b border-grey-200">
                <strong className="text-grey-900">{p.brand} •••• {p.last4}</strong>
                <span className="text-grey-600 text-xs">{p.nameOnCard} · Exp {String(p.expiryMonth).padStart(2, '0')}/{p.expiryYear}</span>
                <button type="button" className={LINK_MORE} onClick={() => onRemove(p.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form className={DETAIL_CARD} onSubmit={onAdd}>
        <h3 className="mt-4 mb-2 text-base text-grey-900">Add a card</h3>
        <div className={FIELD_GRID}>
          <label className={FIELD}><span className={FIELD_SPAN}>Brand</span>
            <select className={FIELD_INPUT} value={draft.brand} onChange={e => setDraft({ ...draft, brand: e.target.value as PaymentMethod['brand'] })}>
              <option>Visa</option><option>Mastercard</option><option>Amex</option>
            </select></label>
          <label className={FIELD}><span className={FIELD_SPAN}>Last 4 digits</span>
            <input className={FIELD_INPUT} value={draft.last4} maxLength={4} onChange={e => setDraft({ ...draft, last4: e.target.value.replace(/\D/g, '').slice(0, 4) })} /></label>
          <label className={FIELD}><span className={FIELD_SPAN}>Name on card</span>
            <input className={FIELD_INPUT} value={draft.nameOnCard} onChange={e => setDraft({ ...draft, nameOnCard: e.target.value })} /></label>
          <label className={FIELD}><span className={FIELD_SPAN}>Exp month</span>
            <input className={FIELD_INPUT} type="number" value={draft.expiryMonth} min={1} max={12} onChange={e => setDraft({ ...draft, expiryMonth: Number(e.target.value) })} /></label>
          <label className={FIELD}><span className={FIELD_SPAN}>Exp year</span>
            <input className={FIELD_INPUT} type="number" value={draft.expiryYear} min={2026} max={2040} onChange={e => setDraft({ ...draft, expiryYear: Number(e.target.value) })} /></label>
        </div>
        <button type="submit" className={BTN_PRIMARY}>Save card</button>
      </form>
    </>
  )
}

function PreferencesTab() {
  const { account } = useStore(sessionStore)
  if (!account) return null
  const p = account.preferences
  return (
    <div className={DETAIL_CARD}>
      <h2 className="m-0 mb-2 text-xl text-grey-900">Travel preferences</h2>
      <div className={FIELD_GRID}>
        <label className={FIELD}>
          <span className={FIELD_SPAN}>Seat preference</span>
          <select
            className={FIELD_INPUT}
            value={p.seatPreference}
            onChange={e => updateAccount(a => ({ ...a, preferences: { ...a.preferences, seatPreference: e.target.value as typeof p.seatPreference } }))}
          >
            <option value="no-preference">No preference</option>
            <option value="window">Window</option>
            <option value="aisle">Aisle</option>
          </select>
        </label>
        <label className={FIELD}>
          <span className={FIELD_SPAN}>Meal preference</span>
          <select
            className={FIELD_INPUT}
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
      <label className={TOGGLE_ROW}>
        <input
          type="checkbox"
          className="mt-[3px]"
          checked={p.newsletter}
          onChange={e => updateAccount(a => ({ ...a, preferences: { ...a.preferences, newsletter: e.target.checked } }))}
        />
        <div>
          <strong className="block text-grey-900">Tripma newsletter</strong>
          <span className="text-grey-600 text-sm">Monthly picks and occasional deals. Unsubscribe any time.</span>
        </div>
      </label>
      <label className={TOGGLE_ROW}>
        <input
          type="checkbox"
          className="mt-[3px]"
          checked={p.priceAlerts}
          onChange={e => updateAccount(a => ({ ...a, preferences: { ...a.preferences, priceAlerts: e.target.checked } }))}
        />
        <div>
          <strong className="block text-grey-900">Price alerts</strong>
          <span className="text-grey-600 text-sm">We'll email when your watched routes drop in price.</span>
        </div>
      </label>
    </div>
  )
}

interface RedemptionOption {
  id: string
  title: string
  body: string
  cost: number
}

const REDEMPTIONS: RedemptionOption[] = [
  { id: 'voucher-10', title: '£10 travel voucher', body: 'Apply to any future booking at checkout.', cost: 500 },
  { id: 'bag-waiver', title: 'Free checked bag', body: 'One-time waiver on a future flight.', cost: 1000 },
  { id: 'lounge', title: 'Lounge day pass', body: 'Access to 800+ airport lounges worldwide.', cost: 2500 },
  { id: 'seat-upgrade', title: 'Seat upgrade', body: 'Upgrade one leg to Premium on your next trip.', cost: 3500 },
]

const TIERS = [
  { name: 'Blue', min: 0, perks: ['Earn 1 point per £1', 'Exclusive member fares'] },
  { name: 'Silver', min: 1500, perks: ['Priority check-in', 'Free seat selection'] },
  { name: 'Gold', min: 5000, perks: ['Lounge access (2/yr)', 'Complimentary upgrades'] },
]

function RewardsTab() {
  const { account } = useStore(sessionStore)
  const [redeemed, setRedeemed] = useState<string | null>(null)
  if (!account) return null
  const points = account.rewardsPoints
  const currentIdx = TIERS.reduce((i, t, idx) => (points >= t.min ? idx : i), 0)
  const current = TIERS[currentIdx]
  const next = TIERS[currentIdx + 1]
  const progress = next
    ? Math.min(1, (points - current.min) / (next.min - current.min))
    : 1

  function onRedeem(item: RedemptionOption) {
    if (points < item.cost) return
    updateAccount(a => ({ ...a, rewardsPoints: a.rewardsPoints - item.cost }))
    setRedeemed(item.id)
    pushToast({
      tone: 'success',
      title: `${item.title} redeemed`,
      body: `−${item.cost.toLocaleString()} points · Added to your wallet`,
    })
    window.setTimeout(() => setRedeemed(null), 3000)
  }

  return (
    <>
      <div className={DETAIL_CARD}>
        <h2 className="m-0 mb-2 text-xl text-grey-900">Tripma Rewards</h2>
        <p className="text-sm text-grey-600">Current tier · <strong>{current.name}</strong></p>
        <p>
          <strong className="text-[40px] text-purple">{points.toLocaleString()}</strong> points
        </p>
        <div className="bg-white border border-grey-200 rounded-[14px] py-5 px-6">
          {next ? (
            <>
              <strong>{(next.min - points).toLocaleString()} points to {next.name}</strong>
              <div className="h-2 bg-grey-200 rounded-full overflow-hidden my-3 mb-2">
                <div
                  className="h-full bg-tier-fill"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-grey-600">
                <span>{current.name} · {current.min.toLocaleString()}</span>
                <span>{next.name} · {next.min.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <strong>You've reached our top tier. Thank you!</strong>
          )}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mt-4">
            {TIERS.flatMap(t => t.perks.map(p => ({ t, p }))).map(({ t, p }) => (
              <div
                key={`${t.name}-${p}`}
                className={`bg-grey-100 py-3 px-3.5 rounded-[10px] text-xs ${
                  points < t.min ? 'text-grey-400' : 'text-grey-900'
                }`}
              >
                <strong>{t.name}</strong>
                <div>{p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={DETAIL_CARD}>
        <h2 className="m-0 mb-2 text-xl text-grey-900">Redeem points</h2>
        <p className={DETAIL_CARD_SUB}>Spend points on travel perks. Redemptions are added to your wallet.</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 mt-4">
          {REDEMPTIONS.map(item => {
            const affordable = points >= item.cost
            return (
              <div
                key={item.id}
                className="bg-white border border-grey-200 rounded-[14px] py-[18px] px-5 flex flex-col gap-1.5"
              >
                <h4 className="m-0 text-[15px] text-grey-900">{item.title}</h4>
                <p className="m-0 text-grey-600 text-xs">{item.body}</p>
                <p className="font-bold text-purple">{item.cost.toLocaleString()} points</p>
                <button
                  type="button"
                  className={`${BTN_PRIMARY} mt-2`}
                  disabled={!affordable}
                  onClick={() => onRedeem(item)}
                >
                  {redeemed === item.id ? 'Added ✓' : affordable ? 'Redeem' : 'Not enough points'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
