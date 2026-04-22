import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from './PageShell'
import { STAYS } from '../data/stays'

export function StaysPage() {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (destination) p.set('q', destination)
    if (checkIn) p.set('in', checkIn)
    if (checkOut) p.set('out', checkOut)
    p.set('guests', String(guests))
    navigate(`/stays/results?${p.toString()}`)
  }

  return (
    <PageShell
      title="Find a place to stay"
      subtitle="Hotels, villas, and unique retreats — hand-picked by the Tripma team."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Stays' }]}
    >
      <form className="stays-search" onSubmit={onSubmit}>
        <label className="field">
          <span>Where</span>
          <input
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="City, country, or hotel"
          />
        </label>
        <label className="field">
          <span>Check in</span>
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
        </label>
        <label className="field">
          <span>Check out</span>
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
        </label>
        <label className="field">
          <span>Guests</span>
          <input
            type="number"
            min={1}
            max={8}
            value={guests}
            onChange={e => setGuests(Math.max(1, Math.min(8, Number(e.target.value) || 1)))}
          />
        </label>
        <button type="submit" className="btn btn--primary">Search stays</button>
      </form>

      <h2 className="trip-section__title">Popular stays</h2>
      <div className="stay-grid">
        {STAYS.map(s => (
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
    </PageShell>
  )
}
