import type { Booking, PassengerDetails } from '../lib/bookingsStore'
import { formatIsoDate } from '../data/flights'

export interface BoardingPassProps {
  booking: Booking
  passenger: PassengerDetails
  seat: string
}

function QrPlaceholder({ value }: { value: string }) {
  const cells = 21
  let h = 5381
  for (let i = 0; i < value.length; i++) h = (h * 33) ^ value.charCodeAt(i)
  return (
    <svg
      className="w-[92px] h-[92px] bg-white p-1 rounded-lg"
      viewBox={`0 0 ${cells} ${cells}`}
      role="img"
      aria-label="Boarding pass QR code"
    >
      <rect width={cells} height={cells} fill="#fff" />
      {Array.from({ length: cells * cells }, (_, i) => {
        const x = i % cells
        const y = Math.floor(i / cells)
        const bit = ((h >>> ((x * 7 + y * 13) % 32)) ^ (x * y)) & 1
        if (!bit) return null
        return <rect key={i} x={x} y={y} width={1} height={1} fill="#27273f" />
      })}
    </svg>
  )
}

export function BoardingPass({ booking, passenger, seat }: BoardingPassProps) {
  const first = booking.flight.outbound[0]
  const last = booking.flight.outbound[booking.flight.outbound.length - 1]
  return (
    <article className="bg-boarding-pass rounded-card p-6 shadow-card grid gap-4 max-w-[520px]">
      <header className="flex justify-between text-grey-600 text-[13px]">
        <span>Tripma boarding pass</span>
        <strong className="text-grey-900 text-base">{first.carrier}</strong>
      </header>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
        <div>
          <strong className="block text-[28px] text-grey-900">{first.from}</strong>
          <span className="text-grey-600">{first.departTime}</span>
        </div>
        <span className="text-2xl text-purple" aria-hidden>✈</span>
        <div>
          <strong className="block text-[28px] text-grey-900">{last.to}</strong>
          <span className="text-grey-600">{last.arriveTime}</span>
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-3 m-0">
        <div>
          <dt className="text-[11px] uppercase text-grey-600 tracking-[0.08em]">Passenger</dt>
          <dd className="mt-0.5 mb-0 text-grey-900 font-semibold">{passenger.firstName} {passenger.lastName}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase text-grey-600 tracking-[0.08em]">Flight</dt>
          <dd className="mt-0.5 mb-0 text-grey-900 font-semibold">{first.flightNumber}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase text-grey-600 tracking-[0.08em]">Date</dt>
          <dd className="mt-0.5 mb-0 text-grey-900 font-semibold">{formatIsoDate(first.departDate)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase text-grey-600 tracking-[0.08em]">Seat</dt>
          <dd className="mt-0.5 mb-0 text-grey-900 font-semibold">{seat}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase text-grey-600 tracking-[0.08em]">Gate</dt>
          <dd className="mt-0.5 mb-0 text-grey-900 font-semibold">B{Math.max(1, (booking.pnr.charCodeAt(0) % 20))}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase text-grey-600 tracking-[0.08em]">Boards</dt>
          <dd className="mt-0.5 mb-0 text-grey-900 font-semibold">{first.departTime}</dd>
        </div>
      </dl>
      <footer className="flex justify-between items-center border-t border-dashed border-grey-300 pt-3">
        <div>
          <span>Ref</span>
          <strong className="font-mono text-xl tracking-[0.1em] block">{booking.pnr}</strong>
        </div>
        <QrPlaceholder value={`${booking.pnr}-${passenger.id}`} />
      </footer>
    </article>
  )
}
