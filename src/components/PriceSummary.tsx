import { FARE_PRICING, type CheckoutDraft } from '../lib/checkoutStore'

const BAG_FEE = 30
const MEAL_FEE = 12
const INSURANCE_FEE = 24
const PRIORITY_FEE = 15

export function computeTotal(draft: CheckoutDraft): number {
  if (!draft.flight) return 0
  const pax = draft.passengerCount.adults + draft.passengerCount.children
  const fare = FARE_PRICING[draft.fareType]
  const base = Math.round(draft.flight.priceGBP * fare.multiplier) * pax

  const bags = Object.values(draft.extras.checkedBagsByPassenger).reduce((s, n) => s + n, 0) * BAG_FEE
  const meals = Object.values(draft.extras.mealsByPassenger).filter(v => v && v !== 'standard').length * MEAL_FEE
  const insurance = draft.extras.insurance ? INSURANCE_FEE * pax : 0
  const priority = draft.extras.priorityBoarding ? PRIORITY_FEE * pax : 0

  return base + bags + meals + insurance + priority
}

export interface PriceSummaryProps {
  draft: CheckoutDraft
  cta?: { label: string; onClick: () => void; disabled?: boolean }
  children?: React.ReactNode
}

export function PriceSummary({ draft, cta, children }: PriceSummaryProps) {
  if (!draft.flight) {
    return (
      <div className="summary-card">
        <h3>Summary</h3>
        <p className="summary-card__small">No flight selected yet.</p>
      </div>
    )
  }
  const pax = draft.passengerCount.adults + draft.passengerCount.children
  const fare = FARE_PRICING[draft.fareType]
  const perPerson = Math.round(draft.flight.priceGBP * fare.multiplier)
  const base = perPerson * pax
  const bagCount = Object.values(draft.extras.checkedBagsByPassenger).reduce((s, n) => s + n, 0)
  const mealCount = Object.values(draft.extras.mealsByPassenger).filter(v => v && v !== 'standard').length
  const total = computeTotal(draft)
  const first = draft.flight.outbound[0]
  const last = draft.flight.outbound[draft.flight.outbound.length - 1]

  return (
    <div className="summary-card">
      <h3>Summary</h3>
      <p className="summary-card__route">
        {first.from} → {last.to}
      </p>
      <p className="summary-card__small">{fare.label} · {pax} traveller{pax > 1 ? 's' : ''}</p>
      <hr />
      <div className="summary-card__row">
        <span>Fare ({pax} × £{perPerson})</span>
        <strong>£{base.toLocaleString()}</strong>
      </div>
      {bagCount > 0 ? (
        <div className="summary-card__row">
          <span>Checked bags ({bagCount})</span>
          <strong>£{(bagCount * BAG_FEE).toLocaleString()}</strong>
        </div>
      ) : null}
      {mealCount > 0 ? (
        <div className="summary-card__row">
          <span>Special meals ({mealCount})</span>
          <strong>£{(mealCount * MEAL_FEE).toLocaleString()}</strong>
        </div>
      ) : null}
      {draft.extras.insurance ? (
        <div className="summary-card__row">
          <span>Trip insurance ({pax})</span>
          <strong>£{(INSURANCE_FEE * pax).toLocaleString()}</strong>
        </div>
      ) : null}
      {draft.extras.priorityBoarding ? (
        <div className="summary-card__row">
          <span>Priority boarding</span>
          <strong>£{(PRIORITY_FEE * pax).toLocaleString()}</strong>
        </div>
      ) : null}
      <hr />
      <div className="summary-card__row summary-card__row--total">
        <span>Total</span>
        <strong>£{total.toLocaleString()}</strong>
      </div>
      {cta ? (
        <button
          type="button"
          className="btn btn--primary summary-card__cta"
          onClick={cta.onClick}
          disabled={cta.disabled}
        >
          {cta.label}
        </button>
      ) : null}
      {children}
    </div>
  )
}
