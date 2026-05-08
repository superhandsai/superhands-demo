import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageShell } from './PageShell'
import { DESTINATIONS, type Destination } from '../data/destinations'

type Continent = Destination['continent'] | 'All'
type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'city'

export function DestinationsPage() {
  const [continent, setContinent] = useState<Continent>('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('recommended')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = DESTINATIONS.filter(d => {
      if (continent !== 'All' && d.continent !== continent) return false
      if (!q) return true
      return d.city.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    })
    if (sort === 'price-asc') return [...filtered].sort((a, b) => a.fromPriceGBP - b.fromPriceGBP)
    if (sort === 'price-desc') return [...filtered].sort((a, b) => b.fromPriceGBP - a.fromPriceGBP)
    if (sort === 'city') return [...filtered].sort((a, b) => a.city.localeCompare(b.city))
    return filtered
  }, [continent, query, sort])

  const continents: Continent[] = ['All', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania']
  const hasFilters = Boolean(query.trim() || continent !== 'All')

  function resetFilters() {
    setQuery('')
    setContinent('All')
    setSort('recommended')
  }

  return (
    <PageShell
      title="Where would you like to go?"
      subtitle="Browse our hand-picked destinations and find your next adventure."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Destinations' }]}
    >
      <div className="flex gap-3 items-center mb-4 flex-wrap">
        <input
          placeholder="Search destinations"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 min-w-[200px] py-3 px-4 border border-grey-200 rounded-card text-[15px] font-sans"
        />
        <div className="flex gap-1.5 flex-wrap" role="tablist">
          {continents.map(c => (
            <button
              key={c}
              type="button"
              className={`py-2 px-3.5 border rounded-full font-sans cursor-pointer text-xs ${
                continent === c
                  ? 'bg-purple text-white border-purple'
                  : 'bg-white text-grey-600 border-grey-200'
              }`}
              onClick={() => setContinent(c)}
              aria-pressed={continent === c}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-grey-600">
          <span>Sort</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="py-2 px-3 border border-grey-200 rounded-sm bg-white font-sans text-grey-900"
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
            <option value="city">City A-Z</option>
          </select>
        </label>
      </div>

      <div className="flex justify-between items-center gap-3 mb-4 flex-wrap">
        <p className="m-0 text-sm text-grey-600">
          Showing <strong>{list.length}</strong> of {DESTINATIONS.length} destinations
        </p>
        {hasFilters ? (
          <button
            type="button"
            className="bg-transparent border-0 p-0 text-purple cursor-pointer hover:underline"
            onClick={resetFilters}
          >
            Reset destination filters
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {list.map(d => (
          <Link
            key={d.id}
            to={`/flights?to=${d.airportCode}&depart=2026-06-15&return=2026-06-22&adults=1&children=0&trip=return`}
            className="bg-white rounded-card overflow-hidden shadow-card text-inherit no-underline transition-shadow flex flex-col hover:shadow-card-hover hover:no-underline"
          >
            <img src={d.image} alt="" className="w-full h-[180px] object-cover" />
            <div className="p-4">
              <h3 className="m-0 mb-1.5 text-grey-900 text-base">{d.city}, <span className="text-purple">{d.country}</span></h3>
              <p className="text-grey-600 text-sm m-0 mb-2">{d.description}</p>
              <p className="text-purple font-bold m-0">From £{d.fromPriceGBP}</p>
            </div>
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="bg-white py-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
          <p>No destinations match that search.</p>
          <button
            type="button"
            className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
            onClick={resetFilters}
          >
            Show all destinations
          </button>
        </div>
      ) : null}
    </PageShell>
  )
}
