import {
  type FlightOption,
  type FlightSegment,
  formatDurationMins,
} from '../data/flights'
import { SaveButton } from './SaveButton'

interface FlightLegSummaryProps {
  segments: FlightSegment[]
  label: string
}

function FlightLegSummary({ segments, label }: FlightLegSummaryProps) {
  const first = segments[0]
  const last = segments[segments.length - 1]
  const stops = segments.length - 1
  const totalMins = segments.reduce((sum, s) => sum + s.durationMins, 0)
  const layovers = segments.slice(0, -1).map(s => s.to).join(' · ')

  return (
    <div className="flight-leg">
      <span className="flight-leg__label">{label}</span>
      <div className="flight-leg__row">
        <div className="flight-leg__times">
          <strong>{first.departTime}</strong>
          <span className="flight-leg__arrow">→</span>
          <strong>{last.arriveTime}</strong>
          {last.arriveDate !== first.departDate ? (
            <sup className="flight-leg__next-day"> +1</sup>
          ) : null}
        </div>
        <div className="flight-leg__meta">
          <span>{first.from} — {last.to}</span>
          <span className="flight-leg__sep">·</span>
          <span>{formatDurationMins(totalMins)}</span>
          <span className="flight-leg__sep">·</span>
          <span>
            {stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`}
            {layovers ? ` via ${layovers}` : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

interface FlightResultCardProps {
  flight: FlightOption
  onSelect: () => void
}

export function FlightResultCard({ flight, onSelect }: FlightResultCardProps) {
  const first = flight.outbound[0]
  const last = flight.outbound[flight.outbound.length - 1]
  const ret = flight.return
  const returnLast = ret ? ret[ret.length - 1] : null
  return (
    <article className="flight-card">
      <div className="flight-card__main">
        <div className="flight-card__airline">
          <span className="flight-card__airline-name">{first.carrier}</span>
          <span className="flight-card__airline-code">{first.flightNumber}</span>
          <span className="flight-card__save">
            <SaveButton
              kind="flight"
              flight={{
                id: flight.id,
                from: first.from,
                to: last.to,
                depart: first.departDate,
                returnDate: returnLast?.departDate,
                priceGBP: flight.priceGBP,
                carrier: first.carrier,
              }}
            />
          </span>
        </div>
        <FlightLegSummary segments={flight.outbound} label="Outbound" />
        {flight.return ? <FlightLegSummary segments={flight.return} label="Return" /> : null}
      </div>
      <aside className="flight-card__side">
        <p className="flight-card__price">
          <span className="flight-card__price-prefix">from</span>
          <strong>£{flight.priceGBP.toLocaleString()}</strong>
          <span className="flight-card__price-pp">per person</span>
        </p>
        <p className="flight-card__seats">
          {flight.seatsRemaining <= 5 ? (
            <span className="text-accent">Only {flight.seatsRemaining} seats left</span>
          ) : (
            <>{flight.seatsRemaining} seats available</>
          )}
        </p>
        <button type="button" className="btn btn--primary" onClick={onSelect}>
          Select
        </button>
      </aside>
    </article>
  )
}
