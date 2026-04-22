import { useMemo } from 'react'
import { generateFlights } from '../data/flights'

export interface CalendarPricingStripProps {
  from: string
  to: string
  depart: string
  returnDate?: string
  onPick: (isoDate: string) => void
}

function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, (m ?? 1) - 1, (d ?? 1) + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`
}

function formatDay(iso: string): { weekday: string; day: string; month: string } {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, (m ?? 1) - 1, (d ?? 1))
  return {
    weekday: dt.toLocaleDateString('en-GB', { weekday: 'short' }),
    day: dt.toLocaleDateString('en-GB', { day: 'numeric' }),
    month: dt.toLocaleDateString('en-GB', { month: 'short' }),
  }
}

export function CalendarPricingStrip({
  from,
  to,
  depart,
  returnDate,
  onPick,
}: CalendarPricingStripProps) {
  const days = useMemo(() => {
    const offsets = [-3, -2, -1, 0, 1, 2, 3]
    return offsets.map(offset => {
      const iso = addDaysIso(depart, offset)
      const fares = generateFlights({ from, to, depart: iso, return: returnDate })
      const lowest = fares.length ? Math.min(...fares.map(f => f.priceGBP)) : null
      return { iso, offset, lowest, ...formatDay(iso) }
    })
  }, [from, to, depart, returnDate])

  const cheapest = useMemo(() => {
    const valid = days.filter(d => d.lowest !== null).map(d => d.lowest as number)
    return valid.length ? Math.min(...valid) : null
  }, [days])

  return (
    <div className="cal-strip" role="tablist" aria-label="Lowest fares by date">
      {days.map(d => {
        const selected = d.offset === 0
        const best = d.lowest !== null && d.lowest === cheapest
        return (
          <button
            key={d.iso}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`cal-strip__day ${selected ? 'is-selected' : ''} ${best && !selected ? 'is-best' : ''}`}
            onClick={() => onPick(d.iso)}
          >
            <span className="cal-strip__weekday">{d.weekday}</span>
            <span className="cal-strip__date">
              {d.day} {d.month}
            </span>
            <span className="cal-strip__price">
              {d.lowest !== null ? `from £${d.lowest}` : '—'}
            </span>
            {best && !selected ? <span className="cal-strip__best">Cheapest</span> : null}
          </button>
        )
      })}
    </div>
  )
}
