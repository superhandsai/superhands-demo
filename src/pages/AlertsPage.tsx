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
    }
  }

  return (
    <PageShell
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Price alerts' }]}
      title="Price alerts"
      subtitle="We'll email you when watched routes drop in price."
    >
      {alerts.length === 0 ? (
        <div className="empty-state">
          <p>No alerts yet. Save a route from the flights results page.</p>
          <Link to="/" className="btn btn--primary">Start a search</Link>
        </div>
      ) : (
        <div className="alert-list">
          {alerts.map(a => {
            const change = a.startingPriceGBP - a.currentPriceGBP
            const pct = Math.round((change / a.startingPriceGBP) * 100)
            return (
              <div key={a.id} className="alert-card">
                <div>
                  <h3>{a.from} → {a.to}</h3>
                  <p>
                    {formatIsoDate(a.depart)}
                    {a.returnDate ? ` – ${formatIsoDate(a.returnDate)}` : ''}
                  </p>
                </div>
                <div className="alert-card__price">
                  <strong>£{a.currentPriceGBP}</strong>
                  <span
                    className={`alert-card__change ${change > 0 ? 'is-drop' : ''}`}
                  >
                    {change > 0 ? `↓ £${change} (${pct}%)` : 'Watching'}
                  </span>
                </div>
                <div className="alert-card__actions">
                  <button type="button" className="btn btn--secondary" onClick={() => onDrop(a.id)}>
                    Simulate drop
                  </button>
                  <Link
                    to={`/flights?from=${a.from}&to=${a.to}&depart=${a.depart}${a.returnDate ? `&return=${a.returnDate}` : ''}&adults=1&trip=${a.returnDate ? 'return' : 'oneway'}`}
                    className="btn btn--primary"
                  >
                    View flights
                  </Link>
                  <button type="button" className="link-more" onClick={() => removeAlert(a.id)}>
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
