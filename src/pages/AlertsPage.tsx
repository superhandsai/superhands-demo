import { Link } from 'react-router-dom'
import { PageShell } from './PageShell'
import {
  alertsStore,
  removeAlert,
  simulatePriceDrop,
} from '../lib/alertsStore'
import { useStore } from '../lib/useStore'
import { pushToast } from '../lib/toastStore'
import { formatIsoDate } from '../data/flights'
import { addNotification, formatRelativeTime } from '../lib/notificationsStore'

function buildFlightSearchUrl(alert: {
  from: string
  to: string
  depart: string
  returnDate?: string
}): string {
  const params = new URLSearchParams({
    from: alert.from,
    to: alert.to,
    depart: alert.depart,
    adults: '1',
    trip: alert.returnDate ? 'return' : 'one-way',
  })
  if (alert.returnDate) params.set('return', alert.returnDate)
  return `/flights?${params.toString()}`
}

export function AlertsPage() {
  const alerts = useStore(alertsStore)

  function onDrop(id: string) {
    const res = simulatePriceDrop(id)
    if (res) {
      pushToast({
        tone: 'success',
        title: `Price dropped £${res.drop}`,
        body: `New lowest fare £${res.price}`,
      })
      addNotification({
        type: 'deal',
        title: `${res.alert.from} → ${res.alert.to} dropped to £${res.price}`,
        body: `Your watched route is down £${res.drop} from its previous tracked fare.`,
        href: buildFlightSearchUrl(res.alert),
        ctaLabel: 'View flights',
      })
    }
  }

  return (
    <PageShell
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Price alerts' }]}
      title="Price alerts"
      subtitle="We'll email you when watched routes drop in price."
    >
      {alerts.length === 0 ? (
        <div className="bg-white py-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
          <p>No alerts yet. Save a route from the flights results page.</p>
          <Link to="/" className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover">Start a search</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map(a => {
            const change = a.startingPriceGBP - a.currentPriceGBP
            const pct = Math.round((change / a.startingPriceGBP) * 100)
            return (
              <div
                key={a.id}
                className="bg-white border border-grey-200 rounded-[14px] py-[18px] px-[22px] grid grid-cols-[1fr_auto_auto] gap-4 items-center max-[720px]:grid-cols-1 max-[720px]:text-left"
              >
                <div>
                  <h3 className="mt-0 mb-1 text-[17px]">{a.from} → {a.to}</h3>
                  <p className="m-0 text-grey-600 text-sm">
                    {formatIsoDate(a.depart)}
                    {a.returnDate ? ` – ${formatIsoDate(a.returnDate)}` : ''}
                  </p>
                </div>
                <div className="text-right max-[720px]:text-left">
                  <strong className="text-[22px] block text-grey-900">£{a.currentPriceGBP}</strong>
                  <span
                    className={`text-xs ${change > 0 ? 'text-success font-semibold' : 'text-grey-600'}`}
                  >
                    {change > 0 ? `↓ £${change} (${pct}%)` : 'Watching'}
                  </span>
                  {a.lastDropAt && a.lastDropGBP ? (
                    <span className="block text-[11px] text-grey-600 mt-1">
                      Latest drop £{a.lastDropGBP} · {formatRelativeTime(a.lastDropAt)}
                    </span>
                  ) : null}
                </div>
                <div className="flex gap-2 items-center flex-wrap max-[720px]:justify-start">
                  <button
                    type="button"
                    className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => onDrop(a.id)}
                  >
                    Simulate drop
                  </button>
                  <Link
                    to={buildFlightSearchUrl(a)}
                    className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
                  >
                    View flights
                  </Link>
                  <button
                    type="button"
                    className="bg-transparent border-0 p-0 text-purple cursor-pointer hover:underline"
                    onClick={() => removeAlert(a.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
