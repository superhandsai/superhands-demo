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
    <div className="py-2.5 border-b border-dashed border-grey-200 last:border-b-0">
      <span className="text-xs uppercase tracking-[0.06em] text-grey-600 block mb-1">{label}</span>
      <div className="flex justify-between gap-3 flex-wrap">
        <div className="flex items-baseline gap-2.5 text-xl text-grey-900">
          <strong>{first.departTime}</strong>
          <span className="text-grey-400 text-base">→</span>
          <strong>{last.arriveTime}</strong>
          {last.arriveDate !== first.departDate ? (
            <sup className="text-xs text-purple font-semibold"> +1</sup>
          ) : null}
        </div>
        <div className="text-[13px] text-grey-600 flex gap-1.5 flex-wrap">
          <span>{first.from} — {last.to}</span>
          <span className="text-grey-300">·</span>
          <span>{formatDurationMins(totalMins)}</span>
          <span className="text-grey-300">·</span>
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
    <article className="bg-white rounded-card shadow-card hover:shadow-card-hover transition-[box-shadow] duration-150 py-5 px-6 mb-3 grid grid-cols-[1fr_220px] gap-5 max-[720px]:grid-cols-1">
      <div>
        <div className="flex justify-between mb-3 text-sm text-grey-600">
          <span className="font-bold text-grey-900">{first.carrier}</span>
          <span>{first.flightNumber}</span>
          <span className="ml-auto">
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
      <aside className="border-l border-grey-200 pl-5 flex flex-col justify-between items-end gap-2 text-right max-[720px]:border-l-0 max-[720px]:pl-0 max-[720px]:items-stretch max-[720px]:border-t max-[720px]:border-solid max-[720px]:border-grey-200 max-[720px]:pt-3">
        <p className="m-0">
          <span className="text-[13px] text-grey-600 block">from</span>
          <strong className="text-2xl text-grey-900">£{flight.priceGBP.toLocaleString()}</strong>
          <span className="text-[13px] text-grey-600 block">per person</span>
        </p>
        <p className="text-[13px] text-grey-600 m-0">
          {flight.seatsRemaining <= 5 ? (
            <span className="text-purple">Only {flight.seatsRemaining} seats left</span>
          ) : (
            <>{flight.seatsRemaining} seats available</>
          )}
        </p>
        <button
          type="button"
          className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] inline-flex items-center justify-center gap-2 transition-colors bg-purple text-white hover:bg-purple-hover disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onSelect}
        >
          Select
        </button>
      </aside>
    </article>
  )
}
