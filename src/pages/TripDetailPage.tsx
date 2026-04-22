import { Link, useParams, useNavigate } from 'react-router-dom'
import { PageShell } from './PageShell'
import { bookingsStore, updateBooking } from '../lib/bookingsStore'
import { useStore } from '../lib/useStore'
import { formatDurationMins, formatIsoDate } from '../data/flights'

export function TripDetailPage() {
  const { pnr = '' } = useParams()
  const bookings = useStore(bookingsStore)
  const navigate = useNavigate()
  const booking = bookings.find(b => b.pnr === pnr) ?? null

  if (!booking) {
    return (
      <PageShell
        title="Trip not found"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'My trips', to: '/trips' }, { label: 'Trip' }]}
      >
        <div className="empty-state">
          <p>We couldn't find that booking.</p>
          <Link className="btn btn--primary" to="/trips">Back to My Trips</Link>
        </div>
      </PageShell>
    )
  }

  const first = booking.flight.outbound[0]
  const last = booking.flight.outbound[booking.flight.outbound.length - 1]

  function onCancel() {
    if (!window.confirm('Cancel this trip? Refund eligibility depends on fare rules.')) return
    updateBooking(booking!.pnr, b => ({ ...b, status: 'cancelled' }))
    navigate('/trips')
  }

  return (
    <PageShell
      title={`${first.from} → ${last.to}`}
      subtitle={`${formatIsoDate(first.departDate)} · Ref ${booking.pnr} · ${booking.status}`}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'My trips', to: '/trips' },
        { label: booking.pnr },
      ]}
      actions={
        <Link to={`/trips/${booking.pnr}/check-in`} className="btn btn--primary">Check in</Link>
      }
    >
      <div className="detail-card">
        <h2>Itinerary</h2>
        <h3>Outbound</h3>
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
        {booking.flight.return ? (
          <>
            <h3>Return</h3>
            <div className="itin-grid">
              {booking.flight.return.map((s, i) => (
                <div key={`r-${i}`} className="itin-row">
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
          </>
        ) : null}
      </div>

      <div className="detail-card">
        <h2>Travellers and seats</h2>
        <ul className="traveller-list">
          {booking.passengers.map(p => (
            <li key={p.id}>
              <strong>{p.firstName} {p.lastName}</strong>
              <span>
                Seats:{' '}
                {booking.seats.filter(s => s.passengerId === p.id).map(s => s.seat).join(', ') || 'At check-in'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="detail-card">
        <h2>Payment</h2>
        <p>Total paid £{booking.totalGBP.toLocaleString()} · card ending {booking.paymentLast4}</p>
      </div>

      {booking.status === 'confirmed' ? (
        <div className="detail-card">
          <h2>Manage booking</h2>
          <h3>Add extras</h3>
          <ul className="traveller-list">
            {booking.passengers.map(p => {
              const bags = booking.extras.checkedBagsByPassenger[p.id] ?? 0
              return (
                <li key={p.id}>
                  <div>
                    <strong>{p.firstName} {p.lastName}</strong>
                    <span>{bags} checked bag{bags === 1 ? '' : 's'}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() =>
                      updateBooking(booking!.pnr, b => ({
                        ...b,
                        extras: {
                          ...b.extras,
                          checkedBagsByPassenger: {
                            ...b.extras.checkedBagsByPassenger,
                            [p.id]: (b.extras.checkedBagsByPassenger[p.id] ?? 0) + 1,
                          },
                        },
                        totalGBP: b.totalGBP + 30,
                      }))
                    }
                  >
                    Add bag (+£30)
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="manage-actions" style={{ marginTop: 16 }}>
            {!booking.extras.priorityBoarding ? (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() =>
                  updateBooking(booking!.pnr, b => ({
                    ...b,
                    extras: { ...b.extras, priorityBoarding: true },
                    totalGBP: b.totalGBP + 15,
                  }))
                }
              >
                Add priority boarding (+£15)
              </button>
            ) : (
              <span className="detail-card__sub">Priority boarding added</span>
            )}
            <button type="button" className="btn btn--secondary" disabled>
              Change flight
            </button>
            <button type="button" className="btn btn--secondary" onClick={onCancel}>
              Cancel trip
            </button>
          </div>
          <p className="manage-note">
            Change and cancel fees depend on the fare rules shown at booking.
          </p>
        </div>
      ) : null}
    </PageShell>
  )
}
