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
        <div className="bg-white py-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
          <p>We couldn't find that booking.</p>
          <Link
            className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
            to="/trips"
          >
            Back to My Trips
          </Link>
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
        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="m-0 mb-2 text-xl text-grey-900">Confirm traveller details</h2>
          <p className="mt-0 mb-4 text-grey-600 text-sm">Make sure names match your passport before checking in.</p>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {booking.passengers.map(p => (
              <li key={p.id} className="flex flex-col py-2.5 border-b border-grey-200">
                <strong className="text-grey-900">{p.firstName} {p.lastName}</strong>
                <span className="text-grey-600 text-xs">DOB {p.dob || '—'}{p.passportNumber ? ` · passport ${p.passportNumber}` : ''}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
            onClick={() => setCheckedIn(true)}
          >
            Check in all travellers
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
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
