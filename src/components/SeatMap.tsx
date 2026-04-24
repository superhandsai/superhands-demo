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
    <div className="bg-[#fafaff] p-4 rounded-card overflow-x-auto" role="grid" aria-label="Seat map">
      <div
        className="grid grid-cols-[32px_repeat(3,28px)_12px_repeat(3,28px)] gap-1.5 text-grey-600 text-xs ml-8 mb-1.5 text-center"
        aria-hidden
      >
        {COLS.map(c => (
          <span key={c}>{c}</span>
        ))}
      </div>
      {Array.from({ length: rows }, (_, ri) => {
        const row = ri + 1
        return (
          <div
            key={row}
            className="grid grid-cols-[32px_repeat(3,28px)_12px_repeat(3,28px)] gap-1.5 items-center mb-1.5"
            role="row"
          >
            <span className="text-grey-600 text-xs text-right pr-1.5" aria-hidden>{row}</span>
            {COLS.map((col) => {
              const seat = `${row}${col}`
              const isOwn = Object.values(selectedByPassenger).includes(seat)
              const ownerId = ownedBy.get(seat)
              const isCurrent = ownerId === currentPassengerId
              const isTaken = taken.has(seat) && !isOwn
              const disabled = isTaken || !currentPassengerId || (isOwn && !isCurrent)
              const stateClass = isTaken
                ? 'bg-grey-200 text-grey-400 border-grey-200 cursor-not-allowed'
                : isCurrent
                  ? 'bg-purple text-white border-purple'
                  : isOwn
                    ? 'bg-purple-on text-purple border-purple'
                    : 'bg-white text-grey-600 border-grey-200 hover:border-purple hover:bg-purple-on'
              return (
                <button
                  key={seat}
                  type="button"
                  role="gridcell"
                  aria-label={`Seat ${seat}${isTaken ? ' taken' : ''}`}
                  className={`w-7 h-7 border rounded-md cursor-pointer text-[11px] font-[inherit] ${stateClass} disabled:cursor-not-allowed`}
                  disabled={disabled}
                  onClick={() => onSelect(seat)}
                >
                  {col}
                </button>
              )
            }).flatMap((el, i) =>
              i === 2 ? [el, <span key={`aisle-${row}`} className="w-3" aria-hidden />] : [el],
            )}
          </div>
        )
      })}
    </div>
  )
}
