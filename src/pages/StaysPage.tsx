import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from './PageShell'
import { STAYS } from '../data/stays'

const fieldLabelCls = 'flex flex-col gap-1.5 text-sm text-grey-900'
const fieldInputCls =
  'font-sans text-[15px] px-3 py-2.5 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-1'

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
      <form
        className="bg-white rounded-card p-5 shadow-card grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-end mb-6 max-[900px]:grid-cols-[1fr_1fr]"
        onSubmit={onSubmit}
      >
        <label className={fieldLabelCls}>
          <span className="text-grey-600 font-semibold">Where</span>
          <input
            className={fieldInputCls}
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="City, country, or hotel"
          />
        </label>
        <label className={fieldLabelCls}>
          <span className="text-grey-600 font-semibold">Check in</span>
          <input
            className={fieldInputCls}
            type="date"
            value={checkIn}
            onChange={e => setCheckIn(e.target.value)}
          />
        </label>
        <label className={fieldLabelCls}>
          <span className="text-grey-600 font-semibold">Check out</span>
          <input
            className={fieldInputCls}
            type="date"
            value={checkOut}
            onChange={e => setCheckOut(e.target.value)}
          />
        </label>
        <label className={fieldLabelCls}>
          <span className="text-grey-600 font-semibold">Guests</span>
          <input
            className={fieldInputCls}
            type="number"
            min={1}
            max={8}
            value={guests}
            onChange={e => setGuests(Math.max(1, Math.min(8, Number(e.target.value) || 1)))}
          />
        </label>
        <button
          type="submit"
          className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
        >
          Search stays
        </button>
      </form>

      <h2 className="text-grey-900 mt-4 mb-3 text-lg">Popular stays</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
        {STAYS.map(s => (
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
    </PageShell>
  )
}
