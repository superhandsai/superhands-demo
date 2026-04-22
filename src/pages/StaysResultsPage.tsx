import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageShell } from './PageShell'
import { STAYS, type Stay } from '../data/stays'

type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'rating'

export function StaysResultsPage() {
  const [params] = useSearchParams()
  const query = (params.get('q') || '').toLowerCase()
  const guests = Math.max(1, Number(params.get('guests') || '2') || 2)
  const checkIn = params.get('in') || ''
  const checkOut = params.get('out') || ''

  const [sort, setSort] = useState<SortKey>('recommended')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('')

  const results = useMemo(() => {
    let list: Stay[] = STAYS.filter(s => {
      if (!query) return true
      return (
        s.name.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query) ||
        s.country.toLowerCase().includes(query)
      )
    })
    if (typeFilter) list = list.filter(s => s.type === typeFilter)
    if (maxPrice !== null) list = list.filter(s => s.nightlyGBP <= maxPrice)
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.nightlyGBP - b.nightlyGBP)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.nightlyGBP - a.nightlyGBP)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [query, typeFilter, maxPrice, sort])

  const types = Array.from(new Set(STAYS.map(s => s.type))).sort()

  return (
    <PageShell
      title={query ? `Stays in ${query}` : 'All stays'}
      subtitle={`${guests} guests${checkIn && checkOut ? ` · ${checkIn} – ${checkOut}` : ''}`}
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Stays', to: '/stays' }, { label: 'Results' }]}
    >
      <div className="results-layout">
        <aside className="results-filters">
          <div className="filter-panel">
            <h3>Sort</h3>
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)}>
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price (low to high)</option>
              <option value="price-desc">Price (high to low)</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div className="filter-panel">
            <h3>Type</h3>
            <label className="filter-radio">
              <input type="radio" name="type" checked={!typeFilter} onChange={() => setTypeFilter('')} />
              Any
            </label>
            {types.map(t => (
              <label key={t} className="filter-radio">
                <input type="radio" name="type" checked={typeFilter === t} onChange={() => setTypeFilter(t)} />
                {t}
              </label>
            ))}
          </div>
          <div className="filter-panel">
            <h3>Max nightly price</h3>
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={maxPrice ?? 500}
              onChange={e => setMaxPrice(Number(e.target.value))}
            />
            <div className="filter-price-row">
              <span>£0</span>
              <strong>£{maxPrice ?? 500}</strong>
              <span>£500+</span>
            </div>
          </div>
        </aside>
        <section className="results-list">
          <p className="results-summary">{results.length} stays</p>
          <div className="stay-grid">
            {results.map(s => (
              <Link key={s.id} className="stay-card" to={`/stays/${s.id}`}>
                <img src={s.image} alt="" />
                <div className="stay-card__body">
                  <p className="stay-card__loc">{s.location}, {s.country}</p>
                  <h3>{s.name}</h3>
                  <p className="stay-card__meta">{s.type} · ★ {s.rating} ({s.reviewCount})</p>
                  <p className="stay-card__price"><strong>£{s.nightlyGBP}</strong> / night</p>
                </div>
              </Link>
            ))}
          </div>
          {results.length === 0 ? (
            <div className="empty-state"><p>No matching stays. Try widening the filters.</p></div>
          ) : null}
        </section>
      </div>
    </PageShell>
  )
}
