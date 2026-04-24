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
      <div className="bg-white p-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
        <p>No flight selected.</p>
        <Link
          className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
          to="/"
        >
          Back to home
        </Link>
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
    <div className="grid grid-cols-[1fr_340px] gap-6 items-start max-[900px]:grid-cols-1">
      <section>
        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="mt-0 mb-2 text-xl text-grey-900">Choose seats — Outbound</h2>
          <p className="mt-0 mb-4 text-grey-600 text-sm">
            Seats are held for 20 minutes. Window and aisle seats go first.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {draft.passengers.map(p => (
              <button
                key={p.id}
                type="button"
                className={`bg-white p-2 px-3 rounded-card cursor-pointer flex flex-col items-start font-sans ${
                  p.id === currentPid
                    ? 'border border-purple bg-purple-on'
                    : 'border border-grey-200'
                }`}
                onClick={() => setCurrentPid(p.id)}
                aria-pressed={p.id === currentPid}
              >
                <span className="text-[13px] text-grey-600">
                  {p.firstName || 'Traveller'} {p.lastName}
                </span>
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
          <div className="flex gap-4 mt-4 text-[13px] text-grey-600 flex-wrap">
            <span>
              <span className="inline-block w-3 h-3 mr-1.5 bg-white border border-grey-200 align-middle rounded-[3px]" />{' '}
              Available
            </span>
            <span>
              <span className="inline-block w-3 h-3 mr-1.5 bg-grey-200 border border-grey-200 align-middle rounded-[3px]" />{' '}
              Taken
            </span>
            <span>
              <span className="inline-block w-3 h-3 mr-1.5 bg-purple border border-purple align-middle rounded-[3px]" />{' '}
              Your pick
            </span>
          </div>
        </div>
      </section>
      <aside className="sticky top-4">
        <PriceSummary
          draft={draft}
          cta={{ label: 'Continue to extras', onClick: () => navigate('/book/extras') }}
        >
          <p className="text-[13px] text-grey-600 my-2">
            You can skip seat selection and be assigned a seat at check-in.
          </p>
          <button
            type="button"
            className="text-purple no-underline font-normal hover:underline bg-transparent border-0 p-0 cursor-pointer block mt-2 text-center w-full"
            onClick={() => navigate('/book/extras')}
          >
            Skip for now
          </button>
        </PriceSummary>
      </aside>
    </div>
  )
}
