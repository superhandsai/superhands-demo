import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageShell } from './PageShell'

type Status = 'scheduled' | 'boarding' | 'departed' | 'landed' | 'delayed'

interface StatusState {
  status: Status
  gate: string
  delayMins: number
  lastUpdated: number
}

function hash(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const STATUS_LABELS: Record<Status, string> = {
  scheduled: 'Scheduled',
  boarding: 'Boarding',
  departed: 'Departed',
  landed: 'Landed',
  delayed: 'Delayed',
}

const STATUS_CHIP_CLASSES: Record<Status, string> = {
  scheduled: 'bg-purple-soft text-purple',
  boarding: 'bg-warn-soft text-warn',
  departed: 'bg-info-soft text-info',
  landed: 'bg-success-soft text-success',
  delayed: 'bg-danger-soft text-danger',
}

export function FlightStatusPage() {
  const [params, setParams] = useSearchParams()
  const queryNo = (params.get('no') || '').toUpperCase()
  const [draft, setDraft] = useState(queryNo)

  const initial = useMemo<StatusState>(() => {
    if (!queryNo) return { status: 'scheduled', gate: 'TBD', delayMins: 0, lastUpdated: Date.now() }
    const h = hash(queryNo)
    const gate = `${String.fromCharCode(65 + (h % 6))}${10 + (h % 35)}`
    const delay = h % 5 === 0 ? 25 : 0
    return {
      status: delay ? 'delayed' : 'scheduled',
      gate,
      delayMins: delay,
      lastUpdated: Date.now(),
    }
  }, [queryNo])

  const [state, setState] = useState<StatusState>(initial)

  useEffect(() => setState(initial), [initial])

  const progression: Status[] = ['scheduled', 'boarding', 'departed', 'landed']

  function advance() {
    setState(s => {
      const idx = progression.indexOf(s.status === 'delayed' ? 'scheduled' : s.status)
      const next = progression[Math.min(progression.length - 1, idx + 1)]
      return { ...s, status: next, lastUpdated: Date.now() }
    })
  }

  function toggleDelay() {
    setState(s => ({
      ...s,
      status: s.status === 'delayed' ? 'scheduled' : 'delayed',
      delayMins: s.status === 'delayed' ? 0 : 30 + Math.round(Math.random() * 45),
      lastUpdated: Date.now(),
    }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next = new URLSearchParams(params)
    if (draft.trim()) next.set('no', draft.trim().toUpperCase())
    else next.delete('no')
    setParams(next)
  }

  const activeIdx = progression.indexOf(state.status === 'delayed' ? 'scheduled' : state.status)

  return (
    <PageShell
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Flight status' }]}
      title="Flight status"
      subtitle={queryNo ? `Tracking ${queryNo}` : 'Enter a flight number to see live status.'}
    >
      <form className="bg-white rounded-card p-6 shadow-card mb-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-grey-900 col-span-full">
            <span className="text-grey-600 font-semibold">Flight number</span>
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="e.g. BA2490"
              autoComplete="off"
              className="font-sans text-[15px] py-2.5 px-3 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-[1px]"
            />
          </label>
        </div>
        <button
          type="submit"
          className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
        >
          Track flight
        </button>
      </form>

      {queryNo ? (
        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <div className="flex justify-between items-start gap-4 mb-5">
            <div>
              <h2 className="m-0 mb-1 text-xl text-grey-900">{queryNo}</h2>
              <span className="text-grey-600 text-xs">Updated {Math.round((Date.now() - state.lastUpdated) / 1000)}s ago</span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-semibold ${STATUS_CHIP_CLASSES[state.status]}`}
            >
              {STATUS_LABELS[state.status]}
              {state.status === 'delayed' && state.delayMins > 0 ? ` · +${state.delayMins}m` : ''}
            </span>
          </div>
          <dl className="grid grid-cols-4 gap-4 m-0 mb-6 max-[720px]:grid-cols-2">
            <div className="bg-grey-100 py-3 px-4 rounded-[10px]">
              <dt className="text-[11px] uppercase tracking-[0.08em] text-grey-600 mb-0.5">Gate</dt>
              <dd className="m-0 text-lg font-bold text-grey-900">{state.gate}</dd>
            </div>
            <div className="bg-grey-100 py-3 px-4 rounded-[10px]">
              <dt className="text-[11px] uppercase tracking-[0.08em] text-grey-600 mb-0.5">Scheduled</dt>
              <dd className="m-0 text-lg font-bold text-grey-900">14:20</dd>
            </div>
            <div className="bg-grey-100 py-3 px-4 rounded-[10px]">
              <dt className="text-[11px] uppercase tracking-[0.08em] text-grey-600 mb-0.5">Expected</dt>
              <dd className="m-0 text-lg font-bold text-grey-900">
                {state.delayMins > 0
                  ? `14:${String(20 + state.delayMins).padStart(2, '0')}`
                  : '14:20'}
              </dd>
            </div>
            <div className="bg-grey-100 py-3 px-4 rounded-[10px]">
              <dt className="text-[11px] uppercase tracking-[0.08em] text-grey-600 mb-0.5">Terminal</dt>
              <dd className="m-0 text-lg font-bold text-grey-900">3</dd>
            </div>
          </dl>
          <div className="flex justify-between items-start mb-6 relative before:content-[''] before:absolute before:left-3 before:right-3 before:top-2 before:h-0.5 before:bg-grey-200">
            {progression.map((p, i) => {
              const isDone = i <= activeIdx
              return (
                <div
                  key={p}
                  className={`flex flex-col items-center gap-1.5 flex-1 relative z-[1] ${isDone ? '' : ''}`}
                >
                  <span
                    className={`w-[18px] h-[18px] rounded-full border-2 ${
                      isDone
                        ? 'bg-purple border-purple'
                        : 'bg-white border-grey-200'
                    }`}
                  />
                  <small className="text-[11px] text-grey-600">{STATUS_LABELS[p]}</small>
                </div>
              )
            })}
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="button"
              className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on"
              onClick={advance}
            >
              Advance status
            </button>
            <button
              type="button"
              className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on"
              onClick={toggleDelay}
            >
              {state.status === 'delayed' ? 'Clear delay' : 'Simulate delay'}
            </button>
          </div>
          <p className="text-xs text-grey-600 m-0">
            Demo mode — advance the status to see the flight progress through the day.
          </p>
        </div>
      ) : (
        <div className="bg-white py-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
          <p>Try tracking <code>BA2490</code>, <code>VS103</code>, or any flight number.</p>
          <Link
            to="/trips"
            className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on"
          >
            See my trips
          </Link>
        </div>
      )}
    </PageShell>
  )
}
