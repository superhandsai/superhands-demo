import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageShell } from './PageShell'
import { bookingsStore, updateBooking, type Booking } from '../lib/bookingsStore'
import { useStore } from '../lib/useStore'
import { formatDurationMins, formatIsoDate } from '../data/flights'
import { RefundModal } from '../components/RefundModal'
import { pushToast } from '../lib/toastStore'

const btnPrimaryCls =
  'font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover'
const btnSecondaryCls =
  'font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on'

type ReadinessState = 'complete' | 'attention' | 'optional'

function readinessClassFor(state: ReadinessState): string {
  if (state === 'complete') return 'bg-success-soft text-success'
  if (state === 'attention') return 'bg-warn-soft text-warn'
  return 'bg-grey-100 text-grey-600'
}

function TripReadinessPanel({ booking }: { booking: Booking }) {
  const first = booking.flight.outbound[0]
  const seatPassengerIds = new Set(booking.seats.map(s => s.passengerId))
  const seatedPassengers = booking.passengers.filter(p => seatPassengerIds.has(p.id)).length
  const passportsComplete = booking.passengers.every(p => p.passportNumber?.trim())
  const checkedBags = Object.values(booking.extras.checkedBagsByPassenger).reduce(
    (sum, count) => sum + count,
    0,
  )
  const isConfirmed = booking.status === 'confirmed'
  const items: Array<{
    label: string
    detail: string
    state: ReadinessState
    action?: { label: string; to: string }
  }> = [
    {
      label: 'Seat selection',
      detail:
        seatedPassengers === booking.passengers.length
          ? 'Seats assigned for every traveller.'
          : `${seatedPassengers}/${booking.passengers.length} travellers have seats assigned.`,
      state: seatedPassengers === booking.passengers.length ? 'complete' : 'attention',
      action:
        seatedPassengers === booking.passengers.length
          ? undefined
          : { label: 'Check in', to: `/trips/${booking.pnr}/check-in` },
    },
    {
      label: 'Passport details',
      detail: passportsComplete
        ? 'Document details are saved for every traveller.'
        : 'Some traveller documents are missing.',
      state: passportsComplete ? 'complete' : 'attention',
    },
    {
      label: 'Checked baggage',
      detail:
        checkedBags > 0
          ? `${checkedBags} checked bag${checkedBags === 1 ? '' : 's'} added.`
          : 'No checked bags added.',
      state: checkedBags > 0 ? 'complete' : 'optional',
    },
    {
      label: 'Priority boarding',
      detail: booking.extras.priorityBoarding
        ? 'Priority boarding is included.'
        : 'Available to add from manage booking.',
      state: booking.extras.priorityBoarding ? 'complete' : 'optional',
    },
    {
      label: 'Flight status',
      detail: `Track ${first.flightNumber} for gate and delay updates.`,
      state: isConfirmed ? 'attention' : 'optional',
      action: { label: 'Track flight', to: `/status?no=${first.flightNumber}` },
    },
  ]

  return (
    <div className="bg-white rounded-card p-6 shadow-card mb-4">
      <div className="flex justify-between items-start gap-4 flex-wrap mb-4">
        <div>
          <h2 className="mt-0 mb-1 text-xl text-grey-900">Trip readiness</h2>
          <p className="m-0 text-sm text-grey-600">
            Review the details that usually matter before travel day.
          </p>
        </div>
        <Link to={`/trips/${booking.pnr}/check-in`} className={btnPrimaryCls}>
          Check in
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        {items.map(item => (
          <div key={item.label} className="border border-grey-200 rounded-[12px] p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <strong className="text-grey-900 text-sm">{item.label}</strong>
              <span
                className={`inline-flex items-center rounded-full py-1 px-2.5 text-[11px] font-semibold ${readinessClassFor(item.state)}`}
              >
                {item.state === 'complete' ? 'Done' : item.state === 'attention' ? 'Review' : 'Optional'}
              </span>
            </div>
            <p className="text-[13px] text-grey-600 m-0">{item.detail}</p>
            {item.action ? (
              <Link className="text-purple no-underline font-normal hover:underline text-[13px] inline-flex mt-2" to={item.action.to}>
                {item.action.label}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export function TripDetailPage() {
  const { pnr = '' } = useParams()
  const bookings = useStore(bookingsStore)
  const [showRefund, setShowRefund] = useState(false)
  const booking = bookings.find(b => b.pnr === pnr) ?? null

  if (!booking) {
    return (
      <PageShell
        title="Trip not found"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'My trips', to: '/trips' }, { label: 'Trip' }]}
      >
        <div className="bg-white p-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
          <p>We couldn't find that booking.</p>
          <Link className={btnPrimaryCls} to="/trips">
            Back to My Trips
          </Link>
        </div>
      </PageShell>
    )
  }

  const first = booking.flight.outbound[0]
  const last = booking.flight.outbound[booking.flight.outbound.length - 1]

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
        <Link to={`/trips/${booking.pnr}/check-in`} className={btnPrimaryCls}>
          Check in
        </Link>
      }
    >
      <TripReadinessPanel booking={booking} />

      <div className="bg-white rounded-card p-6 shadow-card mb-4">
        <h2 className="mt-0 mb-2 text-xl text-grey-900">Itinerary</h2>
        <h3 className="mt-4 mb-2 text-base text-grey-900">Outbound</h3>
        <div className="flex flex-col gap-3">
          {booking.flight.outbound.map((s, i) => (
            <div
              key={`o-${i}`}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 border-b border-dashed border-grey-200"
            >
              <div className="flex flex-col">
                <strong className="text-grey-900 text-lg">{s.departTime}</strong>
                <span className="text-grey-600 text-[13px]">
                  {formatIsoDate(s.departDate)} · {s.from}
                </span>
              </div>
              <span className="text-grey-600 text-[13px]">{formatDurationMins(s.durationMins)}</span>
              <div className="flex flex-col">
                <strong className="text-grey-900 text-lg">{s.arriveTime}</strong>
                <span className="text-grey-600 text-[13px]">
                  {formatIsoDate(s.arriveDate)} · {s.to}
                </span>
              </div>
              <span className="col-span-full text-grey-600 text-[13px]">
                {s.carrier} {s.flightNumber}
              </span>
            </div>
          ))}
        </div>
        {booking.flight.return ? (
          <>
            <h3 className="mt-4 mb-2 text-base text-grey-900">Return</h3>
            <div className="flex flex-col gap-3">
              {booking.flight.return.map((s, i) => (
                <div
                  key={`r-${i}`}
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 border-b border-dashed border-grey-200"
                >
                  <div className="flex flex-col">
                    <strong className="text-grey-900 text-lg">{s.departTime}</strong>
                    <span className="text-grey-600 text-[13px]">
                      {formatIsoDate(s.departDate)} · {s.from}
                    </span>
                  </div>
                  <span className="text-grey-600 text-[13px]">
                    {formatDurationMins(s.durationMins)}
                  </span>
                  <div className="flex flex-col">
                    <strong className="text-grey-900 text-lg">{s.arriveTime}</strong>
                    <span className="text-grey-600 text-[13px]">
                      {formatIsoDate(s.arriveDate)} · {s.to}
                    </span>
                  </div>
                  <span className="col-span-full text-grey-600 text-[13px]">
                    {s.carrier} {s.flightNumber}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="bg-white rounded-card p-6 shadow-card mb-4">
        <h2 className="mt-0 mb-2 text-xl text-grey-900">Travellers and seats</h2>
        <ul className="list-none p-0 m-0 flex flex-col gap-2">
          {booking.passengers.map(p => (
            <li key={p.id} className="flex flex-col py-2.5 border-b border-grey-200">
              <strong className="text-grey-900">
                {p.firstName} {p.lastName}
              </strong>
              <span className="text-grey-600 text-[13px]">
                Seats:{' '}
                {booking.seats.filter(s => s.passengerId === p.id).map(s => s.seat).join(', ') ||
                  'At check-in'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-card p-6 shadow-card mb-4">
        <h2 className="mt-0 mb-2 text-xl text-grey-900">Payment</h2>
        <p>
          Total paid £{booking.totalGBP.toLocaleString()} · card ending {booking.paymentLast4}
        </p>
      </div>

      {booking.status === 'confirmed' ? (
        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="mt-0 mb-2 text-xl text-grey-900">Manage booking</h2>
          <h3 className="mt-4 mb-2 text-base text-grey-900">Add extras</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {booking.passengers.map(p => {
              const bags = booking.extras.checkedBagsByPassenger[p.id] ?? 0
              return (
                <li key={p.id} className="flex flex-col py-2.5 border-b border-grey-200">
                  <div>
                    <strong className="text-grey-900">
                      {p.firstName} {p.lastName}
                    </strong>
                    <span className="text-grey-600 text-[13px]">
                      {bags} checked bag{bags === 1 ? '' : 's'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={btnSecondaryCls}
                    onClick={() => {
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
                      pushToast({
                        tone: 'success',
                        title: 'Bag added',
                        body: `${p.firstName} ${p.lastName} · £30 charged to card ending ${booking!.paymentLast4}`,
                      })
                    }}
                  >
                    Add bag (+£30)
                  </button>
                </li>
              )
            })}
          </ul>
          <div
            className="flex flex-wrap gap-3 items-center"
            style={{ marginTop: 16 }}
          >
            {!booking.extras.priorityBoarding ? (
              <button
                type="button"
                className={btnSecondaryCls}
                onClick={() => {
                  updateBooking(booking!.pnr, b => ({
                    ...b,
                    extras: { ...b.extras, priorityBoarding: true },
                    totalGBP: b.totalGBP + 15,
                  }))
                  pushToast({
                    tone: 'success',
                    title: 'Priority boarding added',
                    body: '£15 charged',
                  })
                }}
              >
                Add priority boarding (+£15)
              </button>
            ) : (
              <span className="mt-0 mb-4 text-grey-600 text-sm">Priority boarding added</span>
            )}
            <Link
              to={`/status?no=${booking.flight.outbound[0].flightNumber}`}
              className={btnSecondaryCls}
            >
              Flight status
            </Link>
            <button
              type="button"
              className={btnSecondaryCls}
              onClick={() => setShowRefund(true)}
            >
              Cancel trip
            </button>
          </div>
          {showRefund ? (
            <RefundModal booking={booking} onClose={() => setShowRefund(false)} />
          ) : null}
          <p className="text-[13px] text-grey-600 m-0">
            Change and cancel fees depend on the fare rules shown at booking.
          </p>
        </div>
      ) : null}
    </PageShell>
  )
}
