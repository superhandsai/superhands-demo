import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { PageShell } from './PageShell'
import {
  formatDurationMins,
  formatIsoDate,
  generateFlights,
  type FlightSegment,
} from '../data/flights'
import { FARE_PRICING, type FareType, startCheckout } from '../lib/checkoutStore'

const FARE_TYPES: FareType[] = ['basic', 'standard', 'flex']

const FARE_FEATURES: Record<FareType, Array<{ label: string; included: boolean }>> = {
  basic: [
    { label: 'Underseat personal item', included: true },
    { label: 'Cabin bag', included: false },
    { label: 'Checked bag (23kg)', included: false },
    { label: 'Seat selection', included: false },
    { label: 'Free changes', included: false },
    { label: 'Priority boarding', included: false },
  ],
  standard: [
    { label: 'Underseat personal item', included: true },
    { label: 'Cabin bag', included: true },
    { label: 'Checked bag (23kg)', included: false },
    { label: 'Seat selection', included: true },
    { label: 'Changes (fee applies)', included: true },
    { label: 'Priority boarding', included: false },
  ],
  flex: [
    { label: 'Underseat personal item', included: true },
    { label: 'Cabin bag', included: true },
    { label: 'Checked bag (23kg)', included: true },
    { label: 'Seat selection', included: true },
    { label: 'Free changes', included: true },
    { label: 'Priority boarding', included: true },
  ],
}

function SegmentDetail({ segment }: { segment: FlightSegment }) {
  return (
    <div className="segment-detail">
      <div className="segment-detail__row">
        <div className="segment-detail__time">
          <strong>{segment.departTime}</strong>
          <span>{formatIsoDate(segment.departDate)}</span>
        </div>
        <div className="segment-detail__place">{segment.from}</div>
      </div>
      <div className="segment-detail__bar">
        <span className="segment-detail__duration">{formatDurationMins(segment.durationMins)}</span>
      </div>
      <div className="segment-detail__row">
        <div className="segment-detail__time">
          <strong>{segment.arriveTime}</strong>
          <span>{formatIsoDate(segment.arriveDate)}</span>
        </div>
        <div className="segment-detail__place">{segment.to}</div>
      </div>
      <p className="segment-detail__meta">
        {segment.carrier} · {segment.flightNumber}
      </p>
    </div>
  )
}

export function FlightDetailsPage() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [fare, setFare] = useState<FareType>('standard')

  const from = (params.get('from') || '').toUpperCase()
  const to = (params.get('to') || '').toUpperCase()
  const depart = params.get('depart') || ''
  const ret = params.get('return') || ''
  const trip = params.get('trip') || 'return'
  const adults = Math.max(1, parseInt(params.get('adults') || '1', 10) || 1)
  const children = Math.max(0, parseInt(params.get('children') || '0', 10) || 0)

  const flight = useMemo(() => {
    const list = generateFlights({ from, to, depart, return: trip !== 'one-way' ? ret : undefined })
    return list.find(f => f.id === id) ?? null
  }, [from, to, depart, ret, trip, id])

  if (!flight) {
    return (
      <PageShell title="Flight not found" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Flights' }]}>
        <div className="empty-state">
          <p>We couldn't find that flight. It might have been re-priced.</p>
          <Link className="btn btn--primary" to="/">Back to home</Link>
        </div>
      </PageShell>
    )
  }

  const pax = adults + children
  const fareMultiplier = FARE_PRICING[fare].multiplier
  const perPerson = Math.round(flight.priceGBP * fareMultiplier)
  const total = perPerson * pax

  function onContinue() {
    startCheckout(flight!, { adults, children }, fare)
    const q = new URLSearchParams(params)
    navigate(`/book/passengers?${q.toString()}`)
  }

  return (
    <PageShell
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Flights', to: `/flights?${params.toString()}` },
        { label: 'Select fare' },
      ]}
      title={`${flight.outbound[0].from} → ${flight.outbound[flight.outbound.length - 1].to}`}
      subtitle={`${flight.outbound[0].carrier} · Total flight time ${formatDurationMins(flight.totalDurationMins)}`}
    >
      <div className="flight-details-layout">
        <section className="flight-details-main">
          <div className="detail-card">
            <h2>Outbound</h2>
            {flight.outbound.map((s, i) => (
              <div key={i}>
                <SegmentDetail segment={s} />
                {i < flight.outbound.length - 1 ? (
                  <div className="segment-layover">Layover in {s.to}</div>
                ) : null}
              </div>
            ))}
          </div>

          {flight.return ? (
            <div className="detail-card">
              <h2>Return</h2>
              {flight.return.map((s, i) => (
                <div key={i}>
                  <SegmentDetail segment={s} />
                  {i < flight.return!.length - 1 ? (
                    <div className="segment-layover">Layover in {s.to}</div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <div className="detail-card">
            <h2>Choose your fare</h2>
            <div className="fare-grid">
              {FARE_TYPES.map(key => {
                const info = FARE_PRICING[key]
                const price = Math.round(flight.priceGBP * info.multiplier)
                const isSelected = fare === key
                return (
                  <button
                    type="button"
                    key={key}
                    className={`fare-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setFare(key)}
                    aria-pressed={isSelected}
                  >
                    <header className="fare-card__head">
                      <h3>{info.label}</h3>
                      <p className="fare-card__price">£{price.toLocaleString()}</p>
                      <p className="fare-card__pp">per person</p>
                    </header>
                    <p className="fare-card__desc">{info.description}</p>
                    <ul className="fare-card__features">
                      {FARE_FEATURES[key].map(f => (
                        <li key={f.label} className={f.included ? 'is-included' : 'is-excluded'}>
                          <span aria-hidden>{f.included ? '✓' : '—'}</span> {f.label}
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <aside className="flight-details-side">
          <div className="summary-card">
            <h3>Summary</h3>
            <div className="summary-card__row">
              <span>Fare</span>
              <strong>{FARE_PRICING[fare].label}</strong>
            </div>
            <div className="summary-card__row">
              <span>Travellers</span>
              <strong>{pax} × adult{adults === 1 && children === 0 ? '' : 's'}{children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}</strong>
            </div>
            <div className="summary-card__row">
              <span>Price per person</span>
              <strong>£{perPerson.toLocaleString()}</strong>
            </div>
            <hr />
            <div className="summary-card__row summary-card__row--total">
              <span>Total</span>
              <strong>£{total.toLocaleString()}</strong>
            </div>
            <button type="button" className="btn btn--primary summary-card__cta" onClick={onContinue}>
              Continue
            </button>
            <p className="summary-card__small">Free cancellation within 24 hours of booking.</p>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
