import { useEffect, useId, useRef, useState } from 'react'

const ADULT_MIN = 1
const ADULT_MAX = 9
const CHILD_MIN = 0
const CHILD_MAX = 8

function formatSummary(adults: number, children: number): string {
  const a = adults === 1 ? '1 adult' : `${adults} adults`
  if (children === 0) return a
  const c = children === 1 ? '1 child' : `${children} children`
  return `${a}, ${c}`
}

interface StepperRowProps {
  title: string
  hint?: string
  value: number
  min: number
  max: number
  decAria: string
  incAria: string
  onDec: () => void
  onInc: () => void
}

function StepperRow({
  title,
  hint,
  value,
  min,
  max,
  decAria,
  incAria,
  onDec,
  onInc,
}: StepperRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-1 py-3">
      <div className="flex flex-col gap-[2px] min-w-0">
        <span className="text-[16px] font-bold text-grey-900">{title}</span>
        {hint ? <span className="text-[13px] text-grey-400">{hint}</span> : null}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0" role="group" aria-label={title}>
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 p-0 border border-grey-200 rounded-full bg-white text-[20px] leading-none text-grey-900 cursor-pointer hover:not-disabled:border-purple hover:not-disabled:text-purple disabled:opacity-35 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
          aria-label={decAria}
          disabled={value <= min}
          onMouseDown={e => e.preventDefault()}
          onClick={onDec}
        >
          −
        </button>
        <span className="min-w-[1.25rem] text-[17px] font-bold text-center text-grey-900 tabular-nums" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 p-0 border border-grey-200 rounded-full bg-white text-[20px] leading-none text-grey-900 cursor-pointer hover:not-disabled:border-purple hover:not-disabled:text-purple disabled:opacity-35 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
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

interface PassengersFieldProps {
  label?: string
}

export function PassengersField({ label = 'Travellers' }: PassengersFieldProps = {}) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const baseId = useId()
  const travellersLabelId = `${baseId}-travellers-label`
  const [open, setOpen] = useState(false)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)

  const summary = formatSummary(adults, children)

  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node | null
      if (rootRef.current && target && !rootRef.current.contains(target)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Field classes: stacked people field.
  // Base: relative, flex-col, justify-center, gap-[2px], min-h-20, px-[13px] py-[9px], cursor-pointer, bg-white, border-2 rounded-[16px]
  // Desktop (>=769px) inside passengers-field group: rounded-none, border-l-0, border-r-0; when open adds purple inset shadows left/right
  // Mobile (<=768px): rounded-[16px] even when open
  const fieldBase =
    'relative group w-full self-stretch flex flex-col justify-center items-stretch gap-[2px] min-h-20 px-[13px] py-[9px] cursor-pointer bg-white border-2 rounded-[16px] md:rounded-none md:border-l-0 md:border-r-0 box-border'
  const fieldBorder = open
    ? 'border-purple md:shadow-[inset_2px_0_0_var(--color-purple),inset_-2px_0_0_var(--color-purple)] md:relative md:z-[3] max-md:rounded-[16px]'
    : 'border-grey-200'

  return (
    <div
      ref={rootRef}
      className={`relative flex flex-col flex-[0_1_280px] min-w-[240px] max-md:flex-[0_0_auto] max-md:w-full max-md:min-w-0 ${open ? 'z-[25]' : ''}`}
    >
      <input type="hidden" name="adults" value={adults} />
      <input type="hidden" name="children" value={children} />
      <label className={`${fieldBase} ${fieldBorder}`}>
        <span
          className="flex-shrink-0 text-[15px] font-semibold leading-[1.25] text-grey-600 tracking-[0.02em]"
          id={travellersLabelId}
        >
          {label}
        </span>
        <div className="relative flex items-center gap-1 min-h-[22px] flex-auto min-w-0 overflow-hidden flex-[0_0_auto]">
          <input
            id={baseId}
            type="text"
            className="relative w-full max-w-full min-w-0 h-auto min-h-[22px] flex-1 self-stretch p-0 m-0 text-[18px] leading-[1.25] overflow-hidden whitespace-nowrap text-ellipsis bg-transparent border-none text-grey-900 cursor-pointer focus:outline-none"
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
          className="absolute top-[calc(100%+8px)] right-0 left-auto z-[35] w-[min(320px,calc(100vw-32px))] pt-4 px-[18px] pb-[18px] bg-white border border-grey-200 rounded-[16px] shadow-search max-md:left-0 max-md:right-0 max-md:w-auto max-md:max-w-none"
          role="dialog"
          aria-modal="true"
          aria-label="Travellers"
        >
          <div className="flex flex-col gap-1">
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
            <div className="flex mt-3 pt-0">
              <button
                type="button"
                className="w-full box-border px-5 py-[10px] border-none rounded-[12px] bg-purple text-[15px] font-bold text-purple-on cursor-pointer hover:bg-purple-hover focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
                onClick={() => setOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
