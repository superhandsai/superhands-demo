import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageShell } from './PageShell'
import { DESTINATIONS, type Destination } from '../data/destinations'

type Continent = Destination['continent'] | 'All'

export function DestinationsPage() {
  const [continent, setContinent] = useState<Continent>('All')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DESTINATIONS.filter(d => {
      if (continent !== 'All' && d.continent !== continent) return false
      if (!q) return true
      return d.city.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    })
  }, [continent, query])

  const continents: Continent[] = ['All', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania']

  return (
    <PageShell
      title="Where would you like to go?"
      subtitle="Browse our hand-picked destinations and find your next adventure."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Destinations' }]}
    >
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex gap-1.5 flex-nowrap overflow-x-auto" role="tablist">
          {continents.map(c => (
            <button
              key={c}
              type="button"
              className={`shrink-0 py-2 px-3.5 border rounded-full font-sans cursor-pointer text-xs ${
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
        <input
          placeholder="Search destinations"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full py-3 px-4 border border-grey-200 rounded-card text-[15px] font-sans"
        />
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
        <div className="bg-white py-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4"><p>No destinations match that search.</p></div>
      ) : null}
    </PageShell>
  )
}
