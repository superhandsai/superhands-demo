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
      <div className="destinations-toolbar">
        <input
          placeholder="Search destinations"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="destinations-chips" role="tablist">
          {continents.map(c => (
            <button
              key={c}
              type="button"
              className={`chip ${continent === c ? 'is-active' : ''}`}
              onClick={() => setContinent(c)}
              aria-pressed={continent === c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="destinations-grid">
        {list.map(d => (
          <Link key={d.id} to={`/flights?to=${d.airportCode}&depart=2026-06-15&return=2026-06-22&adults=1&children=0&trip=return`} className="destination-card">
            <img src={d.image} alt="" />
            <div className="destination-card__body">
              <h3>{d.city}, <span className="text-accent">{d.country}</span></h3>
              <p>{d.description}</p>
              <p className="destination-card__price">From £{d.fromPriceGBP}</p>
            </div>
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty-state"><p>No destinations match that search.</p></div>
      ) : null}
    </PageShell>
  )
}
