import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageShell } from './PageShell'
import { bookingsStore, type Booking } from '../lib/bookingsStore'
import { useStore } from '../lib/useStore'
import { formatIsoDate } from '../data/flights'

function classify(b: Booking): 'upcoming' | 'past' {
  const today = new Date().toISOString().slice(0, 10)
  const departDate = b.flight.outbound[0].departDate
  return departDate >= today ? 'upcoming' : 'past'
}

export function TripsPage() {
  const bookings = useStore(bookingsStore)

  const { upcoming, past } = useMemo(() => {
    const u: Booking[] = []
    const p: Booking[] = []
    bookings.forEach(b => (classify(b) === 'upcoming' ? u.push(b) : p.push(b)))
    u.sort((a, b) => a.flight.outbound[0].departDate.localeCompare(b.flight.outbound[0].departDate))
    p.sort((a, b) => b.flight.outbound[0].departDate.localeCompare(a.flight.outbound[0].departDate))
    return { upcoming: u, past: p }
  }, [bookings])

  return (
    <PageShell
      title="My trips"
      subtitle="Everything you've booked with Tripma, in one place."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'My trips' }]}
    >
      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings yet. When you book, your trips will show up here.</p>
          <Link className="btn btn--primary" to="/">Search flights</Link>
        </div>
      ) : (
        <>
          <section>
            <h2 className="trip-section__title">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="detail-card__sub">No upcoming trips.</p>
            ) : (
              <div className="trip-grid">
                {upcoming.map(b => <TripCard key={b.pnr} booking={b} />)}
              </div>
            )}
          </section>
          {past.length > 0 ? (
            <section>
              <h2 className="trip-section__title">Past trips</h2>
              <div className="trip-grid">
                {past.map(b => <TripCard key={b.pnr} booking={b} />)}
              </div>
            </section>
          ) : null}
        </>
      )}
    </PageShell>
  )
}

function TripCard({ booking }: { booking: Booking }) {
  const first = booking.flight.outbound[0]
  const last = booking.flight.outbound[booking.flight.outbound.length - 1]
  return (
    <article className="trip-card">
      <div className="trip-card__head">
        <strong>{first.from} → {last.to}</strong>
        <span>{formatIsoDate(first.departDate)}</span>
      </div>
      <p className="trip-card__meta">
        {first.carrier} · {booking.passengers.length} traveller{booking.passengers.length > 1 ? 's' : ''} · {booking.pnr}
      </p>
      <div className="trip-card__actions">
        <Link to={`/trips/${booking.pnr}`} className="btn btn--primary">View</Link>
        <Link to={`/trips/${booking.pnr}/check-in`} className="btn btn--secondary">Check in</Link>
      </div>
    </article>
  )
}
