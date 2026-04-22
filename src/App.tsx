import { createPortal } from 'react-dom'
import {
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { tripma } from './assets/tripma/urls'
import { DateRangeField } from './DateRangeField'
import { FieldClearButton } from './FieldClearButton'
import { PassengersField } from './PassengersField'
import { SearchPills } from './SearchPills'
import {
  type Airport,
  type AirportApi,
  buildAirportLocationLabel,
  buildAirportOptionSubtitle,
  buildAirportOptionTitle,
  getAirportApi,
} from './lib/airportSearch'
import { sessionStore, signOut } from './lib/sessionStore'
import { notificationsStore } from './lib/notificationsStore'
import { useStore } from './lib/useStore'

type TripType = 'return' | 'one-way' | 'multi-city'
type AirportMenuKey = 'from' | 'to' | null

interface PopoverPlacement {
  top: number
  left: number
  width: number
}

function useMatchMax768(): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return matches
}

interface StarRowProps {
  filled: number
  total?: number
}

export function StarRow({ filled, total = 5 }: StarRowProps) {
  return (
    <div className="star-row" role="img" aria-label={`${filled} out of ${total} stars`}>
      {Array.from({ length: total }, (_, i) => (
        <svg
          key={i}
          className={`star-row__star ${i < filled ? 'is-filled' : 'is-empty'}`}
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M11.2827 3.45332C11.5131 2.98638 11.6284 2.75291 11.7848 2.67831C11.9209 2.61341 12.0791 2.61341 12.2152 2.67831C12.3717 2.75291 12.4869 2.98638 12.7174 3.45332L14.9041 7.88328C14.9721 8.02113 15.0061 8.09006 15.0558 8.14358C15.0999 8.19096 15.1527 8.22935 15.2113 8.25662C15.2776 8.28742 15.3536 8.29854 15.5057 8.32077L20.397 9.03571C20.9121 9.11099 21.1696 9.14863 21.2888 9.27444C21.3925 9.38389 21.4412 9.5343 21.4215 9.68377C21.3988 9.85558 21.2124 10.0372 20.8395 10.4004L17.3014 13.8464C17.1912 13.9538 17.136 14.0076 17.1004 14.0715C17.0689 14.128 17.0487 14.1902 17.0409 14.2545C17.0321 14.3271 17.0451 14.403 17.0711 14.5547L17.906 19.4221C17.994 19.9355 18.038 20.1922 17.9553 20.3445C17.8833 20.477 17.7554 20.57 17.6071 20.5975C17.4366 20.6291 17.2061 20.5078 16.7451 20.2654L12.3724 17.9658C12.2361 17.8942 12.168 17.8584 12.0962 17.8443C12.0327 17.8318 11.9673 17.8318 11.9038 17.8443C11.832 17.8584 11.7639 17.8942 11.6277 17.9658L7.25492 20.2654C6.79392 20.5078 6.56341 20.6291 6.39297 20.5975C6.24468 20.57 6.11672 20.477 6.04474 20.3445C5.962 20.1922 6.00603 19.9355 6.09407 19.4221L6.92889 14.5547C6.95491 14.403 6.96793 14.3271 6.95912 14.2545C6.95132 14.1902 6.93111 14.128 6.89961 14.0715C6.86402 14.0076 6.80888 13.9538 6.69859 13.8464L3.16056 10.4004C2.78766 10.0372 2.60121 9.85558 2.57853 9.68377C2.55879 9.5343 2.60755 9.38389 2.71125 9.27444C2.83044 9.14863 3.08797 9.11099 3.60304 9.03571L8.49431 8.32077C8.64642 8.29854 8.72248 8.28742 8.78872 8.25662C8.84736 8.22935 8.90016 8.19096 8.94419 8.14358C8.99391 8.09006 9.02793 8.02113 9.09597 7.88328L11.2827 3.45332Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}

function HeaderMenuIcon() {
  return (
    <svg
      className="site-header__menu-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M15 17.5H9C9 17.5 11 15.2444 11 12.5C11 11 9.91479 10.4867 9.89534 8.96204C9.8966 5.94404 13.5297 6.1045 14.7926 7.30402M9 12.5H14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UkFlagIcon() {
  return (
    <svg
      className="site-header__locale-flag"
      width={20}
      height={10}
      viewBox="0 0 60 30"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <clipPath id="uk-flag-clip">
          <rect width="60" height="30" rx="1" />
        </clipPath>
      </defs>
      <g clipPath="url(#uk-flag-clip)">
        <path fill="#012169" d="M0 0h60v30H0z" />
        <path fill="none" stroke="#fff" strokeWidth="6" d="M0 0l60 30M60 0L0 30" />
        <path fill="none" stroke="#C8102E" strokeWidth="4" d="M0 0l60 30M60 0L0 30" />
        <path fill="none" stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60" />
        <path fill="none" stroke="#C8102E" strokeWidth="6" d="M30 0v30M0 15h60" />
      </g>
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
      <path
        d="M15 17h5l-1.4-2.03A2 2 0 0 1 18 13.8V10a6 6 0 0 0-12 0v3.8a2 2 0 0 1-.6 1.42L4 17h5m6 0a3 3 0 1 1-6 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const navId = useId()
  const navigate = useNavigate()
  const session = useStore(sessionStore)
  const account = session.account
  const notifications = useStore(notificationsStore)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__logo">
          <img src={tripma.wordmark} alt="Tripma" width={105} height={30} />
        </Link>
        <nav id={navId} className={`site-header__nav ${open ? 'is-open' : ''}`}>
          <Link to="/destinations" className="site-header__link">Destinations</Link>
          <Link to="/stays" className="site-header__link">Stays</Link>
          {account ? (
            <Link to="/trips" className="site-header__link">My trips</Link>
          ) : null}
          <Link to="/status" className="site-header__link">Status</Link>
          {account ? (
            <Link to="/saved" className="site-header__link">Saved</Link>
          ) : null}
          <Link to="/help" className="site-header__link">Help</Link>
          <div
            className="site-header__locale"
            role="group"
            aria-label="Language, location, and currency"
          >
            <a className="site-header__link" href="#">English (UK)</a>
            <a className="site-header__link" href="#">
              <span className="site-header__locale-pair">
                <UkFlagIcon /><span className="site-header__locale-text">United Kingdom</span>
              </span>
            </a>
            <a className="site-header__link" href="#">£ GBP</a>
          </div>
          {account ? (
            <>
              <Link to="/account" className="site-header__link site-header__hide-mobile">
                {account.firstName || 'Account'}
              </Link>
              <button
                type="button"
                className="btn btn--header site-header__hide-mobile"
                onClick={() => {
                  signOut()
                  setOpen(false)
                  navigate('/')
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/signin" className="btn btn--header site-header__hide-mobile">Log in</Link>
          )}
        </nav>
        <div className="site-header__end">
          <div className="site-header__end-cluster">
            {account ? (
              <Link
                to="/notifications"
                className="notif-bell"
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
              >
                <BellIcon />
                {unreadCount > 0 ? (
                  <span className="notif-bell__badge" aria-hidden>
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            ) : null}
            <button
              type="button"
              className="site-header__menu-btn"
              aria-expanded={open}
              aria-controls={navId}
              onClick={() => setOpen(v => !v)}
            >
              <span className="visually-hidden">Menu</span>
              <HeaderMenuIcon />
            </button>
          </div>
          {account ? (
            <Link to="/account" className="btn btn--header">{account.firstName || 'Account'}</Link>
          ) : (
            <Link to="/signin" className="btn btn--header">Log in</Link>
          )}
        </div>
      </div>
    </header>
  )
}

interface AirportFieldProps {
  fieldKey: 'from' | 'to'
  name: string
  label: string
  hint: string
  value: string
  onChange: (code: string) => void
  menuOpen: AirportMenuKey
  onOpenMenu: (key: 'from' | 'to') => void
  onCloseMenu: () => void
  excludeCodes?: readonly string[]
  showFlightSearchOptions?: boolean
  omitDirectFlightsOption?: boolean
  nearbyAirportsChecked?: boolean
  onNearbyAirportsChange?: (checked: boolean) => void
  directFlightsChecked?: boolean
  onDirectFlightsChange?: (checked: boolean) => void
  showToNearbyAirportsOption?: boolean
  toNearbyAirportsChecked?: boolean
  onToNearbyAirportsChange?: (checked: boolean) => void
}

export function AirportField({
  fieldKey,
  name,
  label,
  hint,
  value,
  onChange,
  menuOpen,
  onOpenMenu,
  onCloseMenu,
  excludeCodes = [],
  showFlightSearchOptions = false,
  nearbyAirportsChecked: _nearbyAirportsChecked = false,
  onNearbyAirportsChange,
  showToNearbyAirportsOption = false,
  toNearbyAirportsChecked: _toNearbyAirportsChecked = false,
  onToNearbyAirportsChange,
}: AirportFieldProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const controlRef = useRef<HTMLDivElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const listId = useId()
  const labelId = useId()
  const [filter, setFilter] = useState('')
  const [airportApi, setAirportApi] = useState<AirportApi | null>(null)
  const [popoverPlacement, setPopoverPlacement] = useState<PopoverPlacement | null>(null)
  const matchMax768 = useMatchMax768()

  const open = menuOpen === fieldKey

  const hasMobileAirportExtras =
    matchMax768 &&
    ((showFlightSearchOptions && onNearbyAirportsChange) ||
      (showToNearbyAirportsOption && onToNearbyAirportsChange))

  const useAirportPopoverSplit = Boolean(open && popoverPlacement && hasMobileAirportExtras)

  useEffect(() => {
    getAirportApi().then(setAirportApi)
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setPopoverPlacement(null)
      return
    }
    const root = rootRef.current
    if (!root) return

    function updatePlacement() {
      const anchor = controlRef.current ?? root
      if (!anchor) return
      const r = anchor.getBoundingClientRect()
      const w = Math.max(r.width, Math.min(480, window.innerWidth - 48))
      setPopoverPlacement({ top: r.bottom + 4, left: r.left, width: w })
    }

    updatePlacement()
    window.addEventListener('resize', updatePlacement)
    window.addEventListener('scroll', updatePlacement, true)
    return () => {
      window.removeEventListener('resize', updatePlacement)
      window.removeEventListener('scroll', updatePlacement, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node | null
      if (!target) return
      if (
        (rootRef.current && rootRef.current.contains(target)) ||
        (popoverRef.current && popoverRef.current.contains(target))
      ) {
        return
      }
      onCloseMenu()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseMenu()
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onCloseMenu])

  const filtered = useMemo<Airport[]>(() => {
    if (!airportApi) return []
    const list = airportApi.searchAirports(filter, { limit: 80, excludeCodes })
    const selected = value ? airportApi.getAirportByCode(value) : null
    if (!selected) return list
    const excluded = new Set(excludeCodes.map(c => String(c).trim().toUpperCase()).filter(Boolean))
    if (excluded.has(selected.code)) return list
    if (list.some(a => a.code === selected.code)) return list
    return [selected, ...list].slice(0, 80)
  }, [airportApi, filter, excludeCodes, value])

  const closedDisplay =
    value && airportApi ? airportApi.formatAirportFieldValue(value) : value || ''
  const inputDisplay = open ? filter : closedDisplay
  const showHint =
    (!closedDisplay && !open) || (open && !String(inputDisplay ?? '').trim())

  function pick(code: string) {
    onChange(code)
    onCloseMenu()
  }

  function renderOptions() {
    if (!airportApi) return <p className="flight-search__empty">Loading airports…</p>
    if (filtered.length === 0) return <p className="flight-search__empty">No airports match</p>
    return filtered.map(a => {
      const title = buildAirportOptionTitle(a)
      const subtitle = buildAirportOptionSubtitle(a)
      const aria = subtitle ? `${title}, ${subtitle}` : title
      return (
        <button
          key={a.code}
          type="button"
          role="option"
          aria-label={aria}
          aria-selected={a.code === value}
          className={`flight-search__option ${a.code === value ? 'is-selected' : ''}`}
          onMouseDown={e => e.preventDefault()}
          onClick={() => pick(a.code)}
        >
          <span className="flight-search__option-title">{title}</span>
          {subtitle ? (
            <span className="flight-search__option-sub">{subtitle}</span>
          ) : null}
        </button>
      )
    })
  }

  return (
    <div ref={rootRef} className={`flight-search__airport ${open ? 'is-active' : ''}`}>
      <input type="hidden" name={name} value={value} />
      <div
        ref={controlRef}
        className={`flight-search__control flight-search__control--stacked ${open ? 'is-open' : ''}`}
      >
        <span className="flight-search__label" id={labelId}>
          {label}
        </span>
        <div className="flight-search__value-row">
          {showHint ? (
            <span className="flight-search__hint" aria-hidden="true">
              {hint}
            </span>
          ) : null}
          <input
            id={`${name}-combobox`}
            type="text"
            className={`flight-search__input flight-search__input--stacked ${showHint ? 'is-empty' : ''}`}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-labelledby={labelId}
            autoComplete="off"
            value={inputDisplay}
            onChange={e => {
              const next = e.target.value
              if (!open) onOpenMenu(fieldKey)
              setFilter(next)
            }}
            onFocus={async () => {
              onOpenMenu(fieldKey)
              const client = airportApi ?? (await getAirportApi())
              if (!airportApi) setAirportApi(client)
              const a = client.getAirportByCode(value)
              setFilter(a ? buildAirportLocationLabel(a) || a.code : '')
            }}
          />
          {String(value || '').trim() ? (
            <FieldClearButton
              ariaLabel={`Clear ${label}`}
              onClear={() => {
                onChange('')
                setFilter('')
                onCloseMenu()
              }}
            />
          ) : null}
        </div>
      </div>
      {open &&
        popoverPlacement &&
        createPortal(
          useAirportPopoverSplit ? (
            <div
              ref={popoverRef}
              className="flight-search__popover flight-search__popover--portal flight-search__popover--airport-mobile"
              style={{
                top: popoverPlacement.top,
                left: popoverPlacement.left,
                width: popoverPlacement.width,
              }}
            >
              <div className="flight-search__popover-airport-extras" />
              <div
                id={listId}
                className="flight-search__popover-airport-results"
                role="listbox"
                aria-label={label}
              >
                {renderOptions()}
              </div>
            </div>
          ) : (
            <div
              ref={popoverRef}
              id={listId}
              className="flight-search__popover flight-search__popover--portal"
              style={{
                top: popoverPlacement.top,
                left: popoverPlacement.left,
                width: popoverPlacement.width,
              }}
              role="listbox"
              aria-label={label}
            >
              {renderOptions()}
            </div>
          ),
          document.body
        )}
    </div>
  )
}

export function HeroSearchGroup() {
  const pillsId = useId()

  return (
    <div className="hero__search-block">
      <div className="hero__search-block__lead">
        <SearchPills selectedTab="flights" id={pillsId} size="lg" />
        <h1 id="hero-heading" className="hero__title">
          Find the best flights anywhere
        </h1>
      </div>
      <div
        role="region"
        aria-labelledby={`${pillsId}-flights`}
        className="hero__search-panel"
      >
        <FlightSearchBar />
      </div>
    </div>
  )
}

interface TripTypeOption {
  value: TripType
  label: string
}

const FLIGHT_TRIP_TYPES: readonly TripTypeOption[] = [
  { value: 'return', label: 'Return' },
  { value: 'one-way', label: 'One way' },
  { value: 'multi-city', label: 'Multi-city' },
]

function TripTypeReturnIcon() {
  return (
    <span className="flight-search-bar__trip-option-icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 17H4M4 17L8 13M4 17L8 21M4 7H20M20 7L16 3M20 7L16 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function TripTypeOneWayIcon() {
  return (
    <span className="flight-search-bar__trip-option-icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 12H20M20 12L14 6M20 12L14 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function TripTypeMultiCityIcon() {
  return (
    <span className="flight-search-bar__trip-option-icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.5 5H11.9344C14.9816 5 16.5053 5 17.0836 5.54729C17.5836 6.02037 17.8051 6.71728 17.6702 7.39221C17.514 8.17302 16.2701 9.05285 13.7823 10.8125L9.71772 13.6875C7.2299 15.4471 5.98599 16.327 5.82984 17.1078C5.69486 17.7827 5.91642 18.4796 6.41636 18.9527C6.99474 19.5 8.51836 19.5 11.5656 19.5H12.5M8 5C8 6.65685 6.65685 8 5 8C3.34315 8 2 6.65685 2 5C2 3.34315 3.34315 2 5 2C6.65685 2 8 3.34315 8 5ZM22 19C22 20.6569 20.6569 22 19 22C17.3431 22 16 20.6569 16 19C16 17.3431 17.3431 16 19 16C20.6569 16 22 17.3431 22 19Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

interface TripTypeTriggerChevronProps {
  open: boolean
}

function TripTypeTriggerChevron({ open }: TripTypeTriggerChevronProps) {
  return (
    <span
      className={`flight-search-bar__trip-trigger-chevron ${open ? 'is-open' : ''}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 9L12 15L18 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

interface TripTypeSelectProps {
  value: TripType
  onChange: (value: TripType) => void
}

export function TripTypeSelect({ value, onChange }: TripTypeSelectProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const listId = useId()
  const [open, setOpen] = useState(false)
  const selected = FLIGHT_TRIP_TYPES.find(t => t.value === value) ?? FLIGHT_TRIP_TYPES[0]

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

  return (
    <div ref={rootRef} className={`flight-search-bar__trip-type-field ${open ? 'is-active' : ''}`}>
      <input type="hidden" name="trip_type" value={value} />
      <button
        type="button"
        className={`flight-search-bar__trip-trigger ${open ? 'is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Trip type"
        onClick={() => setOpen(o => !o)}
      >
        <span className="flight-search-bar__trip-trigger-label">{selected.label}</span>
        <TripTypeTriggerChevron open={open} />
      </button>
      {open && (
        <div
          id={listId}
          className="flight-search__popover flight-search-bar__trip-popover"
          role="listbox"
          aria-label="Trip type"
        >
          {FLIGHT_TRIP_TYPES.map(opt => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={value === opt.value}
              className={`flight-search__option flight-search-bar__trip-option ${value === opt.value ? 'is-selected' : ''}`}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              {opt.value === 'return' ? <TripTypeReturnIcon /> : null}
              {opt.value === 'one-way' ? <TripTypeOneWayIcon /> : null}
              {opt.value === 'multi-city' ? <TripTypeMultiCityIcon /> : null}
              <span className="flight-search__option-title">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SwapAirportsIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20 17H4M4 17L8 13M4 17L8 21M4 7H20M20 7L16 3M20 7L16 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FlightSearchBar() {
  const directFlightsId = useId()
  const navigate = useNavigate()
  const [tripType, setTripType] = useState<TripType>('return')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [airportMenu, setAirportMenu] = useState<AirportMenuKey>(null)
  const [nearbyAirports, setNearbyAirports] = useState(false)
  const [toNearbyAirports, setToNearbyAirports] = useState(false)
  const [directFlights, setDirectFlights] = useState(false)
  const [swapIconFlipped, setSwapIconFlipped] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    const fromValue = String(data.get('from') || '').trim()
    const toValue = String(data.get('to') || '').trim()
    const depart = String(data.get('depart_date') || '').trim()
    const returnDate = String(data.get('return_date') || '').trim()
    const adults = String(data.get('adults') || '1')
    const children = String(data.get('children') || '0')
    const direct = data.get('direct_flights') ? '1' : ''
    const trip = String(data.get('trip_type') || tripType)
    if (fromValue) params.set('from', fromValue)
    if (toValue) params.set('to', toValue)
    if (depart) params.set('depart', depart)
    if (returnDate && trip !== 'one-way') params.set('return', returnDate)
    params.set('adults', adults)
    params.set('children', children)
    if (direct) params.set('direct', direct)
    params.set('trip', trip)
    navigate(`/flights?${params.toString()}`)
  }

  function swapFromTo() {
    setAirportMenu(null)
    setFrom(to)
    setTo(from)
    setSwapIconFlipped(f => !f)
  }

  return (
    <form className="flight-search-bar" onSubmit={onSubmit}>
      <div className="flight-search-bar__trip-type">
        <TripTypeSelect value={tripType} onChange={setTripType} />
        <div className="flight-search__direct-flights" role="group" aria-label="Flight search options">
          <label className="flight-search__airport-option" htmlFor={directFlightsId}>
            <input
              id={directFlightsId}
              type="checkbox"
              name="direct_flights"
              checked={directFlights}
              onChange={e => setDirectFlights(e.target.checked)}
            />
            <span>Direct flights</span>
          </label>
        </div>
      </div>
      <div className="flight-search">
        <DateRangeField oneWay={tripType === 'one-way'} />
        <div className="flight-search__airports-pair">
          <AirportField
            fieldKey="from"
            name="from"
            label="From"
            hint="Country, city or airport"
            value={from}
            onChange={setFrom}
            menuOpen={airportMenu}
            onOpenMenu={setAirportMenu}
            onCloseMenu={() => setAirportMenu(null)}
            excludeCodes={to ? [to] : []}
            showFlightSearchOptions
            omitDirectFlightsOption
            nearbyAirportsChecked={nearbyAirports}
            onNearbyAirportsChange={setNearbyAirports}
          />
          <button
            type="button"
            className="flight-search__airport-swap"
            aria-label="Swap departure and arrival airports"
            onClick={swapFromTo}
          >
            <span
              className={`flight-search__airport-swap-icon ${swapIconFlipped ? 'flight-search__airport-swap-icon--flipped' : ''}`}
            >
              <SwapAirportsIcon />
            </span>
          </button>
          <AirportField
            fieldKey="to"
            name="to"
            label="To"
            hint="Country, city or airport"
            value={to}
            onChange={setTo}
            menuOpen={airportMenu}
            onOpenMenu={setAirportMenu}
            onCloseMenu={() => setAirportMenu(null)}
            excludeCodes={from ? [from] : []}
            showToNearbyAirportsOption
            toNearbyAirportsChecked={toNearbyAirports}
            onToNearbyAirportsChange={setToNearbyAirports}
          />
        </div>
        <PassengersField />
        <button type="submit" className="btn btn--search">
          <span className="btn--search__text">Search</span>
          <span className="btn--search__icon" aria-hidden>
            <ArrowRightIcon className="btn--search__arrow" />
          </span>
        </button>
      </div>
    </form>
  )
}

interface SectionTitleProps {
  children: ReactNode
  aside?: ReactNode
  headingId?: string
}

export function SectionTitle({ children, aside, headingId }: SectionTitleProps) {
  return (
    <div className="section-title">
      <h2 className="section-title__heading" id={headingId}>
        {children}
      </h2>
      {aside}
    </div>
  )
}

interface ArrowRightIconProps {
  className?: string
}

export function ArrowRightIcon({ className }: ArrowRightIconProps) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 12H20M20 12L14 6M20 12L14 18"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface SeeAllLinkProps {
  to?: string
}

export function SeeAllLink({ to = '/destinations' }: SeeAllLinkProps = {}) {
  return (
    <Link className="see-all" to={to}>
      <span className="see-all__label">All</span>
      <span className="see-all__icon">
        <ArrowRightIcon className="see-all__arrow" />
      </span>
    </Link>
  )
}

function splitDealPrice(price: string): { prefix: string; digits: string } {
  const m = String(price).match(/^(\D+)(\d[\d,]*)$/)
  if (m) return { prefix: m[1], digits: m[2] }
  return { prefix: '', digits: String(price) }
}

interface DealCardProps {
  image: string
  title: ReactNode
  highlight?: ReactNode
  price: string
  description: ReactNode
  imageClass?: string
}

export function DealCard({ image, title, highlight, price, description, imageClass }: DealCardProps) {
  const { prefix, digits } = splitDealPrice(price)
  return (
    <article className="deal-card">
      <div className={`deal-card__image ${imageClass ?? ''}`}>
        <img src={image} alt="" />
      </div>
      <div className="deal-card__body">
        <div className="deal-card__row">
          <p className="deal-card__title">
            {title}
            <span className="text-accent">{highlight}</span>
          </p>
          <p className="deal-card__price">
            <span className="deal-card__price-from">From</span>
            <span className="deal-card__price-amount">
              {prefix ? (
                <>
                  <span className="deal-card__price-currency">{prefix}</span>
                  <span className="deal-card__price-figures">{digits}</span>
                </>
              ) : (
                digits
              )}
            </span>
          </p>
        </div>
        <p className="deal-card__desc">{description}</p>
      </div>
    </article>
  )
}

interface StayCardProps {
  image: string
  title: ReactNode
  description: ReactNode
  imageClass?: string
}

export function StayCard({ image, title, description, imageClass }: StayCardProps) {
  return (
    <article className="deal-card">
      <div className={`deal-card__image ${imageClass ?? ''}`}>
        <img src={image} alt="" />
      </div>
      <div className="deal-card__body">
        <p className="deal-card__title deal-card__title--stay">{title}</p>
        <p className="deal-card__desc">{description}</p>
      </div>
    </article>
  )
}

interface TestimonialProps {
  avatar: string
  name: string
  meta: ReactNode
  stars: number
  children: ReactNode
}

export function Testimonial({ avatar, name, meta, stars, children }: TestimonialProps) {
  return (
    <blockquote className="testimonial">
      <img className="testimonial__avatar" src={avatar} alt="" width={48} height={48} />
      <div className="testimonial__body">
        <div className="testimonial__meta">
          <cite className="testimonial__name">{name}</cite>
          <p className="testimonial__when">{meta}</p>
          <StarRow filled={stars} />
        </div>
        <p className="testimonial__text">
          {children}{' '}
          <a className="link-more" href="#">
            read more...
          </a>
        </p>
      </div>
    </blockquote>
  )
}

interface FooterColumnProps {
  title: string
  links: readonly string[]
}

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="footer-col">
      <h3 className="footer-col__title">{title}</h3>
      <ul className="footer-col__list">
        {links.map(label => (
          <li key={label}>
            <a href="#">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  const about = ['About Tripma', 'How it works', 'Careers', 'Press', 'Blog', 'Forum']
  const partner = [
    'Partnership programs',
    'Affiliate program',
    'Connectivity partners',
    'Promotions and events',
    'Integrations',
    'Community',
    'Loyalty program',
  ]
  const support = [
    'Help Center',
    'Contact us',
    'Privacy policy',
    'Terms of service',
    'Trust and safety',
    'Accessibility',
  ]
  const app = ['Tripma for Android', 'Tripma for iOS', 'Mobile site']

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__logo-wrap">
          <a href="#" className="site-footer__logo">
            <img src={tripma.wordmark} alt="Tripma" width={131} height={37} />
          </a>
        </div>
        <FooterColumn title="About" links={about} />
        <FooterColumn title="Partner with us" links={partner} />
        <FooterColumn title="Support" links={support} />
        <div className="footer-col footer-col--apps">
          <h3 className="footer-col__title">Get the app</h3>
          <ul className="footer-col__list">
            {app.map(label => (
              <li key={label}>
                <a href="#">{label}</a>
              </li>
            ))}
          </ul>
          <div className="footer-badges">
            <a
              href="https://apps.apple.com/"
              className="badge-app-store"
              aria-label="Download on the App Store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tripma.appStoreBadge} alt="" decoding="async" />
            </a>
            <a
              href="https://play.google.com/store"
              className="badge-google-play"
              aria-label="Get it on Google Play"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tripma.googlePlay} alt="" decoding="async" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function HomeContent() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <img className="hero__map" src={tripma.heroMap} alt="" />
        <div className="hero__content">
          <HeroSearchGroup />
        </div>
      </section>

      <main className="main">
        <div className="main__inner">
          <section className="band" aria-labelledby="deals-heading">
            <SectionTitle aside={<SeeAllLink />} headingId="deals-heading">
              Find your next adventure with these <span className="text-accent">flight deals</span>
            </SectionTitle>
            <div className="card-grid card-grid--deals">
              <DealCard
                image={tripma.dealShanghai}
                title="The Bund,"
                highlight=" Shanghai"
                price="£400"
                description="China’s most international city"
              />
              <DealCard
                image={tripma.dealSydney}
                title="Sydney Opera House,"
                highlight=" Sydney"
                price="£780"
                description="Take a stroll along the famous harbor"
              />
              <DealCard
                image={tripma.dealKyoto}
                title="Kōdaiji Temple,"
                highlight=" Kyoto"
                price="£620"
                description="Step back in time in the Gion district"
              />
            </div>
          </section>

          <section className="band" aria-labelledby="stays-heading">
            <SectionTitle aside={<SeeAllLink />} headingId="stays-heading">
              Explore unique <span className="text-accent">places to stay</span>
            </SectionTitle>
            <div className="card-grid card-grid--stays">
              <StayCard
                image={tripma.stayMaldives}
                title={
                  <>
                    Stay among the atolls in <span className="text-accent">Maldives</span>
                  </>
                }
                description="From the 2nd century AD, the islands were known as the 'Money Isles' due to the abundance of cowry shells, a currency of the early ages."
              />
              <StayCard
                image={tripma.stayMorocco}
                title={
                  <>
                    Experience the Ourika Valley in <span className="text-accent">Morocco</span>
                  </>
                }
                description="Morocco’s Hispano-Moorish architecture blends influences from Berber culture, Spain, and contemporary artistic currents in the Middle East."
              />
              <StayCard
                image={tripma.stayMongolia}
                title={
                  <>
                    Live traditionally in <span className="text-accent">Mongolia</span>
                  </>
                }
                description="Traditional Mongolian yurts consists of an angled latticework of wood or bamboo for walls, ribs, and a wheel."
                imageClass="deal-card__image--mongolia"
              />
            </div>
            <div className="band__cta">
              <Link className="btn btn--secondary" to="/stays">
                <span className="btn--secondary__text">Explore more stays</span>
                <span className="btn--secondary__icon" aria-hidden>
                  <ArrowRightIcon className="btn--secondary__arrow" />
                </span>
              </Link>
            </div>
          </section>

          <section className="band band--testimonials" aria-labelledby="testimonials-heading">
            <h2 id="testimonials-heading" className="testimonials__title">
              What <span className="text-accent">Tripma</span> users are saying
            </h2>
            <div className="testimonial-grid">
              <Testimonial
                avatar={tripma.avatar1}
                name="Yifei Chen"
                stars={5}
                meta={
                  <>
                    Seoul, South Korea <span className="text-muted-sep">|</span> April 2026
                  </>
                }
              >
                What a great experience using Tripma! I booked all of my flights for my gap year through Tripma and never had any issues. When I had to cancel a flight because of an emergency, Tripma support helped me
              </Testimonial>
              <Testimonial
                avatar={tripma.avatar2}
                name="Kaori Yamaguchi"
                stars={4}
                meta={
                  <>
                    Honolulu, Hawaii <span className="text-muted-sep">|</span> February 2026
                  </>
                }
              >
                My family and I visit Hawaii every year, and we usually book our flights using other services. Tripma was recommened to us by a long time friend, and I’m so glad we tried it out! The process was easy and
              </Testimonial>
              <Testimonial
                avatar={tripma.avatar3}
                name="Anthony Lewis"
                stars={5}
                meta={
                  <>
                    Berlin, Germany <span className="text-muted-sep">|</span> April 2026
                  </>
                }
              >
                When I was looking to book my flight to Berlin from LAX, Tripma had the best browsing experiece so I figured I’d give it a try. It was my first time using Tripma, but I’d definitely recommend it to a friend and use it for
              </Testimonial>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default function App() {
  return (
    <div className="tripma">
      <SiteHeader />
      <HomeContent />
      <SiteFooter />
    </div>
  )
}
