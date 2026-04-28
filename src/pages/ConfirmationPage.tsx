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
        <div className="bg-white py-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
          <p>We couldn't find a booking with that reference. Head to My Trips to find yours.</p>
          <Link
            className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
            to="/trips"
          >
            Go to My Trips
          </Link>
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
      <div>
        <div className="bg-confirmation-hero text-white p-8 rounded-card mb-4">
          <p className="m-0 mb-2 flex gap-4 items-baseline">
            <span className="text-xs opacity-80">Reference</span>
            <strong className="text-[28px] tracking-[0.1em]">{booking.pnr}</strong>
          </p>
          <p className="m-0">
            We've emailed your itinerary to <strong>{booking.contactEmail}</strong>.
          </p>
        </div>

        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="m-0 mb-2 text-xl text-grey-900">Itinerary</h2>
          <p className="mt-0 mb-4 text-grey-600 text-sm">
            {first.from} → {last.to} · {formatIsoDate(first.departDate)}
            {booking.flight.return ? ` · Return ${formatIsoDate(booking.flight.return[0].departDate)}` : ''}
          </p>
          <div className="flex flex-col gap-3">
            {booking.flight.outbound.map((s, i) => (
              <div
                key={`o-${i}`}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 border-b border-dashed border-grey-200"
              >
                <div className="flex flex-col">
                  <strong className="text-grey-900 text-lg">{s.departTime}</strong>
                  <span className="text-grey-600 text-xs">{formatIsoDate(s.departDate)} · {s.from}</span>
                </div>
                <span className="text-grey-600 text-xs">{formatDurationMins(s.durationMins)}</span>
                <div className="flex flex-col">
                  <strong className="text-grey-900 text-lg">{s.arriveTime}</strong>
                  <span className="text-grey-600 text-xs">{formatIsoDate(s.arriveDate)} · {s.to}</span>
                </div>
                <span className="col-span-full text-grey-600 text-xs">{s.carrier} {s.flightNumber}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="m-0 mb-2 text-xl text-grey-900">Travellers</h2>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {booking.passengers.map(p => (
              <li key={p.id} className="flex flex-col py-2.5 border-b border-grey-200">
                <strong className="text-grey-900">{p.firstName} {p.lastName}</strong>
                <span className="text-grey-600 text-xs">
                  {booking.seats.filter(s => s.passengerId === p.id).map(s => s.seat).join(', ') || 'Seat at check-in'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="m-0 mb-2 text-xl text-grey-900">Payment</h2>
          <p>Paid £{booking.totalGBP.toLocaleString()} · ending in {booking.paymentLast4}</p>
        </div>

        <div className="flex gap-3 mt-4 flex-wrap">
          <Link
            to="/trips"
            className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
          >
            Go to My Trips
          </Link>
          <button
            type="button"
            className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on"
            onClick={() => window.print()}
          >
            Print itinerary
          </button>
        </div>
      </div>
    </PageShell>
  )
}
