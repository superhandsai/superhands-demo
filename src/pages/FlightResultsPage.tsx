import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PageShell } from './PageShell'
import { FlightResultCard } from '../components/FlightResultCard'
import { CalendarPricingStrip } from '../components/CalendarPricingStrip'
import { ResultsSkeleton } from '../components/ResultsSkeleton'
import {
  formatIsoDate,
  generateFlights,
  type FlightOption,
} from '../data/flights'

type SortKey = 'price' | 'duration' | 'depart' | 'stops'

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
        <div className="empty-state">
          <p>We couldn't find a search to show. Head back to the home page and try again.</p>
          <Link className="btn btn--primary" to="/">Back to home</Link>
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
      actions={<Link className="btn btn--secondary" to="/">New search</Link>}
    >
      <div className="results-layout">
        <aside className="results-filters" aria-label="Filters">
          <div className="filter-panel">
            <h3>Sort</h3>
            <label className="filter-row">
              <span>Sort by</span>
              <select value={sort} onChange={e => setSort(e.target.value as SortKey)}>
                <option value="price">Price (low to high)</option>
                <option value="duration">Duration</option>
                <option value="depart">Departure time</option>
                <option value="stops">Stops</option>
              </select>
            </label>
          </div>

          <div className="filter-panel">
            <h3>Stops</h3>
            <div className="filter-radios">
              {[0, 1, 2].map(n => (
                <label key={n} className="filter-radio">
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

          <div className="filter-panel">
            <h3>Max price</h3>
            <input
              type="range"
              min={0}
              max={maxPriceCap}
              step={10}
              value={maxPrice ?? maxPriceCap}
              onChange={e => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum price"
            />
            <div className="filter-price-row">
              <span>£0</span>
              <strong>£{maxPrice ?? maxPriceCap}</strong>
              <span>£{maxPriceCap}</span>
            </div>
            <button
              type="button"
              className="link-more"
              onClick={() => setMaxPrice(null)}
              disabled={maxPrice === null}
            >
              Reset
            </button>
          </div>

          {carriers.length > 0 ? (
            <div className="filter-panel">
              <h3>Airlines</h3>
              <div className="filter-checks">
                {carriers.map(c => (
                  <label key={c.code} className="filter-check">
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

        <section className="results-list">
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
              <p className="results-summary">
                Showing <strong>{sorted.length}</strong> of {allFlights.length} flights
              </p>
              {sorted.length === 0 ? (
                <div className="empty-state">
                  <p>No flights match your filters. Try widening the stops or price.</p>
                </div>
              ) : (
                sorted.map(f => (
                  <FlightResultCard key={f.id} flight={f} onSelect={() => selectFlight(f)} />
                ))
              )}
            </>
          )}
        </section>
      </div>
    </PageShell>
  )
}
