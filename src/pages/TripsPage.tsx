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

const btnPrimaryCls =
  'font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover'
const btnSecondaryCls =
  'font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on'

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
        <div className="bg-white p-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
          <p>No bookings yet. When you book, your trips will show up here.</p>
          <Link className={btnPrimaryCls} to="/">
            Search flights
          </Link>
        </div>
      ) : (
        <>
          <section>
            <h2 className="text-grey-900 mt-4 mb-3 text-lg">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="mt-0 mb-4 text-grey-600 text-sm">No upcoming trips.</p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mb-4">
                {upcoming.map(b => <TripCard key={b.pnr} booking={b} />)}
              </div>
            )}
          </section>
          {past.length > 0 ? (
            <section>
              <h2 className="text-grey-900 mt-4 mb-3 text-lg">Past trips</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mb-4">
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
    <article className="bg-white rounded-card p-5 shadow-card flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <strong className="text-lg text-grey-900">
          {first.from} → {last.to}
        </strong>
        <span className="text-[13px] text-grey-600">{formatIsoDate(first.departDate)}</span>
      </div>
      <p className="text-grey-600 text-sm m-0">
        {first.carrier} · {booking.passengers.length} traveller
        {booking.passengers.length > 1 ? 's' : ''} · {booking.pnr}
      </p>
      <div className="flex gap-2 mt-2">
        <Link to={`/trips/${booking.pnr}`} className={btnPrimaryCls}>
          View
        </Link>
        <Link to={`/trips/${booking.pnr}/check-in`} className={btnSecondaryCls}>
          Check in
        </Link>
      </div>
    </article>
  )
}
