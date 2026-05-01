import { type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { FieldClearButton } from './FieldClearButton'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

type PickIntent = 'depart' | 'return'
interface YearMonth {
  year: number
  month: number
}
interface MonthCell {
  date: Date
  outside: boolean
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function fromKey(key: string | null | undefined): Date | null {
  if (!key) return null
  const [y, m, day] = key.split('-').map(Number)
  if (!y || !m || !day) return null
  return new Date(y, m - 1, day)
}

function startOfToday(): Date {
  const t = new Date()
  return new Date(t.getFullYear(), t.getMonth(), t.getDate())
}

function addMonths(year: number, monthIndex: number, delta: number): YearMonth {
  const d = new Date(year, monthIndex + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

function monthCells(year: number, monthIndex: number): MonthCell[] {
  const first = new Date(year, monthIndex, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const prevLast = new Date(year, monthIndex, 0).getDate()
  const cells: MonthCell[] = []
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

function formatSingleDateLabel(key: string): string {
  const d = fromKey(key)
  if (!d) return ''
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface MonthGridProps {
  year: number
  monthIndex: number
  departKey: string
  returnKey: string
  hoverKey: string | null
  today: Date
  onPick: (key: string) => void
  onHover: (key: string) => void
  onLeave: () => void
  headLeading?: ReactNode
  headTrailing?: ReactNode
}

type RangeKind = 'start-end' | 'start' | 'end' | 'within' | 'none'

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
  headLeading = null,
  headTrailing = null,
}: MonthGridProps) {
  const label = new Date(year, monthIndex, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
  const cells = monthCells(year, monthIndex)

  function rangeKind(key: string): RangeKind {
    if (!departKey) return 'none'
    const end = returnKey || hoverKey
    if (!end) {
      if (key === departKey) return 'start-end'
      return 'none'
    }
    const order = [departKey, end].sort()
    const lo = order[0]
    const hi = order[1]
    if (key < lo || key > hi) return 'none'
    if (key === lo && key === hi) return 'start-end'
    if (key === lo) return 'start'
    if (key === hi) return 'end'
    return 'within'
  }

  return (
    <div>
      <div className="flex items-center gap-2 min-h-9 mb-[10px]">
        <span className="flex-[0_0_36px] flex items-center justify-center">{headLeading}</span>
        <span className="flex-1 min-w-0 text-center font-bold text-[14px] text-grey-900">{label}</span>
        <span className="flex-[0_0_36px] flex items-center justify-center">{headTrailing}</span>
      </div>
      <div className="grid grid-cols-7 mb-[6px]" aria-hidden>
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="text-center text-[11px] font-bold text-grey-400 tracking-[0.02em]">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7" role="grid">
        {cells.map(({ date, outside }, i) => {
          const key = dateKey(date)
          const t0 = date.getTime()
          const disabled = t0 < today.getTime()
          const isToday = key === dateKey(today)
          const rk = !outside && !disabled ? rangeKind(key) : 'none'
          const isStart = rk === 'start' || rk === 'start-end'
          const isEnd = rk === 'end' || rk === 'start-end'
          const isWithin = rk === 'within'

          // Day-cell background (for range shading)
          let cellBg = ''
          if (isWithin) {
            cellBg = 'bg-[rgba(96,93,236,0.12)]'
          } else if (isStart && !isEnd) {
            cellBg = 'bg-[linear-gradient(to_right,transparent_50%,rgba(96,93,236,0.12)_50%)]'
          } else if (isEnd && !isStart) {
            cellBg = 'bg-[linear-gradient(to_right,rgba(96,93,236,0.12)_50%,transparent_50%)]'
          }

          // Day-num circle
          let numClasses =
            'relative z-[1] flex items-center justify-center w-10 h-10 mx-auto rounded-full'
          if (isStart || isEnd) {
            numClasses += ' bg-purple text-purple-on font-bold'
          } else if (isToday && !disabled) {
            numClasses += ' shadow-[inset_0_0_0_1.5px_var(--color-grey-300)]'
          }

          const buttonClasses = [
            'relative m-0 p-0 h-10 border-none font-sans text-[14px]',
            disabled ? 'text-grey-200 cursor-default' : 'text-grey-900 cursor-pointer',
            outside ? 'invisible pointer-events-none' : '',
            cellBg,
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={`${key}-${i}`}
              type="button"
              role="gridcell"
              disabled={outside || disabled}
              tabIndex={-1}
              className={buttonClasses}
              onMouseEnter={() => !outside && !disabled && onHover(key)}
              onMouseLeave={onLeave}
              onClick={() => !outside && !disabled && onPick(key)}
            >
              <span
                className={
                  disabled
                    ? 'relative z-[1] flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-transparent text-inherit font-normal'
                    : numClasses
                }
              >
                {date.getDate()}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface DateRangeFieldProps {
  oneWay?: boolean
  departLabel?: string
  returnLabel?: string
  departName?: string
  returnName?: string
  placeholder?: string
  presetDepartKey?: string
  presetReturnKey?: string
}

export function DateRangeField({
  oneWay = false,
  departLabel = 'Depart',
  returnLabel = 'Return',
  departName = 'depart_date',
  returnName = 'return_date',
  placeholder = 'Add date',
  presetDepartKey,
  presetReturnKey,
}: DateRangeFieldProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const dialogId = useId()
  const departLabelId = `${dialogId}-depart-label`
  const returnLabelId = `${dialogId}-return-label`
  const departInputId = `${dialogId}-depart`
  const returnInputId = `${dialogId}-return`
  const [open, setOpen] = useState(false)
  const [pickIntent, setPickIntent] = useState<PickIntent>('depart')
  const [departKey, setDepartKey] = useState('')
  const [returnKey, setReturnKey] = useState('')
  const [hoverKey, setHoverKey] = useState<string | null>(null)
  const [leftMonth, setLeftMonth] = useState<YearMonth>(() => {
    const t = startOfToday()
    return { year: t.getFullYear(), month: t.getMonth() }
  })

  const today = startOfToday()
  const rightMonth = addMonths(leftMonth.year, leftMonth.month, 1)

  useEffect(() => {
    if (!oneWay) return
    setReturnKey('')
    setHoverKey(null)
  }, [oneWay])

  useEffect(() => {
    if (!presetDepartKey && !presetReturnKey) return
    setDepartKey(presetDepartKey || '')
    setReturnKey(oneWay ? '' : presetReturnKey || '')
    setHoverKey(null)
    const anchor = fromKey(presetDepartKey || presetReturnKey)
    if (anchor) {
      setLeftMonth({ year: anchor.getFullYear(), month: anchor.getMonth() })
    }
  }, [presetDepartKey, presetReturnKey, oneWay])

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

  function shiftMonths(delta: number) {
    setLeftMonth(m => addMonths(m.year, m.month, delta))
  }

  function onPick(key: string) {
    const dep = fromKey(departKey)
    const picked = fromKey(key)
    if (pickIntent === 'return' && departKey && returnKey && dep && picked) {
      if (picked.getTime() >= dep.getTime()) {
        setReturnKey(key)
        setHoverKey(null)
        setOpen(false)
        return
      }
    }
    if (!departKey || (departKey && returnKey) || (oneWay && departKey)) {
      setDepartKey(key)
      setReturnKey('')
      setHoverKey(null)
      if (oneWay) {
        setOpen(false)
      }
      return
    }
    if (!dep || !picked) return
    if (picked.getTime() < dep.getTime()) {
      setDepartKey(key)
      return
    }
    setReturnKey(key)
    setHoverKey(null)
    setOpen(false)
  }

  const departDisplay = formatSingleDateLabel(departKey)
  const returnDisplay = formatSingleDateLabel(returnKey)
  const showDepartPlaceholder = !departDisplay
  const showReturnPlaceholder = !returnDisplay

  function openFromDepart() {
    setPickIntent('depart')
    setOpen(true)
  }

  function openFromReturn() {
    setPickIntent('return')
    setOpen(true)
  }

  // Base classes for each stacked date field (label above input).
  // Default (mobile): border-2 grey-200 rounded-16, bg-white, min-h-20, px-13 py-9, stacked (flex-col justify-center gap-2px), cursor-pointer
  // Desktop (md:) inside date-fields row (non one-way): rounded-none, border-left-none
  // When open: border-purple; desktop adds inset shadow for seam; mobile keeps rounded-16
  const dateFieldBase =
    'relative group flex-1 min-w-0 flex flex-col justify-center items-stretch gap-[2px] min-h-20 px-[13px] py-[9px] cursor-pointer bg-white border-2 rounded-[16px] box-border'

  // Desktop overrides: when not one-way, split fields are in a row with seam-merged borders.
  const dateFieldDesktopJoin = oneWay ? '' : 'md:rounded-none md:border-l-0'

  function splitFieldBorder(thisOpen: boolean): string {
    if (thisOpen) {
      return oneWay
        ? 'border-purple max-md:rounded-[16px]'
        : 'border-purple md:shadow-[inset_2px_0_0_var(--color-purple)] md:relative md:z-[3] max-md:rounded-[16px]'
    }
    return 'border-grey-200'
  }

  return (
    <div
      ref={rootRef}
      className={`relative flex flex-col flex-[1_1_280px] min-w-0 max-md:flex-[0_0_auto] max-md:w-full max-md:min-w-0 ${
        open ? 'z-[25]' : ''
      } ${oneWay ? 'md:flex-[1_1_0]' : 'md:flex-[2_1_0]'}`}
    >
      <input type="hidden" name={departName} value={departKey} />
      <input type="hidden" name={returnName} value={oneWay ? '' : returnKey} />
      <div
        className={`flex flex-[0_0_auto] items-stretch self-stretch w-full box-border gap-0 min-w-0 max-md:flex-row max-md:items-stretch max-md:gap-2`}
      >
        <label className={`${dateFieldBase} ${dateFieldDesktopJoin} ${splitFieldBorder(open && pickIntent === 'depart')} max-md:flex-1 max-md:min-w-0`}>
          <span className="flex-shrink-0 text-[15px] font-semibold leading-[1.25] text-grey-600 tracking-[0.02em]" id={departLabelId}>
            {departLabel}
          </span>
          <div className="relative flex items-center gap-1 min-h-[22px] flex-auto min-w-0 overflow-hidden flex-[0_0_auto]">
            {showDepartPlaceholder ? (
              <span
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-[18px] leading-[1.25] text-grey-400 pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis text-left"
                aria-hidden="true"
              >
                {placeholder}
              </span>
            ) : null}
            <input
              id={departInputId}
              type="text"
              className={`relative w-full max-w-full min-w-0 h-auto min-h-[22px] flex-1 self-stretch p-0 m-0 text-[18px] leading-[1.25] overflow-hidden whitespace-nowrap text-ellipsis bg-transparent border-none cursor-pointer focus:outline-none ${
                showDepartPlaceholder ? 'text-transparent caret-grey-900' : 'text-grey-900'
              } ${departKey ? 'pr-8' : ''}`}
              readOnly
              value={departDisplay}
              aria-labelledby={departLabelId}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={`${dialogId}-popover`}
              onClick={openFromDepart}
              onFocus={openFromDepart}
            />
            {departKey ? (
              <FieldClearButton
                ariaLabel="Clear departure date"
                onClear={() => {
                  setDepartKey('')
                  setReturnKey('')
                  setHoverKey(null)
                }}
              />
            ) : null}
          </div>
        </label>
        {!oneWay ? (
          <label
            className={`${dateFieldBase} md:rounded-none md:border-l-0 ${splitFieldBorder(open && pickIntent === 'return')} max-md:flex-1 max-md:min-w-0`}
          >
            <span
              className="flex-shrink-0 text-[15px] font-semibold leading-[1.25] text-grey-600 tracking-[0.02em]"
              id={returnLabelId}
            >
              {returnLabel}
            </span>
            <div className="relative flex items-center gap-1 min-h-[22px] flex-auto min-w-0 overflow-hidden flex-[0_0_auto]">
              {showReturnPlaceholder ? (
                <span
                  className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-[18px] leading-[1.25] text-grey-400 pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis text-left"
                  aria-hidden="true"
                >
                  Add date
                </span>
              ) : null}
              <input
                id={returnInputId}
                type="text"
                className={`relative w-full max-w-full min-w-0 h-auto min-h-[22px] flex-1 self-stretch p-0 m-0 text-[18px] leading-[1.25] overflow-hidden whitespace-nowrap text-ellipsis bg-transparent border-none cursor-pointer focus:outline-none ${
                  showReturnPlaceholder ? 'text-transparent caret-grey-900' : 'text-grey-900'
                } ${returnKey ? 'pr-8' : ''}`}
                readOnly
                value={returnDisplay}
                aria-labelledby={returnLabelId}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={`${dialogId}-popover`}
                onClick={openFromReturn}
                onFocus={openFromReturn}
              />
              {returnKey ? (
                <FieldClearButton
                  ariaLabel="Clear return date"
                  onClear={() => {
                    setReturnKey('')
                    setHoverKey(null)
                  }}
                />
              ) : null}
            </div>
          </label>
        ) : null}
      </div>
      {open && (
        <div
          id={`${dialogId}-popover`}
          className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-[35] w-[min(640px,calc(100vw-32px))] pt-4 px-5 pb-5 bg-white border border-grey-200 rounded-[16px] shadow-search max-md:left-0 max-md:right-0 max-md:w-auto max-md:max-w-none max-md:translate-x-0"
          role="dialog"
          aria-modal="true"
          aria-label={oneWay ? 'Select travel date' : 'Select travel dates'}
        >
          <div>
            <div className="grid grid-cols-2 gap-x-7 gap-y-5 max-md:grid-cols-1">
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
                headLeading={
                  <button
                    type="button"
                    className="flex items-center justify-center w-9 h-9 p-0 border-none rounded-full bg-transparent text-[22px] leading-none text-grey-900 cursor-pointer hover:bg-grey-100 focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
                    aria-label="Previous months"
                    onClick={() => shiftMonths(-1)}
                  >
                    ‹
                  </button>
                }
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
                headTrailing={
                  <button
                    type="button"
                    className="flex items-center justify-center w-9 h-9 p-0 border-none rounded-full bg-transparent text-[22px] leading-none text-grey-900 cursor-pointer hover:bg-grey-100 focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
                    aria-label="Next months"
                    onClick={() => shiftMonths(1)}
                  >
                    ›
                  </button>
                }
              />
            </div>
            <div className="flex justify-between items-center mt-4 -mx-5 px-5 pt-[14px] border-t border-grey-200">
              <button
                type="button"
                className="px-3 py-2 border-none rounded-lg bg-transparent font-sans text-[15px] font-semibold text-grey-600 cursor-pointer hover:text-grey-900 focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2 focus-visible:rounded-[4px]"
                onClick={() => {
                  setDepartKey('')
                  setReturnKey('')
                  setHoverKey(null)
                }}
              >
                Clear dates
              </button>
              <button
                type="button"
                className="px-5 py-[10px] border-none rounded-[12px] bg-purple font-sans text-[15px] font-bold text-purple-on cursor-pointer hover:bg-purple-hover focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
                onClick={() => setOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
