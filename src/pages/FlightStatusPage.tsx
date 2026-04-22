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

  return (
    <PageShell
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Flight status' }]}
      title="Flight status"
      subtitle={queryNo ? `Tracking ${queryNo}` : 'Enter a flight number to see live status.'}
    >
      <form className="detail-card" onSubmit={onSubmit}>
        <div className="field-grid">
          <label className="field field--full">
            <span>Flight number</span>
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="e.g. BA2490"
              autoComplete="off"
            />
          </label>
        </div>
        <button type="submit" className="btn btn--primary">Track flight</button>
      </form>

      {queryNo ? (
        <div className="detail-card status-card">
          <div className="status-card__head">
            <div>
              <h2>{queryNo}</h2>
              <span>Updated {Math.round((Date.now() - state.lastUpdated) / 1000)}s ago</span>
            </div>
            <span className={`status-chip status-chip--${state.status}`}>
              {STATUS_LABELS[state.status]}
              {state.status === 'delayed' && state.delayMins > 0 ? ` · +${state.delayMins}m` : ''}
            </span>
          </div>
          <dl className="status-card__grid">
            <div>
              <dt>Gate</dt>
              <dd>{state.gate}</dd>
            </div>
            <div>
              <dt>Scheduled</dt>
              <dd>14:20</dd>
            </div>
            <div>
              <dt>Expected</dt>
              <dd>
                {state.delayMins > 0
                  ? `14:${String(20 + state.delayMins).padStart(2, '0')}`
                  : '14:20'}
              </dd>
            </div>
            <div>
              <dt>Terminal</dt>
              <dd>3</dd>
            </div>
          </dl>
          <div className="status-card__track">
            {progression.map(p => (
              <div
                key={p}
                className={`status-card__dot ${
                  progression.indexOf(p) <=
                  progression.indexOf(state.status === 'delayed' ? 'scheduled' : state.status)
                    ? 'is-done'
                    : ''
                }`}
              >
                <span />
                <small>{STATUS_LABELS[p]}</small>
              </div>
            ))}
          </div>
          <div className="manage-actions">
            <button type="button" className="btn btn--secondary" onClick={advance}>
              Advance status
            </button>
            <button type="button" className="btn btn--secondary" onClick={toggleDelay}>
              {state.status === 'delayed' ? 'Clear delay' : 'Simulate delay'}
            </button>
          </div>
          <p className="manage-note">
            Demo mode — advance the status to see the flight progress through the day.
          </p>
        </div>
      ) : (
        <div className="empty-state">
          <p>Try tracking <code>BA2490</code>, <code>VS103</code>, or any flight number.</p>
          <Link to="/trips" className="btn btn--secondary">See my trips</Link>
        </div>
      )}
    </PageShell>
  )
}
