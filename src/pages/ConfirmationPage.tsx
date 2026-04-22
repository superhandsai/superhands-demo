import { Link, useSearchParams } from 'react-router-dom'
import { PageShell } from './PageShell'
import { bookingsStore } from '../lib/bookingsStore'
import { useStore } from '../lib/useStore'
import { formatDurationMins, formatIsoDate } from '../data/flights'

export function ConfirmationPage() {
  const [params] = useSearchParams()
  const pnr = params.get('pnr') || ''
  const bookings = useStore(bookingsStore)
  const booking = bookings.find(b => b.pnr === pnr) ?? null

  if (!booking) {
    return (
      <PageShell
        title="Booking not found"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Confirmation' }]}
      >
        <div className="empty-state">
          <p>We couldn't find a booking with that reference. Head to My Trips to find yours.</p>
          <Link className="btn btn--primary" to="/trips">Go to My Trips</Link>
        </div>
      </PageShell>
    )
  }

  const first = booking.flight.outbound[0]
  const last = booking.flight.outbound[booking.flight.outbound.length - 1]

  return (
    <PageShell
      title="You're going!"
      subtitle={`Booking confirmed — reference ${booking.pnr}`}
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Confirmation' }]}
    >
      <div className="confirmation">
        <div className="confirmation__hero">
          <p className="confirmation__pnr">
            <span>Reference</span>
            <strong>{booking.pnr}</strong>
          </p>
          <p className="confirmation__msg">
            We've emailed your itinerary to <strong>{booking.contactEmail}</strong>.
          </p>
        </div>

        <div className="detail-card">
          <h2>Itinerary</h2>
          <p className="detail-card__sub">
            {first.from} → {last.to} · {formatIsoDate(first.departDate)}
            {booking.flight.return ? ` · Return ${formatIsoDate(booking.flight.return[0].departDate)}` : ''}
          </p>
          <div className="itin-grid">
            {booking.flight.outbound.map((s, i) => (
              <div key={`o-${i}`} className="itin-row">
                <div>
                  <strong>{s.departTime}</strong>
                  <span>{formatIsoDate(s.departDate)} · {s.from}</span>
                </div>
                <span className="itin-dur">{formatDurationMins(s.durationMins)}</span>
                <div>
                  <strong>{s.arriveTime}</strong>
                  <span>{formatIsoDate(s.arriveDate)} · {s.to}</span>
                </div>
                <span className="itin-carrier">{s.carrier} {s.flightNumber}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-card">
          <h2>Travellers</h2>
          <ul className="traveller-list">
            {booking.passengers.map(p => (
              <li key={p.id}>
                <strong>{p.firstName} {p.lastName}</strong>
                <span>
                  {booking.seats.filter(s => s.passengerId === p.id).map(s => s.seat).join(', ') || 'Seat at check-in'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-card">
          <h2>Payment</h2>
          <p>Paid £{booking.totalGBP.toLocaleString()} · ending in {booking.paymentLast4}</p>
        </div>

        <div className="confirmation__actions">
          <Link to="/trips" className="btn btn--primary">Go to My Trips</Link>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => window.print()}
          >
            Print itinerary
          </button>
        </div>
      </div>
    </PageShell>
  )
}
