import { useEffect, useId, useRef, useState } from 'react'

const ADULT_MIN = 1
const ADULT_MAX = 9
const CHILD_MIN = 0
const CHILD_MAX = 8

function formatSummary(adults, children) {
  const a = adults === 1 ? '1 adult' : `${adults} adults`
  if (children === 0) return a
  const c = children === 1 ? '1 child' : `${children} children`
  return `${a}, ${c}`
}

function StepperRow({ title, hint, value, min, max, decAria, incAria, onDec, onInc }) {
  return (
    <div className="passengers-picker__row">
      <div className="passengers-picker__label">
        <span className="passengers-picker__name">{title}</span>
        {hint ? <span className="passengers-picker__hint">{hint}</span> : null}
      </div>
      <div className="passengers-picker__stepper" role="group" aria-label={title}>
        <button
          type="button"
          className="passengers-picker__step"
          aria-label={decAria}
          disabled={value <= min}
          onMouseDown={e => e.preventDefault()}
          onClick={onDec}
        >
          −
        </button>
        <span className="passengers-picker__value" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className="passengers-picker__step"
          aria-label={incAria}
          disabled={value >= max}
          onMouseDown={e => e.preventDefault()}
          onClick={onInc}
        >
          +
        </button>
      </div>
    </div>
  )
}

export function PassengersField() {
  const rootRef = useRef(null)
  const baseId = useId()
  const travellersLabelId = `${baseId}-travellers-label`
  const [open, setOpen] = useState(false)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)

  const summary = formatSummary(adults, children)

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

  return (
    <div ref={rootRef} className={`flight-search__passengers-field ${open ? 'is-active' : ''}`}>
      <input type="hidden" name="adults" value={adults} />
      <input type="hidden" name="children" value={children} />
      <label
        className={`flight-search__field flight-search__field--people flight-search__field--stacked ${open ? 'is-open' : ''}`}
      >
        <span className="flight-search__label" id={travellersLabelId}>
          Travellers
        </span>
        <div className="flight-search__value-row">
          <input
            id={baseId}
            type="text"
            className="flight-search__input flight-search__input--stacked"
            readOnly
            value={summary}
            aria-labelledby={travellersLabelId}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={`${baseId}-popover`}
            onClick={() => setOpen(true)}
            onFocus={() => setOpen(true)}
          />
        </div>
      </label>
      {open && (
        <div
          id={`${baseId}-popover`}
          className="flight-search__passengers-popover"
          role="dialog"
          aria-modal="true"
          aria-label="Travellers"
        >
          <div className="passengers-picker">
            <StepperRow
              title="Adults"
              hint="Aged 18+"
              value={adults}
              min={ADULT_MIN}
              max={ADULT_MAX}
              decAria="Decrease adults"
              incAria="Increase adults"
              onDec={() => setAdults(a => Math.max(ADULT_MIN, a - 1))}
              onInc={() => setAdults(a => Math.min(ADULT_MAX, a + 1))}
            />
            <StepperRow
              title="Children"
              hint="Aged 0 to 17"
              value={children}
              min={CHILD_MIN}
              max={CHILD_MAX}
              decAria="Decrease children"
              incAria="Increase children"
              onDec={() => setChildren(c => Math.max(CHILD_MIN, c - 1))}
              onInc={() => setChildren(c => Math.min(CHILD_MAX, c + 1))}
            />
            <div className="passengers-picker__footer">
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
