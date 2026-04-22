import { Link } from 'react-router-dom'
import { PageShell } from './PageShell'
import { savedStore, toggleSavedFlight, toggleSavedStay } from '../lib/savedStore'
import { useStore } from '../lib/useStore'
import { formatIsoDate } from '../data/flights'
import { pushToast } from '../lib/toastStore'

export function SavedPage() {
  const { flights, stays } = useStore(savedStore)

  if (flights.length === 0 && stays.length === 0) {
    return (
      <PageShell
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Saved' }]}
        title="Saved"
        subtitle="Tap the heart on any flight or stay to save it here."
      >
        <div className="empty-state">
          <p>Nothing saved yet.</p>
          <Link to="/" className="btn btn--primary">Start exploring</Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Saved' }]}
      title="Saved"
      subtitle={`${flights.length} flight${flights.length === 1 ? '' : 's'} · ${stays.length} stay${stays.length === 1 ? '' : 's'}`}
    >
      {flights.length > 0 ? (
        <div className="detail-card">
          <h2>Flights</h2>
          <ul className="traveller-list">
            {flights.map(f => (
              <li key={f.id}>
                <div>
                  <strong>{f.from} → {f.to}</strong>
                  <span>{formatIsoDate(f.depart)}{f.returnDate ? ` – ${formatIsoDate(f.returnDate)}` : ''} · {f.carrier} · £{f.priceGBP}</span>
                </div>
                <Link className="btn btn--secondary" to={`/flights?from=${f.from}&to=${f.to}&depart=${f.depart}${f.returnDate ? `&return=${f.returnDate}` : ''}&adults=1&trip=${f.returnDate ? 'return' : 'oneway'}`}>View</Link>
                <button
                  type="button"
                  className="link-more"
                  onClick={() => {
                    toggleSavedFlight(f)
                    pushToast({ tone: 'info', title: 'Removed from saved', body: `${f.from} → ${f.to}` })
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {stays.length > 0 ? (
        <div className="detail-card">
          <h2>Stays</h2>
          <ul className="traveller-list">
            {stays.map(s => (
              <li key={s.id}>
                <div>
                  <strong>{s.name}</strong>
                  <span>{s.location} · £{s.nightlyGBP}/night</span>
                </div>
                <Link className="btn btn--secondary" to={`/stays/${s.id}`}>View</Link>
                <button
                  type="button"
                  className="link-more"
                  onClick={() => {
                    toggleSavedStay(s)
                    pushToast({ tone: 'info', title: 'Removed from saved', body: s.name })
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </PageShell>
  )
}
