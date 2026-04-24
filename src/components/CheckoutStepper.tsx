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
    <ol className="list-none p-0 m-0 mb-4 flex gap-2 overflow-x-auto" aria-label="Checkout progress">
      {STEPS.map((s, i) => {
        const active = i === index
        const complete = i < index
        const linkColor = active ? 'text-purple' : 'text-grey-600'
        const numBg = active
          ? 'bg-purple text-white'
          : complete
            ? 'bg-purple-on text-purple'
            : 'bg-grey-200 text-grey-900'
        return (
          <li key={s.key} className="flex-1 min-w-[120px]">
            <NavLink
              to={s.to}
              className={`flex items-center gap-2 py-[10px] px-3 bg-white rounded-card font-semibold text-sm no-underline shadow-card ${linkColor}`}
            >
              <span
                className={`w-6 h-6 rounded-full grid place-items-center text-[13px] ${numBg}`}
                aria-hidden
              >
                {i + 1}
              </span>
              <span>{s.label}</span>
            </NavLink>
          </li>
        )
      })}
    </ol>
  )
}
