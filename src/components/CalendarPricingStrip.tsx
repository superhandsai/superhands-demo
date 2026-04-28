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
    <div
      className="grid grid-cols-7 gap-2 mb-4 overflow-x-auto max-[720px]:grid-flow-col max-[720px]:grid-cols-[repeat(7,100px)]"
      role="tablist"
      aria-label="Lowest fares by date"
    >
      {days.map(d => {
        const selected = d.offset === 0
        const best = d.lowest !== null && d.lowest === cheapest
        const borderClass = selected
          ? 'border-purple shadow-[0_0_0_2px_rgba(96,93,236,0.25)]'
          : best
            ? 'border-success'
            : 'border-grey-200 hover:border-purple'
        return (
          <button
            key={d.iso}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`bg-white border rounded-xl py-[10px] px-2 flex flex-col items-center gap-0.5 cursor-pointer relative transition-[border-color,box-shadow] duration-150 min-w-0 font-[inherit] ${borderClass}`}
            onClick={() => onPick(d.iso)}
          >
            <span className="text-[11px] uppercase tracking-[0.08em] text-grey-600">{d.weekday}</span>
            <span className="font-bold text-grey-900 text-sm">
              {d.day} {d.month}
            </span>
            <span className="text-xs text-grey-600">
              {d.lowest !== null ? `from £${d.lowest}` : '—'}
            </span>
            {best && !selected ? (
              <span className="absolute -top-2 right-1.5 bg-success text-white rounded-full py-0.5 px-2 text-[10px] font-semibold uppercase tracking-[0.06em]">
                Cheapest
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
