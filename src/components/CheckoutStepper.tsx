import { NavLink } from 'react-router-dom'

export interface CheckoutStep {
  key: string
  label: string
  to: string
}

const STEPS: CheckoutStep[] = [
  { key: 'passengers', label: 'Passengers', to: '/book/passengers' },
  { key: 'seats', label: 'Seats', to: '/book/seats' },
  { key: 'extras', label: 'Extras', to: '/book/extras' },
  { key: 'payment', label: 'Payment', to: '/book/payment' },
]

export function CheckoutStepper({ current }: { current: string }) {
  const index = STEPS.findIndex(s => s.key === current)
  return (
    <ol className="checkout-stepper" aria-label="Checkout progress">
      {STEPS.map((s, i) => {
        const active = i === index
        const complete = i < index
        return (
          <li
            key={s.key}
            className={`checkout-stepper__item ${active ? 'is-active' : ''} ${complete ? 'is-complete' : ''}`}
          >
            <NavLink to={s.to} className="checkout-stepper__link">
              <span className="checkout-stepper__num" aria-hidden>{i + 1}</span>
              <span>{s.label}</span>
            </NavLink>
          </li>
        )
      })}
    </ol>
  )
}
