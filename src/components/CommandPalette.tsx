import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { bookingsStore } from '../lib/bookingsStore'
import { useStore } from '../lib/useStore'

interface Command {
  id: string
  label: string
  hint?: string
  to: string
}

export function CommandPalette() {
  const bookings = useStore(bookingsStore)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(v => !v)
        setQ('')
        setCursor(0)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 10)
  }, [open])

  const base: Command[] = useMemo(
    () => [
      { id: 'home', label: 'Home', to: '/', hint: 'Landing page' },
      { id: 'flights-lhr-cdg', label: 'Search LHR → CDG', to: '/flights?from=LHR&to=CDG&depart=2026-05-10&adults=1&trip=oneway', hint: 'Flights' },
      { id: 'flights-lhr-jfk', label: 'Search LHR → JFK', to: '/flights?from=LHR&to=JFK&depart=2026-06-12&return=2026-06-20&adults=1&trip=return', hint: 'Flights' },
      { id: 'trips', label: 'My trips', to: '/trips' },
      { id: 'account', label: 'Account', to: '/account' },
      { id: 'rewards', label: 'Rewards', to: '/account' },
      { id: 'alerts', label: 'Price alerts', to: '/alerts' },
      { id: 'saved', label: 'Saved flights & stays', to: '/saved' },
      { id: 'notifications', label: 'Notifications', to: '/notifications' },
      { id: 'stays', label: 'Browse stays', to: '/stays' },
      { id: 'destinations', label: 'Destinations', to: '/destinations' },
      { id: 'help', label: 'Help center', to: '/help' },
      { id: 'status', label: 'Flight status', to: '/status' },
    ],
    [],
  )

  const bookingCommands: Command[] = useMemo(
    () =>
      bookings.map(b => ({
        id: `trip-${b.pnr}`,
        label: `Trip ${b.pnr} — ${b.flight.outbound[0].from} → ${b.flight.outbound[b.flight.outbound.length - 1].to}`,
        hint: b.status,
        to: `/trips/${b.pnr}`,
      })),
    [bookings],
  )

  const items = useMemo(() => {
    const all = [...base, ...bookingCommands]
    const query = q.trim().toLowerCase()
    if (!query) return all.slice(0, 10)
    return all
      .filter(c => c.label.toLowerCase().includes(query) || c.hint?.toLowerCase().includes(query))
      .slice(0, 10)
  }, [q, base, bookingCommands])

  useEffect(() => {
    setCursor(0)
  }, [q])

  function pick(cmd: Command) {
    setOpen(false)
    navigate(cmd.to)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor(c => Math.min(items.length - 1, c + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor(c => Math.max(0, c - 1))
    } else if (e.key === 'Enter' && items[cursor]) {
      e.preventDefault()
      pick(items[cursor])
    }
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="cmdk-overlay" role="dialog" aria-modal="true" aria-label="Quick search">
      <button type="button" className="cmdk-scrim" aria-label="Close" onClick={() => setOpen(false)} />
      <div className="cmdk">
        <input
          ref={inputRef}
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search routes, trips, pages…"
          className="cmdk__input"
          aria-label="Search"
        />
        <ul className="cmdk__list" role="listbox">
          {items.length === 0 ? (
            <li className="cmdk__empty">No results</li>
          ) : (
            items.map((c, i) => (
              <li
                key={c.id}
                role="option"
                aria-selected={i === cursor}
                className={`cmdk__item ${i === cursor ? 'is-active' : ''}`}
                onMouseEnter={() => setCursor(i)}
                onMouseDown={e => {
                  e.preventDefault()
                  pick(c)
                }}
              >
                <span>{c.label}</span>
                {c.hint ? <small>{c.hint}</small> : null}
              </li>
            ))
          )}
        </ul>
        <footer className="cmdk__footer">
          <span><kbd>↵</kbd> open</span>
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>esc</kbd> close</span>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
