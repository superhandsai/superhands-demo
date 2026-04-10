import { useEffect, useId, useRef, useState } from 'react'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function pad2(n) {
  return String(n).padStart(2, '0')
}

function dateKey(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function fromKey(key) {
  if (!key) return null
  const [y, m, day] = key.split('-').map(Number)
  if (!y || !m || !day) return null
  return new Date(y, m - 1, day)
}

function startOfToday() {
  const t = new Date()
  return new Date(t.getFullYear(), t.getMonth(), t.getDate())
}

function addMonths(year, monthIndex, delta) {
  const d = new Date(year, monthIndex + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

/** @returns {{ date: Date, outside: boolean }[]} */
function monthCells(year, monthIndex) {
  const first = new Date(year, monthIndex, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const prevLast = new Date(year, monthIndex, 0).getDate()
  const cells = []
  for (let i = 0; i < startPad; i++) {
    const day = prevLast - startPad + i + 1
    cells.push({ date: new Date(year, monthIndex - 1, day), outside: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, monthIndex, d), outside: false })
  }
  let n = 1
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, monthIndex + 1, n++), outside: true })
  }
  while (cells.length < 42) {
    cells.push({ date: new Date(year, monthIndex + 1, n++), outside: true })
  }
  return cells
}

function formatRangeLabel(departKey, returnKey) {
  const a = fromKey(departKey)
  const b = fromKey(returnKey)
  if (!a) return ''
  const optsShort = { month: 'short', day: 'numeric' }
  if (!b) {
    return `${a.toLocaleDateString(undefined, optsShort)} – …`
  }
  const sameYear = a.getFullYear() === b.getFullYear()
  const left = a.toLocaleDateString(undefined, {
    ...optsShort,
    ...(sameYear ? {} : { year: 'numeric' }),
  })
  const right = b.toLocaleDateString(undefined, { ...optsShort, year: 'numeric' })
  return `${left} – ${right}`
}

function MonthGrid({
  year,
  monthIndex,
  departKey,
  returnKey,
  hoverKey,
  today,
  onPick,
  onHover,
  onLeave,
}) {
  const label = new Date(year, monthIndex, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
  const cells = monthCells(year, monthIndex)

  function rangeClass(key) {
    if (!departKey) return ''
    const end = returnKey || hoverKey
    if (!end) {
      if (key === departKey) return 'is-start is-end'
      return ''
    }
    const order = [departKey, end].sort()
    const lo = order[0]
    const hi = order[1]
    if (key < lo || key > hi) return ''
    if (key === lo && key === hi) return 'is-start is-end'
    if (key === lo) return 'is-start'
    if (key === hi) return 'is-end'
    return 'is-within'
  }

  return (
    <div className="date-range-picker__month">
      <div className="date-range-picker__month-head">
        <span className="date-range-picker__month-title">{label}</span>
      </div>
      <div className="date-range-picker__weekdays" aria-hidden>
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="date-range-picker__weekday">
            {d}
          </span>
        ))}
      </div>
      <div className="date-range-picker__days" role="grid">
        {cells.map(({ date, outside }, i) => {
          const key = dateKey(date)
          const t0 = date.getTime()
          const disabled = t0 < today.getTime()
          const isToday = key === dateKey(today)
          const rc = !outside && !disabled ? rangeClass(key) : ''
          return (
            <button
              key={`${key}-${i}`}
              type="button"
              role="gridcell"
              disabled={outside || disabled}
              tabIndex={-1}
              className={`date-range-picker__day ${outside ? 'is-outside' : ''} ${disabled ? 'is-disabled' : ''} ${isToday ? 'is-today' : ''} ${rc}`.trim()}
              onMouseEnter={() => !outside && !disabled && onHover(key)}
              onMouseLeave={onLeave}
              onClick={() => !outside && !disabled && onPick(key)}
            >
              <span className="date-range-picker__day-num">{date.getDate()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function DateRangeField({ icon, placeholder = 'Depart - Return' }) {
  const rootRef = useRef(null)
  const dialogId = useId()
  const [open, setOpen] = useState(false)
  const [departKey, setDepartKey] = useState('')
  const [returnKey, setReturnKey] = useState('')
  const [hoverKey, setHoverKey] = useState(null)
  const [leftMonth, setLeftMonth] = useState(() => {
    const t = startOfToday()
    return { year: t.getFullYear(), month: t.getMonth() }
  })

  const today = startOfToday()
  const rightMonth = addMonths(leftMonth.year, leftMonth.month, 1)

  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function shiftMonths(delta) {
    setLeftMonth(m => addMonths(m.year, m.month, delta))
  }

  function onPick(key) {
    if (!departKey || (departKey && returnKey)) {
      setDepartKey(key)
      setReturnKey('')
      setHoverKey(null)
      return
    }
    const dep = fromKey(departKey)
    const picked = fromKey(key)
    if (!dep || !picked) return
    if (picked.getTime() < dep.getTime()) {
      setDepartKey(key)
      return
    }
    setReturnKey(key)
    setHoverKey(null)
    setOpen(false)
  }

  const display = formatRangeLabel(departKey, returnKey)
  const showPlaceholder = !display

  return (
    <div ref={rootRef} className={`flight-search__date-field ${open ? 'is-active' : ''}`}>
      <input type="hidden" name="depart_date" value={departKey} />
      <input type="hidden" name="return_date" value={returnKey} />
      <label
        className={`flight-search__field flight-search__field--narrow ${open ? 'is-open' : ''}`}
      >
        {icon}
        {showPlaceholder && (
          <span className="flight-search__placeholder">{placeholder}</span>
        )}
        <input
          id={dialogId}
          type="text"
          className="flight-search__input"
          name="dates"
          readOnly
          value={display}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={`${dialogId}-popover`}
          onClick={() => setOpen(true)}
          onFocus={() => setOpen(true)}
        />
      </label>
      {open && (
        <div
          id={`${dialogId}-popover`}
          className="flight-search__date-popover"
          role="dialog"
          aria-modal="true"
          aria-label="Select travel dates"
        >
          <div className="date-range-picker">
            <div className="date-range-picker__toolbar">
              <button
                type="button"
                className="date-range-picker__nav-btn"
                aria-label="Previous months"
                onClick={() => shiftMonths(-1)}
              >
                ‹
              </button>
              <button
                type="button"
                className="date-range-picker__nav-btn"
                aria-label="Next months"
                onClick={() => shiftMonths(1)}
              >
                ›
              </button>
            </div>
            <div className="date-range-picker__months">
              <MonthGrid
                year={leftMonth.year}
                monthIndex={leftMonth.month}
                departKey={departKey}
                returnKey={returnKey}
                hoverKey={hoverKey}
                today={today}
                onPick={onPick}
                onHover={setHoverKey}
                onLeave={() => setHoverKey(null)}
              />
              <MonthGrid
                year={rightMonth.year}
                monthIndex={rightMonth.month}
                departKey={departKey}
                returnKey={returnKey}
                hoverKey={hoverKey}
                today={today}
                onPick={onPick}
                onHover={setHoverKey}
                onLeave={() => setHoverKey(null)}
              />
            </div>
            <div className="date-range-picker__footer">
              <button
                type="button"
                className="date-range-picker__clear"
                onClick={() => {
                  setDepartKey('')
                  setReturnKey('')
                  setHoverKey(null)
                }}
              >
                Clear dates
              </button>
              <button type="button" className="date-range-picker__done" onClick={() => setOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
