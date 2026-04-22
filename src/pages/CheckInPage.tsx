import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageShell } from './PageShell'
import { bookingsStore } from '../lib/bookingsStore'
import { useStore } from '../lib/useStore'
import { BoardingPass } from '../components/BoardingPass'

export function CheckInPage() {
  const { pnr = '' } = useParams()
  const bookings = useStore(bookingsStore)
  const booking = bookings.find(b => b.pnr === pnr) ?? null
  const [checkedIn, setCheckedIn] = useState(false)

  if (!booking) {
    return (
      <PageShell
        title="Booking not found"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'My trips', to: '/trips' }]}
      >
        <div className="empty-state">
          <p>We couldn't find that booking.</p>
          <Link className="btn btn--primary" to="/trips">Back to My Trips</Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Online check-in"
      subtitle={`${booking.flight.outbound[0].from} → ${booking.flight.outbound[booking.flight.outbound.length - 1].to} · Ref ${booking.pnr}`}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'My trips', to: '/trips' },
        { label: booking.pnr, to: `/trips/${booking.pnr}` },
        { label: 'Check in' },
      ]}
    >
      {!checkedIn ? (
        <div className="detail-card">
          <h2>Confirm traveller details</h2>
          <p className="detail-card__sub">Make sure names match your passport before checking in.</p>
          <ul className="traveller-list">
            {booking.passengers.map(p => (
              <li key={p.id}>
                <strong>{p.firstName} {p.lastName}</strong>
                <span>DOB {p.dob || '—'}{p.passportNumber ? ` · passport ${p.passportNumber}` : ''}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn--primary" onClick={() => setCheckedIn(true)}>
            Check in all travellers
          </button>
        </div>
      ) : (
        <div className="boarding-passes">
          {booking.passengers.map((p, i) => (
            <BoardingPass
              key={p.id}
              booking={booking}
              passenger={p}
              seat={booking.seats.find(s => s.passengerId === p.id)?.seat ?? `${10 + i}A`}
            />
          ))}
        </div>
      )}
    </PageShell>
  )
}
