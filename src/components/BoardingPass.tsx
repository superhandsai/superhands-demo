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
      className="boarding-pass__qr"
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
    <article className="boarding-pass">
      <header className="boarding-pass__head">
        <span>Tripma boarding pass</span>
        <strong>{first.carrier}</strong>
      </header>
      <div className="boarding-pass__route">
        <div>
          <strong>{first.from}</strong>
          <span>{first.departTime}</span>
        </div>
        <span className="boarding-pass__plane" aria-hidden>✈</span>
        <div>
          <strong>{last.to}</strong>
          <span>{last.arriveTime}</span>
        </div>
      </div>
      <dl className="boarding-pass__grid">
        <div><dt>Passenger</dt><dd>{passenger.firstName} {passenger.lastName}</dd></div>
        <div><dt>Flight</dt><dd>{first.flightNumber}</dd></div>
        <div><dt>Date</dt><dd>{formatIsoDate(first.departDate)}</dd></div>
        <div><dt>Seat</dt><dd>{seat}</dd></div>
        <div><dt>Gate</dt><dd>B{Math.max(1, (booking.pnr.charCodeAt(0) % 20))}</dd></div>
        <div><dt>Boards</dt><dd>{first.departTime}</dd></div>
      </dl>
      <footer className="boarding-pass__foot">
        <div>
          <span>Ref</span>
          <strong>{booking.pnr}</strong>
        </div>
        <QrPlaceholder value={`${booking.pnr}-${passenger.id}`} />
      </footer>
    </article>
  )
}
