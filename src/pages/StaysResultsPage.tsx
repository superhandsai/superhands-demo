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
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set())

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
    if (selectedAmenities.size > 0) {
      list = list.filter(s => Array.from(selectedAmenities).every(a => s.amenities.includes(a)))
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.nightlyGBP - b.nightlyGBP)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.nightlyGBP - a.nightlyGBP)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [query, typeFilter, maxPrice, selectedAmenities, sort])

  const types = Array.from(new Set(STAYS.map(s => s.type))).sort()
  const amenities = Array.from(new Set(STAYS.flatMap(s => s.amenities))).sort()
  const hasFilters = Boolean(typeFilter || maxPrice !== null || selectedAmenities.size > 0)

  function toggleAmenity(amenity: string) {
    setSelectedAmenities(prev => {
      const next = new Set(prev)
      if (next.has(amenity)) next.delete(amenity)
      else next.add(amenity)
      return next
    })
  }

  function resetFilters() {
    setTypeFilter('')
    setMaxPrice(null)
    setSelectedAmenities(new Set())
  }

  return (
    <PageShell
      title={query ? `Stays in ${query}` : 'All stays'}
      subtitle={`${guests} guests${checkIn && checkOut ? ` · ${checkIn} – ${checkOut}` : ''}`}
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Stays', to: '/stays' }, { label: 'Results' }]}
    >
      <div className="grid grid-cols-[260px_1fr] gap-6 items-start max-[900px]:grid-cols-1">
        <aside className="flex flex-col gap-4 sticky top-4">
          <div className="bg-white rounded-card p-4 shadow-card">
            <h3 className="mt-0 mb-3 text-sm uppercase tracking-[0.06em] text-grey-600">Sort</h3>
            <select
              className="w-full p-2 border border-grey-200 rounded-sm"
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price (low to high)</option>
              <option value="price-desc">Price (high to low)</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div className="bg-white rounded-card p-4 shadow-card">
            <h3 className="mt-0 mb-3 text-sm uppercase tracking-[0.06em] text-grey-600">Type</h3>
            <label className="flex gap-2 items-center text-grey-900 text-sm">
              <input
                type="radio"
                name="type"
                checked={!typeFilter}
                onChange={() => setTypeFilter('')}
              />
              Any
            </label>
            {types.map(t => (
              <label key={t} className="flex gap-2 items-center text-grey-900 text-sm">
                <input
                  type="radio"
                  name="type"
                  checked={typeFilter === t}
                  onChange={() => setTypeFilter(t)}
                />
                {t}
              </label>
            ))}
          </div>
          <div className="bg-white rounded-card p-4 shadow-card">
            <h3 className="mt-0 mb-3 text-sm uppercase tracking-[0.06em] text-grey-600">
              Max nightly price
            </h3>
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={maxPrice ?? 500}
              onChange={e => setMaxPrice(Number(e.target.value))}
            />
            <div className="flex justify-between text-[13px] text-grey-600 mt-1.5">
              <span>£0</span>
              <strong>£{maxPrice ?? 500}</strong>
              <span>£500+</span>
            </div>
          </div>
          <div className="bg-white rounded-card p-4 shadow-card">
            <h3 className="mt-0 mb-3 text-sm uppercase tracking-[0.06em] text-grey-600">
              Amenities
            </h3>
            <div className="flex flex-col gap-1.5">
              {amenities.map(a => (
                <label key={a} className="flex gap-2 items-center text-grey-900 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.has(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>
          {hasFilters ? (
            <button
              type="button"
              className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          ) : null}
        </aside>
        <section>
          {hasFilters ? (
            <div className="flex flex-wrap gap-2 mb-3" aria-label="Selected filters">
              {typeFilter ? (
                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-purple-soft text-purple border-0 py-1.5 px-3 text-xs font-semibold cursor-pointer"
                  onClick={() => setTypeFilter('')}
                >
                  {typeFilter} x
                </button>
              ) : null}
              {maxPrice !== null ? (
                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-purple-soft text-purple border-0 py-1.5 px-3 text-xs font-semibold cursor-pointer"
                  onClick={() => setMaxPrice(null)}
                >
                  Up to £{maxPrice} x
                </button>
              ) : null}
              {Array.from(selectedAmenities).map(a => (
                <button
                  key={a}
                  type="button"
                  className="inline-flex items-center rounded-full bg-purple-soft text-purple border-0 py-1.5 px-3 text-xs font-semibold cursor-pointer"
                  onClick={() => toggleAmenity(a)}
                >
                  {a} x
                </button>
              ))}
            </div>
          ) : null}
          <p className="m-0 mb-3 text-grey-600">{results.length} stays</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
            {results.map(s => (
              <Link
                key={s.id}
                className="block bg-white rounded-card shadow-card overflow-hidden text-inherit no-underline transition-shadow hover:shadow-card-hover hover:no-underline"
                to={`/stays/${s.id}`}
              >
                <img className="w-full h-[180px] object-cover" src={s.image} alt="" />
                <div className="p-4">
                  <p className="text-grey-600 text-[13px] m-0">
                    {s.location}, {s.country}
                  </p>
                  <h3 className="text-grey-900 mt-1 mb-1.5 text-base">{s.name}</h3>
                  <p className="text-grey-600 text-[13px] my-1">
                    {s.type} · ★ {s.rating} ({s.reviewCount})
                  </p>
                  <p className="text-grey-900 mt-2 mb-0">
                    <strong>£{s.nightlyGBP}</strong> / night
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {results.length === 0 ? (
            <div className="bg-white p-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
              <p>No matching stays. Try widening the filters.</p>
              {hasFilters ? (
                <button
                  type="button"
                  className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
                  onClick={resetFilters}
                >
                  Reset filters
                </button>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </PageShell>
  )
}
