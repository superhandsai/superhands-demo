import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PriceSummary } from '../components/PriceSummary'
import { SeatMap } from '../components/SeatMap'
import { checkoutStore } from '../lib/checkoutStore'
import { useStore } from '../lib/useStore'

function hash(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function SeatsPage() {
  const draft = useStore(checkoutStore)
  const navigate = useNavigate()
  const firstSegmentId = draft.flight?.outbound[0] ? `${draft.flight.id}:out1` : ''
  const [currentPid, setCurrentPid] = useState<string>(() => draft.passengers[0]?.id ?? '')

  const selectedForCurrentSegment: Record<string, string> = useMemo(() => {
    const m: Record<string, string> = {}
    draft.seats.forEach(s => {
      if (s.segmentId === firstSegmentId) m[s.passengerId] = s.seat
    })
    return m
  }, [draft.seats, firstSegmentId])

  if (!draft.flight) {
    return (
      <div className="empty-state">
        <p>No flight selected.</p>
        <Link className="btn btn--primary" to="/">Back to home</Link>
      </div>
    )
  }

  const takenSeed = hash(draft.flight.id)

  function pickSeat(seat: string) {
    if (!currentPid) return
    checkoutStore.set(d => {
      const others = d.seats.filter(
        s => !(s.segmentId === firstSegmentId && s.passengerId === currentPid),
      )
      return { ...d, seats: [...others, { passengerId: currentPid, segmentId: firstSegmentId, seat }] }
    })
  }

  return (
    <div className="checkout-layout">
      <section className="checkout-main">
        <div className="detail-card">
          <h2>Choose seats — Outbound</h2>
          <p className="detail-card__sub">
            Seats are held for 20 minutes. Window and aisle seats go first.
          </p>
          <div className="seat-passengers">
            {draft.passengers.map(p => (
              <button
                key={p.id}
                type="button"
                className={`seat-passenger ${p.id === currentPid ? 'is-active' : ''}`}
                onClick={() => setCurrentPid(p.id)}
                aria-pressed={p.id === currentPid}
              >
                <span>{p.firstName || 'Traveller'} {p.lastName}</span>
                <strong>{selectedForCurrentSegment[p.id] || 'Pick seat'}</strong>
              </button>
            ))}
          </div>
          <SeatMap
            takenSeed={takenSeed}
            selectedByPassenger={selectedForCurrentSegment}
            currentPassengerId={currentPid}
            onSelect={pickSeat}
          />
          <div className="seat-legend">
            <span><span className="seat-chip" /> Available</span>
            <span><span className="seat-chip is-taken" /> Taken</span>
            <span><span className="seat-chip is-selected" /> Your pick</span>
          </div>
        </div>
      </section>
      <aside className="checkout-side">
        <PriceSummary
          draft={draft}
          cta={{ label: 'Continue to extras', onClick: () => navigate('/book/extras') }}
        >
          <p className="summary-card__small">You can skip seat selection and be assigned a seat at check-in.</p>
          <button
            type="button"
            className="link-more summary-card__skip"
            onClick={() => navigate('/book/extras')}
          >
            Skip for now
          </button>
        </PriceSummary>
      </aside>
    </div>
  )
}
