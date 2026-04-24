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
    <div className="grid grid-cols-[120px_1fr] grid-rows-[auto_auto_auto_auto] gap-y-1 gap-x-4 py-3">
      <div className="contents">
        <div className="flex flex-col">
          <strong className="text-[20px] text-grey-900">{segment.departTime}</strong>
          <span className="text-xs text-grey-600">{formatIsoDate(segment.departDate)}</span>
        </div>
        <div className="self-center font-semibold text-grey-900">{segment.from}</div>
      </div>
      <div className="col-span-full border-l-2 border-purple ml-2.5 py-1 pl-4 text-grey-600 text-xs">
        <span>{formatDurationMins(segment.durationMins)}</span>
      </div>
      <div className="contents">
        <div className="flex flex-col">
          <strong className="text-[20px] text-grey-900">{segment.arriveTime}</strong>
          <span className="text-xs text-grey-600">{formatIsoDate(segment.arriveDate)}</span>
        </div>
        <div className="self-center font-semibold text-grey-900">{segment.to}</div>
      </div>
      <p className="col-span-full text-xs text-grey-600 m-0">
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
        <div className="bg-white py-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
          <p>We couldn't find that flight. It might have been re-priced.</p>
          <Link
            className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
            to="/"
          >
            Back to home
          </Link>
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
      <div className="grid grid-cols-[1fr_340px] gap-6 items-start max-[900px]:grid-cols-1">
        <section>
          <div className="bg-white rounded-card p-6 shadow-card mb-4">
            <h2 className="m-0 mb-2 text-xl text-grey-900">Outbound</h2>
            {flight.outbound.map((s, i) => (
              <div key={i}>
                <SegmentDetail segment={s} />
                {i < flight.outbound.length - 1 ? (
                  <div className="py-2.5 px-3 bg-purple-on text-grey-900 rounded-sm my-2 text-sm">Layover in {s.to}</div>
                ) : null}
              </div>
            ))}
          </div>

          {flight.return ? (
            <div className="bg-white rounded-card p-6 shadow-card mb-4">
              <h2 className="m-0 mb-2 text-xl text-grey-900">Return</h2>
              {flight.return.map((s, i) => (
                <div key={i}>
                  <SegmentDetail segment={s} />
                  {i < flight.return!.length - 1 ? (
                    <div className="py-2.5 px-3 bg-purple-on text-grey-900 rounded-sm my-2 text-sm">Layover in {s.to}</div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <div className="bg-white rounded-card p-6 shadow-card mb-4">
            <h2 className="m-0 mb-2 text-xl text-grey-900">Choose your fare</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
              {FARE_TYPES.map(key => {
                const info = FARE_PRICING[key]
                const price = Math.round(flight.priceGBP * info.multiplier)
                const isSelected = fare === key
                return (
                  <button
                    type="button"
                    key={key}
                    className={`text-left bg-white border-2 rounded-card p-4 cursor-pointer transition-[border-color,box-shadow] font-sans text-grey-900 hover:border-purple ${
                      isSelected
                        ? 'border-purple shadow-[0_0_0_3px_var(--color-purple-on)]'
                        : 'border-grey-200'
                    }`}
                    onClick={() => setFare(key)}
                    aria-pressed={isSelected}
                  >
                    <header>
                      <h3 className="m-0 text-base">{info.label}</h3>
                      <p className="text-[22px] mt-1 mb-0 font-bold">£{price.toLocaleString()}</p>
                      <p className="text-xs text-grey-600 m-0">per person</p>
                    </header>
                    <p className="text-sm text-grey-600 my-2.5">{info.description}</p>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-xs">
                      {FARE_FEATURES[key].map(f => (
                        <li
                          key={f.label}
                          className={f.included ? 'text-grey-900' : 'text-grey-400 line-through'}
                        >
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

        <aside>
          <div className="bg-white rounded-card p-5 shadow-card sticky top-4">
            <h3 className="m-0 mb-1.5 text-base text-grey-900">Summary</h3>
            <div className="flex justify-between py-1.5 text-sm">
              <span>Fare</span>
              <strong>{FARE_PRICING[fare].label}</strong>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <span>Travellers</span>
              <strong>{pax} × adult{adults === 1 && children === 0 ? '' : 's'}{children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}</strong>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <span>Price per person</span>
              <strong>£{perPerson.toLocaleString()}</strong>
            </div>
            <hr className="border-0 border-t border-grey-200 my-2.5" />
            <div className="flex justify-between py-1.5 text-lg pt-3">
              <span>Total</span>
              <strong className="text-grey-900">£{total.toLocaleString()}</strong>
            </div>
            <button
              type="button"
              className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover w-full mt-3"
              onClick={onContinue}
            >
              Continue
            </button>
            <p className="text-xs text-grey-600 my-2">Free cancellation within 24 hours of booking.</p>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
