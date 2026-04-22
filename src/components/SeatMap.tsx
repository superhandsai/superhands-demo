import { useMemo } from 'react'

export interface SeatMapProps {
  rows?: number
  takenSeed?: number
  selectedByPassenger: Record<string, string>
  currentPassengerId: string | null
  onSelect: (seat: string) => void
}

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const COLS: readonly string[] = ['A', 'B', 'C', 'D', 'E', 'F']

export function SeatMap({
  rows = 20,
  takenSeed = 42,
  selectedByPassenger,
  currentPassengerId,
  onSelect,
}: SeatMapProps) {
  const taken = useMemo(() => {
    const rng = mulberry32(takenSeed)
    const s = new Set<string>()
    for (let r = 1; r <= rows; r++) {
      for (const c of COLS) {
        if (rng() < 0.35) s.add(`${r}${c}`)
      }
    }
    return s
  }, [rows, takenSeed])

  const ownedBy = useMemo(() => {
    const m = new Map<string, string>()
    Object.entries(selectedByPassenger).forEach(([pid, seat]) => {
      if (seat) m.set(seat, pid)
    })
    return m
  }, [selectedByPassenger])

  return (
    <div className="seat-map" role="grid" aria-label="Seat map">
      <div className="seat-map__header" aria-hidden>
        {COLS.map(c => (
          <span key={c}>{c}</span>
        ))}
      </div>
      {Array.from({ length: rows }, (_, ri) => {
        const row = ri + 1
        return (
          <div key={row} className="seat-map__row" role="row">
            <span className="seat-map__row-num" aria-hidden>{row}</span>
            {COLS.map((col) => {
              const seat = `${row}${col}`
              const isOwn = Object.values(selectedByPassenger).includes(seat)
              const ownerId = ownedBy.get(seat)
              const isCurrent = ownerId === currentPassengerId
              const isTaken = taken.has(seat) && !isOwn
              const disabled = isTaken || !currentPassengerId || (isOwn && !isCurrent)
              return (
                <button
                  key={seat}
                  type="button"
                  role="gridcell"
                  aria-label={`Seat ${seat}${isTaken ? ' taken' : ''}`}
                  className={`seat ${isTaken ? 'is-taken' : ''} ${isCurrent ? 'is-selected' : ''} ${isOwn && !isCurrent ? 'is-owned' : ''}`}
                  disabled={disabled}
                  onClick={() => onSelect(seat)}
                >
                  {col}
                </button>
              )
            }).flatMap((el, i) =>
              i === 2 ? [el, <span key={`aisle-${row}`} className="seat-map__aisle" aria-hidden />] : [el],
            )}
          </div>
        )
      })}
    </div>
  )
}
