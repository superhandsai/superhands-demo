import { Link, useNavigate } from 'react-router-dom'
import { PriceSummary } from '../components/PriceSummary'
import { checkoutStore } from '../lib/checkoutStore'
import { useStore } from '../lib/useStore'

const MEAL_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'standard', label: 'Standard meal (included)' },
  { value: 'vegetarian', label: 'Vegetarian (+£12)' },
  { value: 'vegan', label: 'Vegan (+£12)' },
  { value: 'halal', label: 'Halal (+£12)' },
  { value: 'kosher', label: 'Kosher (+£12)' },
  { value: 'gluten-free', label: 'Gluten-free (+£12)' },
]

export function ExtrasPage() {
  const draft = useStore(checkoutStore)
  const navigate = useNavigate()

  if (!draft.flight) {
    return (
      <div className="empty-state">
        <p>No flight selected.</p>
        <Link className="btn btn--primary" to="/">Back to home</Link>
      </div>
    )
  }

  function setBags(id: string, n: number) {
    checkoutStore.set(d => ({
      ...d,
      extras: {
        ...d.extras,
        checkedBagsByPassenger: { ...d.extras.checkedBagsByPassenger, [id]: Math.max(0, Math.min(3, n)) },
      },
    }))
  }

  function setMeal(id: string, meal: string) {
    checkoutStore.set(d => ({
      ...d,
      extras: { ...d.extras, mealsByPassenger: { ...d.extras.mealsByPassenger, [id]: meal } },
    }))
  }

  return (
    <div className="checkout-layout">
      <section className="checkout-main">
        <div className="detail-card">
          <h2>Checked bags</h2>
          <p className="detail-card__sub">£30 per bag each way — cheaper than at the airport.</p>
          <div className="extras-rows">
            {draft.passengers.map(p => {
              const n = draft.extras.checkedBagsByPassenger[p.id] ?? 0
              return (
                <div key={p.id} className="extras-row">
                  <div>
                    <strong>{p.firstName || 'Traveller'} {p.lastName}</strong>
                    <span>Max 3 bags · 23kg each</span>
                  </div>
                  <div className="stepper">
                    <button type="button" onClick={() => setBags(p.id, n - 1)} aria-label={`Remove bag for ${p.firstName || 'traveller'}`}>-</button>
                    <strong>{n}</strong>
                    <button type="button" onClick={() => setBags(p.id, n + 1)} aria-label={`Add bag for ${p.firstName || 'traveller'}`}>+</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="detail-card">
          <h2>Meals</h2>
          <p className="detail-card__sub">Pre-order a meal for your longest flight.</p>
          <div className="extras-rows">
            {draft.passengers.map(p => {
              const meal = draft.extras.mealsByPassenger[p.id] ?? 'standard'
              return (
                <div key={p.id} className="extras-row">
                  <div>
                    <strong>{p.firstName || 'Traveller'} {p.lastName}</strong>
                  </div>
                  <select value={meal} onChange={e => setMeal(p.id, e.target.value)}>
                    {MEAL_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </div>

        <div className="detail-card">
          <h2>Trip protection</h2>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={draft.extras.insurance}
              onChange={e => checkoutStore.set(d => ({ ...d, extras: { ...d.extras, insurance: e.target.checked } }))}
            />
            <div>
              <strong>Trip insurance — £24 per traveller</strong>
              <span>Cancel for any reason up to 48 hours before departure.</span>
            </div>
          </label>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={draft.extras.priorityBoarding}
              onChange={e =>
                checkoutStore.set(d => ({ ...d, extras: { ...d.extras, priorityBoarding: e.target.checked } }))
              }
            />
            <div>
              <strong>Priority boarding — £15 per traveller</strong>
              <span>Board first, stow your cabin bag, and settle in early.</span>
            </div>
          </label>
        </div>
      </section>
      <aside className="checkout-side">
        <PriceSummary
          draft={draft}
          cta={{ label: 'Continue to payment', onClick: () => navigate('/book/payment') }}
        />
      </aside>
    </div>
  )
}
