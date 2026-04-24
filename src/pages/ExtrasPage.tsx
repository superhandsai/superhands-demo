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
      <div className="bg-white py-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
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
    <div className="grid grid-cols-[1fr_340px] gap-6 items-start max-[900px]:grid-cols-1">
      <section>
        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="m-0 mb-2 text-xl text-grey-900">Checked bags</h2>
          <p className="mt-0 mb-4 text-grey-600 text-sm">£30 per bag each way — cheaper than at the airport.</p>
          <div className="flex flex-col gap-3">
            {draft.passengers.map(p => {
              const n = draft.extras.checkedBagsByPassenger[p.id] ?? 0
              return (
                <div key={p.id} className="flex justify-between items-center py-3 border-t border-grey-200 gap-3">
                  <div>
                    <strong className="block text-grey-900">{p.firstName || 'Traveller'} {p.lastName}</strong>
                    <span className="text-xs text-grey-600">Max 3 bags · 23kg each</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 border border-grey-200 rounded-full bg-white cursor-pointer text-base text-grey-900"
                      onClick={() => setBags(p.id, n - 1)}
                      aria-label={`Remove bag for ${p.firstName || 'traveller'}`}
                    >
                      -
                    </button>
                    <strong className="min-w-[20px] text-center">{n}</strong>
                    <button
                      type="button"
                      className="w-8 h-8 border border-grey-200 rounded-full bg-white cursor-pointer text-base text-grey-900"
                      onClick={() => setBags(p.id, n + 1)}
                      aria-label={`Add bag for ${p.firstName || 'traveller'}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="m-0 mb-2 text-xl text-grey-900">Meals</h2>
          <p className="mt-0 mb-4 text-grey-600 text-sm">Pre-order a meal for your longest flight.</p>
          <div className="flex flex-col gap-3">
            {draft.passengers.map(p => {
              const meal = draft.extras.mealsByPassenger[p.id] ?? 'standard'
              return (
                <div key={p.id} className="flex justify-between items-center py-3 border-t border-grey-200 gap-3">
                  <div>
                    <strong className="block text-grey-900">{p.firstName || 'Traveller'} {p.lastName}</strong>
                  </div>
                  <select
                    value={meal}
                    onChange={e => setMeal(p.id, e.target.value)}
                    className="p-2 rounded-sm border border-grey-200"
                  >
                    {MEAL_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="m-0 mb-2 text-xl text-grey-900">Trip protection</h2>
          <label className="flex gap-3 items-start py-3 border-t border-grey-200">
            <input
              type="checkbox"
              checked={draft.extras.insurance}
              onChange={e => checkoutStore.set(d => ({ ...d, extras: { ...d.extras, insurance: e.target.checked } }))}
              className="mt-[3px]"
            />
            <div>
              <strong className="block text-grey-900">Trip insurance — £24 per traveller</strong>
              <span className="text-grey-600 text-sm">Cancel for any reason up to 48 hours before departure.</span>
            </div>
          </label>
          <label className="flex gap-3 items-start py-3 border-t border-grey-200">
            <input
              type="checkbox"
              checked={draft.extras.priorityBoarding}
              onChange={e =>
                checkoutStore.set(d => ({ ...d, extras: { ...d.extras, priorityBoarding: e.target.checked } }))
              }
              className="mt-[3px]"
            />
            <div>
              <strong className="block text-grey-900">Priority boarding — £15 per traveller</strong>
              <span className="text-grey-600 text-sm">Board first, stow your cabin bag, and settle in early.</span>
            </div>
          </label>
        </div>
      </section>
      <aside className="sticky top-4">
        <PriceSummary
          draft={draft}
          cta={{ label: 'Continue to payment', onClick: () => navigate('/book/payment') }}
        />
      </aside>
    </div>
  )
}
