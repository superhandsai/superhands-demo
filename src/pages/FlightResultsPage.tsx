import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PageShell } from './PageShell'
import { FlightResultCard } from '../components/FlightResultCard'
import { CalendarPricingStrip } from '../components/CalendarPricingStrip'
import { ResultsSkeleton } from '../components/ResultsSkeleton'
import { addAlert } from '../lib/alertsStore'
import { pushToast } from '../lib/toastStore'
import {
  formatDurationMins,
  formatIsoDate,
  generateFlights,
  type FlightOption,
} from '../data/flights'

type SortKey = 'price' | 'duration' | 'depart' | 'stops'

function getFlightDuration(flight: FlightOption): number {
  return flight.totalDurationMins
}

function parsePassengerCount(params: URLSearchParams) {
  const adults = Math.max(1, parseInt(params.get('adults') || '1', 10) || 1)
  const children = Math.max(0, parseInt(params.get('children') || '0', 10) || 0)
  return { adults, children }
}

export function FlightResultsPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()

  const from = (params.get('from') || '').toUpperCase()
  const to = (params.get('to') || '').toUpperCase()
  const depart = params.get('depart') || ''
  const ret = params.get('return') || ''
  const direct = params.get('direct') === '1'
  const trip = params.get('trip') || 'return'
  const passengerCount = parsePassengerCount(params)

  const [sort, setSort] = useState<SortKey>('price')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [maxStops, setMaxStops] = useState<number>(direct ? 0 : 2)
  const [selectedCarriers, setSelectedCarriers] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), 350)
    return () => window.clearTimeout(t)
  }, [from, to, depart, ret, trip])

  const allFlights = useMemo<FlightOption[]>(() => {
    if (!from || !to || !depart) return []
    return generateFlights({ from, to, depart, return: trip !== 'one-way' ? ret : undefined })
  }, [from, to, depart, ret, trip])

  const carriers = useMemo(() => {
    const m = new Map<string, string>()
    allFlights.forEach(f => {
      const c = f.outbound[0].carrier
      const code = f.outbound[0].carrierCode
      m.set(code, c)
    })
    return Array.from(m, ([code, name]) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [allFlights])

  const maxPriceCap = useMemo(() => {
    if (allFlights.length === 0) return 1000
    return Math.max(...allFlights.map(f => f.priceGBP))
  }, [allFlights])

  const filtered = useMemo(() => {
    return allFlights
      .filter(f => (maxPrice === null ? true : f.priceGBP <= maxPrice))
      .filter(f => f.stops <= maxStops)
      .filter(f =>
        selectedCarriers.size === 0 ? true : selectedCarriers.has(f.outbound[0].carrierCode),
      )
  }, [allFlights, maxPrice, maxStops, selectedCarriers])

  const sorted = useMemo(() => {
    const out = [...filtered]
    out.sort((a, b) => {
      if (sort === 'price') return a.priceGBP - b.priceGBP
      if (sort === 'duration') return a.totalDurationMins - b.totalDurationMins
      if (sort === 'stops') return a.stops - b.stops
      if (sort === 'depart') {
        return a.outbound[0].departTime.localeCompare(b.outbound[0].departTime)
      }
      return 0
    })
    return out
  }, [filtered, sort])

  const insights = useMemo(() => {
    if (allFlights.length === 0) {
      return {
        cheapest: null as FlightOption | null,
        fastest: null as FlightOption | null,
        bestValue: null as FlightOption | null,
        directCount: 0,
      }
    }

    const prices = allFlights.map(f => f.priceGBP)
    const durations = allFlights.map(getFlightDuration)
    const minPrice = Math.min(...prices)
    const maxPriceForScore = Math.max(...prices)
    const minDuration = Math.min(...durations)
    const maxDurationForScore = Math.max(...durations)
    const rangePrice = Math.max(1, maxPriceForScore - minPrice)
    const rangeDuration = Math.max(1, maxDurationForScore - minDuration)

    return {
      cheapest: allFlights.reduce((best, f) => (f.priceGBP < best.priceGBP ? f : best), allFlights[0]),
      fastest: allFlights.reduce(
        (best, f) => (getFlightDuration(f) < getFlightDuration(best) ? f : best),
        allFlights[0],
      ),
      bestValue: allFlights.reduce((best, f) => {
        const score = (f.priceGBP - minPrice) / rangePrice + (getFlightDuration(f) - minDuration) / rangeDuration
        const bestScore =
          (best.priceGBP - minPrice) / rangePrice + (getFlightDuration(best) - minDuration) / rangeDuration
        return score < bestScore ? f : best
      }, allFlights[0]),
      directCount: allFlights.filter(f => f.stops === 0).length,
    }
  }, [allFlights])

  function getBadges(flight: FlightOption): string[] {
    const badges: string[] = []
    if (insights.bestValue?.id === flight.id) badges.push('Best value')
    if (insights.cheapest?.id === flight.id) badges.push('Cheapest')
    if (insights.fastest?.id === flight.id) badges.push('Fastest')
    if (flight.seatsRemaining <= 5) badges.push('Few seats left')
    return badges
  }

  function toggleCarrier(code: string) {
    setSelectedCarriers(prev => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  function selectFlight(flight: FlightOption) {
    const q = new URLSearchParams(params)
    navigate(`/flights/${flight.id}?${q.toString()}`)
  }

  if (!from || !to || !depart) {
    return (
      <PageShell
        title="Start a flight search"
        subtitle="Tell us where you want to go and we'll build an itinerary."
      >
        <div className="bg-white py-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
          <p>We couldn't find a search to show. Head back to the home page and try again.</p>
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

  const paxTotal = passengerCount.adults + passengerCount.children
  const subtitle = (
    <>
      {from} → {to} · {formatIsoDate(depart)}
      {ret && trip !== 'one-way' ? ` – ${formatIsoDate(ret)}` : ''} · {paxTotal}{' '}
      {paxTotal === 1 ? 'traveller' : 'travellers'}
    </>
  )

  return (
    <PageShell
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Flights' }]}
      title={`Flights from ${from} to ${to}`}
      subtitle={subtitle}
      actions={
        <>
          <button
            type="button"
            className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => {
              const cheapest = allFlights[0]
              if (!cheapest) return
              addAlert({
                from,
                to,
                depart,
                returnDate: trip !== 'one-way' && ret ? ret : undefined,
                startingPriceGBP: cheapest.priceGBP,
              })
              pushToast({
                tone: 'success',
                title: 'Price alert saved',
                body: `We'll notify you when ${from} → ${to} drops.`,
              })
            }}
            disabled={allFlights.length === 0}
          >
            Watch this search
          </button>
          <Link
            className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on"
            to="/"
          >
            New search
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-[260px_1fr] gap-6 items-start max-[900px]:grid-cols-1">
        <aside className="flex flex-col gap-4 sticky top-4" aria-label="Filters">
          <div className="bg-white rounded-card p-4 shadow-card">
            <h3 className="m-0 mb-3 text-sm uppercase tracking-[0.06em] text-grey-600">Sort</h3>
            <label className="flex flex-col gap-1.5">
              <span>Sort by</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                className="w-full p-2 border border-grey-200 rounded-sm"
              >
                <option value="price">Price (low to high)</option>
                <option value="duration">Duration</option>
                <option value="depart">Departure time</option>
                <option value="stops">Stops</option>
              </select>
            </label>
          </div>

          <div className="bg-white rounded-card p-4 shadow-card">
            <h3 className="m-0 mb-3 text-sm uppercase tracking-[0.06em] text-grey-600">Stops</h3>
            <div className="flex flex-col gap-1.5">
              {[0, 1, 2].map(n => (
                <label key={n} className="flex gap-2 items-center text-grey-900 text-sm">
                  <input
                    type="radio"
                    name="max-stops"
                    value={n}
                    checked={maxStops === n}
                    onChange={() => setMaxStops(n)}
                  />
                  {n === 0 ? 'Direct only' : n === 1 ? 'Up to 1 stop' : 'Up to 2 stops'}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-card p-4 shadow-card">
            <h3 className="m-0 mb-3 text-sm uppercase tracking-[0.06em] text-grey-600">Max price</h3>
            <input
              type="range"
              min={0}
              max={maxPriceCap}
              step={10}
              value={maxPrice ?? maxPriceCap}
              onChange={e => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum price"
            />
            <div className="flex justify-between text-[13px] text-grey-600 mt-1.5">
              <span>£0</span>
              <strong>£{maxPrice ?? maxPriceCap}</strong>
              <span>£{maxPriceCap}</span>
            </div>
            <button
              type="button"
              className="bg-transparent border-0 p-0 text-purple cursor-pointer hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => setMaxPrice(null)}
              disabled={maxPrice === null}
            >
              Reset
            </button>
          </div>

          {carriers.length > 0 ? (
            <div className="bg-white rounded-card p-4 shadow-card">
              <h3 className="m-0 mb-3 text-sm uppercase tracking-[0.06em] text-grey-600">Airlines</h3>
              <div className="flex flex-col gap-1.5">
                {carriers.map(c => (
                  <label key={c.code} className="flex gap-2 items-center text-grey-900 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCarriers.has(c.code)}
                      onChange={() => toggleCarrier(c.code)}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </aside>

        <section>
          <CalendarPricingStrip
            from={from}
            to={to}
            depart={depart}
            returnDate={trip !== 'one-way' && ret ? ret : undefined}
            onPick={iso => {
              const next = new URLSearchParams(params)
              next.set('depart', iso)
              setParams(next)
            }}
          />
          {loading ? (
            <ResultsSkeleton />
          ) : (
            <>
              <p className="m-0 mb-3 text-grey-600">
                Showing <strong>{sorted.length}</strong> of {allFlights.length} flights
              </p>
              {allFlights.length > 0 ? (
                <div className="bg-white rounded-card shadow-card p-4 mb-4 grid grid-cols-[repeat(3,minmax(0,1fr))] gap-3 max-[720px]:grid-cols-1">
                  <div className="bg-grey-100 rounded-[10px] py-3 px-4">
                    <span className="block text-[11px] uppercase tracking-[0.08em] text-grey-600 mb-1">
                      Cheapest fare
                    </span>
                    <strong className="text-xl text-grey-900">
                      £{insights.cheapest?.priceGBP.toLocaleString()}
                    </strong>
                  </div>
                  <div className="bg-grey-100 rounded-[10px] py-3 px-4">
                    <span className="block text-[11px] uppercase tracking-[0.08em] text-grey-600 mb-1">
                      Fastest trip
                    </span>
                    <strong className="text-xl text-grey-900">
                      {insights.fastest ? formatDurationMins(getFlightDuration(insights.fastest)) : ''}
                    </strong>
                  </div>
                  <div className="bg-grey-100 rounded-[10px] py-3 px-4">
                    <span className="block text-[11px] uppercase tracking-[0.08em] text-grey-600 mb-1">
                      Direct flights
                    </span>
                    <strong className="text-xl text-grey-900">
                      {insights.directCount}
                    </strong>
                  </div>
                </div>
              ) : null}
              {sorted.length === 0 ? (
                <div className="bg-white py-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
                  <p>No flights match your filters. Try widening the stops or price.</p>
                </div>
              ) : (
                sorted.map(f => (
                  <FlightResultCard
                    key={f.id}
                    flight={f}
                    badges={getBadges(f)}
                    onSelect={() => selectFlight(f)}
                  />
                ))
              )}
            </>
          )}
        </section>
      </div>
    </PageShell>
  )
}
