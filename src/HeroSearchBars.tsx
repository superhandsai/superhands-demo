import { type ReactNode, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon } from './App'
import { DateRangeField } from './DateRangeField'
import { FieldClearButton } from './FieldClearButton'
import { PassengersField } from './PassengersField'

const FIELD_BASE =
  'group relative flex flex-col items-stretch justify-center gap-[2px] flex-[0_0_auto] self-stretch w-full box-border min-h-20 px-[13px] py-[9px] border-2 rounded-[16px] md:rounded-l-[16px] md:rounded-r-none bg-white cursor-pointer'
const FIELD_LABEL =
  'flex-shrink-0 text-[15px] font-semibold leading-[1.25] text-grey-600 tracking-[0.02em]'
const FIELD_VALUE_ROW =
  'relative flex items-center gap-1 min-h-[22px] flex-auto min-w-0 overflow-hidden flex-[0_0_auto]'
const FIELD_INPUT =
  'relative w-full max-w-full min-w-0 h-auto min-h-[22px] flex-1 self-stretch p-0 m-0 text-[18px] leading-[1.25] overflow-hidden whitespace-nowrap text-ellipsis bg-transparent border-none text-grey-900 focus:outline-none text-left'
const FIELD_HINT =
  'absolute left-0 right-0 top-1/2 -translate-y-1/2 text-[18px] leading-[1.25] text-grey-400 pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis text-left'
const SUBMIT_BUTTON =
  'flex-[0_0_auto] self-start m-0 h-auto min-h-20 px-[22px] py-[10px] rounded-[16px] bg-purple text-grey-100 border-none inline-flex items-center justify-center gap-[10px] font-sans text-[18px] font-normal cursor-pointer no-underline transition-[background] duration-200 hover:bg-purple-hover hover:no-underline md:rounded-l-none md:ml-0 max-md:self-stretch max-md:w-auto max-md:mx-0 max-md:rounded-[16px] max-md:box-border max-md:min-h-[53px] max-md:h-[53px] max-md:max-h-[53px] max-md:px-[22px] max-md:py-0'

interface StackedTextFieldProps {
  name: string
  label: string
  hint: string
  value: string
  onChange: (value: string) => void
  inputType?: 'text' | 'number'
  inputMode?: 'text' | 'numeric' | 'decimal'
  min?: number
  max?: number
  flexClasses?: string
}

function StackedTextField({
  name,
  label,
  hint,
  value,
  onChange,
  inputType = 'text',
  inputMode,
  min,
  max,
  flexClasses = 'flex-1 min-w-0 md:flex-[2_1_0]',
}: StackedTextFieldProps) {
  const labelId = useId()
  const inputId = useId()
  const [focused, setFocused] = useState(false)
  const showHint = !value && !focused
  const borderState = focused ? 'border-purple' : 'border-grey-200'
  return (
    <div
      className={`relative flex flex-col ${flexClasses} max-md:flex-[0_0_auto] max-md:w-full max-md:min-w-0`}
    >
      <div className={`${FIELD_BASE} ${borderState}`}>
        <span className={FIELD_LABEL} id={labelId}>
          {label}
        </span>
        <div className={FIELD_VALUE_ROW}>
          {showHint ? (
            <span className={FIELD_HINT} aria-hidden="true">
              {hint}
            </span>
          ) : null}
          <input
            id={inputId}
            name={name}
            type={inputType}
            inputMode={inputMode}
            min={min}
            max={max}
            className={`${FIELD_INPUT} cursor-text ${value ? 'pr-8' : ''}`}
            autoComplete="off"
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-labelledby={labelId}
          />
          {value ? (
            <FieldClearButton
              ariaLabel={`Clear ${label}`}
              onClear={() => onChange('')}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

interface SearchBarShellProps {
  children: ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

function SearchBarShell({ children, onSubmit }: SearchBarShellProps) {
  return (
    <form className="w-full flex flex-col items-start gap-[14px]" onSubmit={onSubmit}>
      <div className="relative z-[1] w-full min-w-0 flex flex-wrap items-start gap-4 box-border p-0 bg-transparent border-none rounded-none shadow-none overflow-visible md:gap-0 md:gap-y-3 max-md:flex-col max-md:flex-nowrap max-md:items-stretch max-md:h-auto max-md:p-0 max-md:gap-3 max-md:bg-transparent max-md:border-none max-md:shadow-none">
        {children}
      </div>
    </form>
  )
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button type="submit" className={SUBMIT_BUTTON}>
      <span className="font-semibold">{label}</span>
      <span className="flex w-6 h-6 flex-shrink-0 items-center justify-center" aria-hidden>
        <ArrowRightIcon className="block" />
      </span>
    </button>
  )
}

export function HotelsSearchBar() {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    const q = String(data.get('q') || '').trim()
    const checkin = String(data.get('checkin') || '').trim()
    const checkout = String(data.get('checkout') || '').trim()
    const adults = String(data.get('adults') || '2')
    const children = String(data.get('children') || '0')
    if (q) params.set('q', q)
    if (checkin) params.set('in', checkin)
    if (checkout) params.set('out', checkout)
    const guests = Number(adults) + Number(children)
    params.set('guests', String(guests))
    navigate(`/stays/results?${params.toString()}`)
  }

  return (
    <SearchBarShell onSubmit={onSubmit}>
      <StackedTextField
        name="q"
        label="Where"
        hint="City, country, or hotel"
        value={destination}
        onChange={setDestination}
      />
      <DateRangeField
        departLabel="Check in"
        returnLabel="Check out"
        departName="checkin"
        returnName="checkout"
        placeholder="Add date"
      />
      <PassengersField label="Guests" />
      <SubmitButton label="Search" />
    </SearchBarShell>
  )
}

export function CarsSearchBar() {
  const navigate = useNavigate()
  const [pickup, setPickup] = useState('')
  const [age, setAge] = useState('30')

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // No cars route exists yet; for the prototype, send users to the
    // help center with the search context preserved in the query string.
    const data = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    const loc = String(data.get('pickup_location') || '').trim()
    const start = String(data.get('pickup_date') || '').trim()
    const end = String(data.get('dropoff_date') || '').trim()
    const driverAge = String(data.get('driver_age') || '').trim()
    if (loc) params.set('pickup', loc)
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    if (driverAge) params.set('age', driverAge)
    navigate(`/help?topic=cars&${params.toString()}`)
  }

  return (
    <SearchBarShell onSubmit={onSubmit}>
      <StackedTextField
        name="pickup_location"
        label="Pickup location"
        hint="City, airport, or address"
        value={pickup}
        onChange={setPickup}
      />
      <DateRangeField
        departLabel="Pickup date"
        returnLabel="Drop-off date"
        departName="pickup_date"
        returnName="dropoff_date"
        placeholder="Add date"
      />
      <StackedTextField
        name="driver_age"
        label="Driver age"
        hint="e.g. 30"
        value={age}
        onChange={setAge}
        inputType="number"
        inputMode="numeric"
        min={18}
        max={99}
        flexClasses="flex-[0_1_180px] min-w-[160px]"
      />
      <SubmitButton label="Search" />
    </SearchBarShell>
  )
}
