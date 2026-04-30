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
import { SearchPills, type SearchPillTabId } from './SearchPills'
import { CarsSearchBar, HotelsSearchBar } from './HeroSearchBars'
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

// Shared Tailwind class strings for repeated patterns.
const HEADER_LINK =
  'px-[10px] text-[16px] text-grey-400 rounded-sm min-h-11 inline-flex items-center hover:text-purple hover:no-underline'

const BTN_HEADER =
  'box-border inline-flex items-center justify-center bg-purple text-grey-100 text-[16px] font-normal border-none rounded-[12px] min-h-10 h-10 px-4 cursor-pointer no-underline transition-[background] duration-200 hover:bg-purple-hover hover:no-underline'

const BTN_HEADER_MOBILE_FULL =
  'max-md:w-auto max-md:min-h-11 max-md:h-auto max-md:px-4 max-md:py-[11px]'

const FLIGHT_SEARCH_LABEL =
  'flex-shrink-0 text-[15px] font-semibold leading-[1.25] text-grey-600 tracking-[0.02em]'

const FLIGHT_SEARCH_HINT =
  'absolute left-0 right-0 top-1/2 -translate-y-1/2 text-[18px] leading-[1.25] text-grey-400 pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis text-left'

const FLIGHT_SEARCH_VALUE_ROW =
  'relative flex items-center gap-1 min-h-[22px] flex-auto min-w-0 overflow-hidden flex-[0_0_auto]'

const FLIGHT_SEARCH_INPUT_STACKED =
  'relative w-full max-w-full min-w-0 h-auto min-h-[22px] flex-1 self-stretch p-0 m-0 text-[18px] leading-[1.25] overflow-hidden whitespace-nowrap text-ellipsis bg-transparent border-none text-grey-900 focus:outline-none text-left'

const OPTION_BASE =
  'flex flex-col items-stretch self-stretch gap-1 w-full m-0 px-3 py-[10px] flex-shrink-0 border-none rounded-sm bg-transparent font-sans text-[16px] font-normal leading-[1.35] text-grey-900 text-left cursor-pointer appearance-none focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2'

const OPTION_TITLE = 'block font-semibold text-grey-900 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis'
const OPTION_SUB = 'block text-[14px] font-normal leading-[1.4] text-grey-400 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis'

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
    <div className="flex gap-2 pt-1" role="img" aria-label={`${filled} out of 5 stars`.replace('5', String(total))}>
      {Array.from({ length: total }, (_, i) => {
        const isFilled = i < filled
        return (
          <svg
            key={i}
            className={`w-6 h-6 block ${isFilled ? 'text-purple' : 'text-[color-mix(in_srgb,var(--color-purple)_35%,white)]'}`}
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
              fill={isFilled ? 'currentColor' : 'none'}
            />
          </svg>
        )
      })}
    </div>
  )
}

function HeaderMenuIcon() {
  return (
    <svg
      className="block w-6 h-6 flex-shrink-0"
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
      className="flex-shrink-0 block w-5 h-[10px]"
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

  // Desktop nav: flex row with gap-2. Mobile (max-md): hidden unless open, becomes dropdown.
  const navClasses = `flex flex-wrap items-center gap-2 p-0 ml-auto max-md:ml-0 max-md:absolute max-md:top-full max-md:left-0 max-md:right-0 max-md:flex-col max-md:flex-nowrap max-md:items-stretch max-md:bg-white max-md:p-2 max-md:shadow-card max-md:gap-0 ${
    open ? 'max-md:flex' : 'max-md:hidden'
  }`

  return (
    <header className="relative z-[50] bg-white border-b border-transparent">
      <div className="relative mx-auto flex items-center justify-between gap-4 p-2 max-w-[1440px]">
        <Link to="/" className="flex-shrink-0">
          <img src={tripma.wordmark} alt="Tripma" width={105} height={30} className="block w-[104.8px] max-w-full h-auto" />
        </Link>
        <nav id={navId} className={navClasses}>
          <Link to="/destinations" className={HEADER_LINK}>Destinations</Link>
          <Link to="/stays" className={HEADER_LINK}>Stays</Link>
          {account ? (
            <Link to="/trips" className={HEADER_LINK}>My trips</Link>
          ) : null}
          <Link to="/status" className={HEADER_LINK}>Status</Link>
          {account ? (
            <Link to="/saved" className={HEADER_LINK}>Saved</Link>
          ) : null}
          <Link to="/help" className={HEADER_LINK}>Help</Link>
          <div
            className="inline-flex items-stretch flex-wrap box-border h-10 min-h-10 border border-grey-200 rounded-[12px] bg-grey-100 overflow-hidden max-md:w-full max-md:h-auto max-md:min-h-11 max-md:flex-row max-md:flex-nowrap max-md:items-stretch max-md:overflow-x-auto"
            role="group"
            aria-label="Language, location, and currency"
          >
            <a
              className="inline-flex items-center justify-center gap-2 min-h-0 rounded-none px-5 self-stretch leading-none text-[16px] text-grey-400 border-r border-grey-200 hover:text-purple hover:no-underline max-md:flex-1 max-md:min-w-min max-md:w-auto max-md:min-h-11 max-md:px-3 max-md:whitespace-nowrap"
              href="#"
            >
              English (UK)
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 min-h-0 rounded-none px-5 self-stretch leading-none text-[16px] text-grey-400 border-r border-grey-200 hover:text-purple hover:no-underline max-md:flex-1 max-md:min-w-min max-md:w-auto max-md:min-h-11 max-md:px-3 max-md:whitespace-nowrap"
              href="#"
            >
              <span className="inline-flex items-center gap-2">
                <UkFlagIcon /><span className="leading-none">United Kingdom</span>
              </span>
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 min-h-0 rounded-none px-5 self-stretch leading-none text-[16px] text-grey-400 hover:text-purple hover:no-underline max-md:flex-1 max-md:min-w-min max-md:w-auto max-md:min-h-11 max-md:px-3 max-md:whitespace-nowrap"
              href="#"
            >
              £ GBP
            </a>
          </div>
          {account ? (
            <>
              <Link to="/account" className={`${HEADER_LINK} max-md:hidden`}>
                {account.firstName || 'Account'}
              </Link>
              <button
                type="button"
                className={`${BTN_HEADER} max-md:hidden`}
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
            <Link to="/signin" className={`${BTN_HEADER} max-md:hidden`}>Log in</Link>
          )}
        </nav>
        <div className="hidden max-md:flex items-center gap-2 flex-shrink-0 ml-auto">
          <div className="flex items-center gap-[2px] flex-shrink-0">
            {account ? (
              <Link
                to="/notifications"
                className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-transparent border border-transparent cursor-pointer text-grey-900 hover:bg-grey-100"
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
              >
                <BellIcon />
                {unreadCount > 0 ? (
                  <span
                    className="absolute top-[2px] right-[2px] min-w-4 h-4 px-1 rounded-full bg-[#d9222a] text-white text-[10px] font-bold flex items-center justify-center"
                    aria-hidden
                  >
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            ) : null}
            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 p-0 border-none bg-transparent cursor-pointer rounded-sm text-grey-400 hover:text-purple focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
              aria-expanded={open}
              aria-controls={navId}
              onClick={() => setOpen(v => !v)}
            >
              <span className="visually-hidden">Menu</span>
              <HeaderMenuIcon />
            </button>
          </div>
          {account ? (
            <Link to="/account" className={`${BTN_HEADER} ${BTN_HEADER_MOBILE_FULL}`}>{account.firstName || 'Account'}</Link>
          ) : (
            <Link to="/signin" className={`${BTN_HEADER} ${BTN_HEADER_MOBILE_FULL}`}>Log in</Link>
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
    if (!airportApi) return <p className="m-0 px-[13px] py-2 text-[16px] text-grey-400">Loading airports…</p>
    if (filtered.length === 0) return <p className="m-0 px-[13px] py-2 text-[16px] text-grey-400">No airports match</p>
    return filtered.map(a => {
      const title = buildAirportOptionTitle(a)
      const subtitle = buildAirportOptionSubtitle(a)
      const aria = subtitle ? `${title}, ${subtitle}` : title
      const isSel = a.code === value
      const selClasses = isSel
        ? 'bg-purple text-purple-on [&_.opt-title]:text-purple-on [&_.opt-sub]:text-[rgba(246,246,254,0.88)] hover:not-disabled:bg-purple-hover hover:not-disabled:text-purple-on'
        : 'hover:not-disabled:bg-[rgba(96,93,236,0.08)]'
      return (
        <button
          key={a.code}
          type="button"
          role="option"
          aria-label={aria}
          aria-selected={isSel}
          className={`${OPTION_BASE} ${selClasses}`}
          onMouseDown={e => e.preventDefault()}
          onClick={() => pick(a.code)}
        >
          <span className={`${OPTION_TITLE} opt-title`}>{title}</span>
          {subtitle ? (
            <span className={`${OPTION_SUB} opt-sub`}>{subtitle}</span>
          ) : null}
        </button>
      )
    })
  }

  // Airport field wrapper: stacked control, merged seams on desktop for airports-pair.
  // Base control: bg-white border-2 grey-200 rounded-[16px], stacked (flex-col justify-center gap-2px),
  // min-h-20 px-[13px] py-[9px], cursor-pointer.
  // Open: border-purple; desktop adjacent seam handled at parent level via shadow rules.
  // This component lives inside .airports-pair which manages the seam-merging via Tailwind on parent.
  // We key "first" / "last" airport via fieldKey. fieldKey 'from' is first, 'to' is last.
  const isFirst = fieldKey === 'from'
  // Desktop (md+): for first airport, round only left side (no right round, no right seam-border issues).
  // For last airport: no left round, no left border; the swap overlaps between them.
  // We use md: utilities to override mobile.
  const desktopSeam = isFirst
    ? 'md:rounded-r-none md:pr-[28px]'
    : 'md:rounded-l-none md:pl-[38px] md:border-l-0'
  // When open, on desktop, the first airport needs purple right border; the second needs purple inset-left.
  const openSeamClasses = open
    ? isFirst
      ? 'border-purple md:border-r-purple md:relative md:z-[3]'
      : 'border-purple md:shadow-[inset_2px_0_0_var(--color-purple)] md:relative md:z-[3]'
    : 'border-grey-200'

  // Mobile: both fields have padding-right 52px to clear the absolute swap button.
  const mobileSwapClearance = 'max-md:pl-[13px] max-md:pr-[52px]'

  return (
    <div
      ref={rootRef}
      className={`relative flex flex-col flex-1 min-w-0 max-md:flex-[0_0_auto] max-md:w-full max-md:min-w-0 ${open ? 'z-[20]' : ''}`}
    >
      <input type="hidden" name={name} value={value} />
      <div
        ref={controlRef}
        className={`group relative flex flex-col items-stretch justify-center gap-[2px] flex-[0_0_auto] self-stretch w-full box-border min-h-20 px-[13px] py-[9px] border-2 rounded-[16px] bg-white cursor-pointer ${desktopSeam} ${mobileSwapClearance} ${openSeamClasses}`}
      >
        <span className={FLIGHT_SEARCH_LABEL} id={labelId}>
          {label}
        </span>
        <div className={FLIGHT_SEARCH_VALUE_ROW}>
          {showHint ? (
            <span className={FLIGHT_SEARCH_HINT} aria-hidden="true">
              {hint}
            </span>
          ) : null}
          <input
            id={`${name}-combobox`}
            type="text"
            className={`${FLIGHT_SEARCH_INPUT_STACKED} cursor-text ${
              showHint ? 'text-transparent caret-grey-900' : ''
            } ${String(value || '').trim() ? 'pr-8' : ''}`}
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
              className="fixed z-[70] flex flex-col p-0 overflow-hidden max-h-[min(420px,72vh)] box-border bg-white border border-grey-200 rounded-lg shadow-search max-md:w-full max-md:max-w-none"
              style={{
                top: popoverPlacement.top,
                left: popoverPlacement.left,
                width: popoverPlacement.width,
              }}
            >
              <div className="flex-shrink-0 px-3 py-[10px] bg-white border-b border-grey-200" />
              <div
                id={listId}
                className="flex-auto min-h-0 overflow-x-hidden overflow-y-auto p-2 flex flex-col gap-1"
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
              className="fixed z-[70] w-[max(100%,min(480px,calc(100vw-48px)))] max-h-[min(360px,70vh)] overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-1 bg-white border border-grey-200 rounded-lg shadow-search max-md:w-full max-md:max-w-none"
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

const HERO_HEADINGS: Record<SearchPillTabId, string> = {
  flights: 'Find the best flights anywhere',
  hotels: 'Find a place to stay anywhere',
  cars: 'Find the right car for your trip',
  packages: 'Find the best holiday packages',
}

export function HeroSearchGroup() {
  const pillsId = useId()
  const [tab, setTab] = useState<SearchPillTabId>('flights')

  return (
    <div className="box-border w-full p-6 text-[rgba(19,23,32,1)] bg-hero-search border border-[rgba(96,93,236,0.22)] rounded-[28px] flex flex-col items-start gap-8">
      <div className="flex flex-col items-start gap-8 w-full">
        <SearchPills selectedTab={tab} onSelectTab={setTab} id={pillsId} size="lg" />
        <h1
          id="hero-heading"
          className="m-0 w-full max-w-none font-extrabold leading-[1.05] text-left tracking-[-0.02em] bg-hero-title bg-clip-text text-transparent lg:text-[56px]"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)' }}
        >
          {HERO_HEADINGS[tab]}
        </h1>
      </div>
      <div role="tabpanel" aria-labelledby={`${pillsId}-${tab}`} className="w-full">
        {tab === 'flights' ? <FlightSearchBar /> : null}
        {tab === 'hotels' ? <HotelsSearchBar /> : null}
        {tab === 'cars' ? <CarsSearchBar /> : null}
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
    <span className="flex-shrink-0 w-[18px] h-[18px] text-inherit [&_svg]:block [&_svg]:w-full [&_svg]:h-full" aria-hidden>
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
    <span className="flex-shrink-0 w-[18px] h-[18px] text-inherit [&_svg]:block [&_svg]:w-full [&_svg]:h-full" aria-hidden>
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
    <span className="flex-shrink-0 w-[18px] h-[18px] text-inherit [&_svg]:block [&_svg]:w-full [&_svg]:h-full" aria-hidden>
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
      className={`flex-shrink-0 flex items-center justify-center w-[18px] h-[18px] text-current transition-transform duration-150 ease-in-out [&_svg]:block [&_svg]:w-full [&_svg]:h-full ${
        open ? 'rotate-180' : ''
      }`}
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

  const triggerBase =
    'box-border inline-flex items-center gap-2 w-auto min-h-10 m-0 font-sans text-[18px] font-semibold text-grey-900 text-left bg-transparent rounded-[12px] shadow-none cursor-pointer appearance-none focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2 hover:text-purple hover:border-purple'
  const triggerState = open
    ? 'text-purple border-2 border-purple px-[13px] py-[7px]'
    : 'border border-grey-200 px-[13px] py-2 pr-3'

  return (
    <div className={`relative w-auto max-w-none ${open ? 'z-[40]' : ''}`} ref={rootRef}>
      <input type="hidden" name="trip_type" value={value} />
      <button
        type="button"
        className={`${triggerBase} ${triggerState}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Trip type"
        onClick={() => setOpen(o => !o)}
      >
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold leading-[1.25] tracking-[0.02em]">
          {selected.label}
        </span>
        <TripTypeTriggerChevron open={open} />
      </button>
      {open && (
        <div
          id={listId}
          className="absolute top-[calc(100%+4px)] left-0 z-[30] w-[max(100%,min(280px,calc(100vw-48px)))] max-h-[min(360px,70vh)] overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-1 bg-white border border-grey-200 rounded-lg shadow-search max-md:w-full max-md:max-w-none"
          role="listbox"
          aria-label="Trip type"
        >
          {FLIGHT_TRIP_TYPES.map(opt => {
            const isSel = value === opt.value
            const rowBase =
              'flex flex-row items-center gap-[10px] w-full m-0 px-3 py-[10px] flex-shrink-0 border-none rounded-sm font-sans text-[16px] font-normal leading-[1.35] text-left cursor-pointer appearance-none focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2'
            const rowState = isSel
              ? 'bg-purple text-purple-on hover:not-disabled:bg-purple-hover hover:not-disabled:text-purple-on [&>.opt-title]:text-purple-on'
              : 'bg-transparent text-grey-900 hover:not-disabled:bg-[rgba(96,93,236,0.08)]'
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSel}
                className={`${rowBase} ${rowState}`}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
              >
                {opt.value === 'return' ? <TripTypeReturnIcon /> : null}
                {opt.value === 'one-way' ? <TripTypeOneWayIcon /> : null}
                {opt.value === 'multi-city' ? <TripTypeMultiCityIcon /> : null}
                <span className={`flex-1 min-w-0 opt-title ${OPTION_TITLE}`}>{opt.label}</span>
              </button>
            )
          })}
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
    <form className="w-full flex flex-col items-start gap-[14px]" onSubmit={onSubmit}>
      <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[10px] max-md:w-full max-md:flex-col max-md:items-stretch">
        <TripTypeSelect value={tripType} onChange={setTripType} />
      </div>
      <div className="relative z-[1] w-full min-w-0 flex flex-wrap items-start gap-4 box-border p-0 bg-transparent border-none rounded-none shadow-none overflow-visible md:gap-0 md:gap-y-3 max-md:flex-col max-md:flex-nowrap max-md:items-stretch max-md:h-auto max-md:max-h-none max-md:p-0 max-md:gap-3 max-md:bg-transparent max-md:border-none max-md:shadow-none">
        <div className="relative flex flex-col items-stretch gap-2 flex-1 min-w-0 md:flex-row md:items-start md:flex-wrap md:gap-0 md:gap-y-3 md:flex-[2_1_0] max-md:flex-[0_0_auto] max-md:w-full max-md:min-w-0">
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
            className="relative z-[40] flex items-center justify-center flex-shrink-0 self-center w-11 h-11 p-0 m-0 border-2 border-grey-200 rounded-full bg-white text-grey-600 cursor-pointer shadow-[0_1px_2px_rgba(28,5,77,0.06)] transition-[color,border-color,background] duration-150 hover:text-purple hover:border-purple focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2 md:self-start md:mt-[18px] md:-ml-[22px] md:-mr-[22px] md:shadow-none max-md:absolute max-md:top-1/2 max-md:right-[13px] max-md:-translate-y-1/2 max-md:m-0 max-md:self-auto max-md:z-[45]"
            aria-label="Swap departure and arrival airports"
            onClick={swapFromTo}
          >
            <span
              className={`flex w-[18px] h-[18px] transition-transform duration-[280ms] ease-in-out max-md:rotate-90 ${
                swapIconFlipped ? 'rotate-180 max-md:rotate-[270deg]' : 'rotate-0'
              }`}
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
        <DateRangeField oneWay={tripType === 'one-way'} />
        <PassengersField />
        <button
          type="submit"
          className="flex-[0_0_auto] self-start m-0 h-auto min-h-20 px-[22px] py-[10px] rounded-[16px] bg-purple text-grey-100 border-none inline-flex items-center justify-center gap-[10px] font-sans text-[18px] font-normal cursor-pointer no-underline transition-[background] duration-200 hover:bg-purple-hover hover:no-underline md:rounded-l-none md:ml-0 max-md:self-stretch max-md:w-auto max-md:mx-0 max-md:rounded-[16px] max-md:box-border max-md:min-h-[53px] max-md:h-[53px] max-md:max-h-[53px] max-md:px-[22px] max-md:py-0"
        >
          <span className="font-semibold">Search</span>
          <span className="flex w-6 h-6 flex-shrink-0 items-center justify-center" aria-hidden>
            <ArrowRightIcon className="block" />
          </span>
        </button>
        <div className="flex-[0_0_100%] order-[99] self-start w-full flex-shrink-0" role="group" aria-label="Flight search options">
          <label
            className="flex items-center gap-[10px] m-0 font-sans text-[15px] font-semibold leading-[1.25] tracking-[0.02em] text-grey-900 cursor-pointer select-none"
            htmlFor={directFlightsId}
          >
            <input
              id={directFlightsId}
              type="checkbox"
              name="direct_flights"
              checked={directFlights}
              onChange={e => setDirectFlights(e.target.checked)}
              className="flex-shrink-0 self-center w-[22px] h-[22px] m-0 box-border appearance-none border border-grey-200 rounded-[7px] bg-white cursor-pointer transition-[border-color,background-color,box-shadow] duration-150 hover:not-disabled:border-purple focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2 checked:border-purple checked:bg-purple bg-no-repeat bg-center"
              style={{
                backgroundImage: directFlights
                  ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M20 6L9 17l-5-5' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")"
                  : undefined,
                backgroundSize: '14px 14px',
              }}
            />
            <span className="inline-flex items-center min-h-0 leading-[1.25]">Direct flights</span>
          </label>
        </div>
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
    <div className="flex flex-nowrap items-center justify-between gap-4 w-full">
      <h2
        className="m-0 font-bold text-grey-600 leading-[1.2] max-w-[min(100%,42rem)]"
        style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}
        id={headingId}
      >
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
    <Link
      className="inline-flex items-center gap-1 text-grey-300 no-underline h-fit hover:text-purple hover:no-underline focus-visible:text-purple focus-visible:no-underline focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
      to={to}
    >
      <span className="h-fit flex-shrink-0 text-[24px] leading-[1.2]">All</span>
      <span className="flex w-6 h-6 items-center justify-center text-inherit">
        <ArrowRightIcon className="block flex-shrink-0" />
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
    <article className="group/card bg-white rounded-card shadow-card overflow-hidden flex flex-col min-h-0 transition-[box-shadow,transform] duration-[220ms] ease-in-out hover:shadow-card-hover hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className={`relative aspect-[4/3] max-h-[397px] overflow-hidden ${imageClass ?? ''}`}>
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-[350ms] ease-in-out group-hover/card:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
        />
      </div>
      <div className="px-6 pt-4 pb-5 flex flex-col gap-1">
        <div className="flex justify-between items-start gap-3">
          <p className="m-0 text-[18px] font-semibold text-grey-600 leading-[1.3]">
            {title}
            <span className="text-purple">{highlight}</span>
          </p>
          <p className="m-0 flex-shrink-0 inline-flex flex-wrap items-baseline justify-end gap-[0.35em] text-[18px] font-semibold text-grey-600 text-right min-w-max">
            <span className="text-[14px] font-medium text-grey-400">From</span>
            <span className="inline-flex items-baseline gap-[0.05em] font-semibold">
              {prefix ? (
                <>
                  <span className="text-[16px] font-medium text-grey-400">{prefix}</span>
                  <span className="text-[18px] font-semibold text-grey-600">{digits}</span>
                </>
              ) : (
                digits
              )}
            </span>
          </p>
        </div>
        <p className="m-0 text-[16px] text-grey-400 leading-[1.45]">{description}</p>
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
  // Mongolia image class retains its unique crop via a custom arbitrary class combo
  const mongoliaImgClasses =
    imageClass === 'deal-card__image--mongolia'
      ? '[&>img]:w-[187.86%] [&>img]:max-w-none [&>img]:object-left [&>img]:-ml-[18%]'
      : ''
  return (
    <article className="group/card bg-white rounded-card shadow-card overflow-hidden flex flex-col min-h-0 transition-[box-shadow,transform] duration-[220ms] ease-in-out hover:shadow-card-hover hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className={`relative aspect-[4/3] max-h-[397px] overflow-hidden ${mongoliaImgClasses}`}>
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-[350ms] ease-in-out group-hover/card:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
        />
      </div>
      <div className="px-6 pt-4 pb-5 flex flex-col gap-1">
        <p className="m-0 text-[18px] font-semibold text-grey-600 leading-[1.35]">{title}</p>
        <p className="m-0 text-[16px] text-grey-400 leading-[1.45]">{description}</p>
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
    <blockquote className="m-0 py-4 flex gap-4 items-start rounded-card">
      <img className="flex-shrink-0 w-12 h-12 rounded-full object-cover" src={avatar} alt="" width={48} height={48} />
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <cite className="not-italic text-[18px] font-semibold text-grey-600">{name}</cite>
          <p className="m-0 text-[18px] text-grey-600">{meta}</p>
          <StarRow filled={stars} />
        </div>
        <p className="m-0 text-[18px] leading-[1.45] text-grey-900">
          {children}{' '}
          <a className="text-purple no-underline font-normal hover:underline" href="#">
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
    <div className="w-full min-w-0">
      <h3 className="m-0 mb-2 p-1 text-[18px] font-bold text-grey-600 max-md:mb-[6px] max-md:p-0 max-md:text-[16px]">{title}</h3>
      <ul className="list-none m-0 p-0">
        {links.map(label => (
          <li key={label} className="p-1 max-md:p-0">
            <a
              href="#"
              className="text-[16px] text-grey-400 py-1 min-h-11 inline-flex items-center hover:text-purple hover:no-underline max-md:min-h-0 max-md:py-[5px] max-md:text-[15px]"
            >
              {label}
            </a>
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
    <footer className="bg-white border-t border-grey-200 p-0 mt-auto">
      <div className="max-w-[1440px] w-full mx-auto pt-20 pb-[120px] grid grid-cols-4 gap-x-8 gap-y-6 items-start max-[1320px]:pt-10 max-[1320px]:px-8 max-[1320px]:pb-[120px] max-[1320px]:grid-cols-2 max-md:pt-6 max-md:px-4 max-md:pb-12 max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-5">
        <div className="col-span-full w-full min-w-0">
          <a href="#" className="inline-block max-w-full">
            <img src={tripma.wordmark} alt="Tripma" width={131} height={37} className="w-[131px] max-w-full h-auto" />
          </a>
        </div>
        <FooterColumn title="About" links={about} />
        <FooterColumn title="Partner with us" links={partner} />
        <FooterColumn title="Support" links={support} />
        <div className="w-full min-w-0">
          <h3 className="m-0 mb-2 p-1 text-[18px] font-bold text-grey-600 max-md:mb-[6px] max-md:p-0 max-md:text-[16px]">Get the app</h3>
          <ul className="list-none m-0 p-0 mb-3 max-md:mb-2">
            {app.map(label => (
              <li key={label} className="p-1 max-md:p-0">
                <a
                  href="#"
                  className="text-[16px] text-grey-400 py-1 min-h-11 inline-flex items-center hover:text-purple hover:no-underline max-md:min-h-0 max-md:py-[5px] max-md:text-[15px]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-start gap-3 max-md:flex-row max-md:flex-wrap max-md:items-center max-md:gap-[10px]">
            <a
              href="https://apps.apple.com/"
              className="block flex-shrink-0 w-fit max-w-full leading-none"
              aria-label="Download on the App Store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tripma.appStoreBadge} alt="" decoding="async" className="block w-auto h-10 max-w-none object-contain" />
            </a>
            <a
              href="https://play.google.com/store"
              className="block flex-shrink-0 w-fit max-w-full leading-none"
              aria-label="Get it on Google Play"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tripma.googlePlay} alt="" decoding="async" className="block w-auto h-10 max-w-none object-contain" />
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
      <section
        className="relative z-[2] min-h-[480px] flex items-center justify-center px-6 py-12 overflow-visible lg:min-h-[520px] lg:py-14 max-md:p-2 max-md:pb-12 after:content-[''] after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.12)_45%,rgba(255,255,255,0.35)_100%)] after:pointer-events-none"
        aria-labelledby="hero-heading"
      >
        <img
          className="absolute inset-0 z-0 w-full h-full object-cover object-center"
          src={tripma.heroMap}
          alt=""
        />
        <div className="relative z-[2] w-full max-w-[1440px] flex flex-col items-start max-md:mx-auto">
          <HeroSearchGroup />
        </div>
      </section>

      <main className="relative z-0 flex-1">
        <div className="max-w-[1440px] mx-auto px-4 pb-40 max-md:px-3">
          <section className="pt-10 pb-10 flex flex-col gap-6 max-md:pt-0" aria-labelledby="deals-heading">
            <SectionTitle aside={<SeeAllLink />} headingId="deals-heading">
              Find your next adventure with these <span className="text-purple">flight deals</span>
            </SectionTitle>
            <div className="grid gap-10 w-full grid-cols-3 cursor-pointer max-lg:grid-cols-2 max-md:grid-cols-1">
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

          <section className="pt-10 pb-10 flex flex-col gap-6 max-md:pt-4" aria-labelledby="stays-heading">
            <SectionTitle aside={<SeeAllLink />} headingId="stays-heading">
              Explore unique <span className="text-purple">places to stay</span>
            </SectionTitle>
            <div className="grid gap-10 w-full grid-cols-3 cursor-pointer max-lg:grid-cols-2 max-md:grid-cols-1">
              <StayCard
                image={tripma.stayMaldives}
                title={
                  <>
                    Stay among the atolls in <span className="text-purple">Maldives</span>
                  </>
                }
                description="From the 2nd century AD, the islands were known as the 'Money Isles' due to the abundance of cowry shells, a currency of the early ages."
              />
              <StayCard
                image={tripma.stayMorocco}
                title={
                  <>
                    Experience the Ourika Valley in <span className="text-purple">Morocco</span>
                  </>
                }
                description="Morocco’s Hispano-Moorish architecture blends influences from Berber culture, Spain, and contemporary artistic currents in the Middle East."
              />
              <StayCard
                image={tripma.stayMongolia}
                title={
                  <>
                    Live traditionally in <span className="text-purple">Mongolia</span>
                  </>
                }
                description="Traditional Mongolian yurts consists of an angled latticework of wood or bamboo for walls, ribs, and a wheel."
                imageClass="deal-card__image--mongolia"
              />
            </div>
            <div className="flex justify-center pt-6">
              <Link
                className="inline-flex items-center justify-center min-h-12 px-5 py-6 font-sans text-[18px] font-normal border-2 border-purple rounded-[16px] cursor-pointer no-underline bg-transparent text-purple gap-[10px] transition-[background,color,border-color] duration-200 hover:bg-[color-mix(in_srgb,var(--color-purple)_12%,transparent)] hover:no-underline focus-visible:outline-[3px] focus-visible:outline-[color-mix(in_srgb,var(--color-purple)_35%,transparent)] focus-visible:outline-offset-2"
                to="/stays"
              >
                <span className="font-semibold">Explore more stays</span>
                <span className="flex w-6 h-6 flex-shrink-0 items-center justify-center" aria-hidden>
                  <ArrowRightIcon className="block flex-shrink-0" />
                </span>
              </Link>
            </div>
          </section>

          <section className="pt-20 pb-6 flex flex-col gap-6" aria-labelledby="testimonials-heading">
            <h2
              id="testimonials-heading"
              className="m-0 mb-6 w-full font-bold text-grey-600 leading-[1.2] text-left max-w-[min(100%,42rem)]"
              style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}
            >
              What <span className="text-purple">Tripma</span> users are saying
            </h2>
            <div className="grid grid-cols-3 gap-10 items-start max-lg:grid-cols-1 max-lg:gap-8">
              <Testimonial
                avatar={tripma.avatar1}
                name="Yifei Chen"
                stars={5}
                meta={
                  <>
                    Seoul, South Korea <span className="text-grey-300">|</span> April 2026
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
                    Honolulu, Hawaii <span className="text-grey-300">|</span> February 2026
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
                    Berlin, Germany <span className="text-grey-300">|</span> April 2026
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
    <div className="min-h-[100svh] flex flex-col bg-white">
      <SiteHeader />
      <HomeContent />
      <SiteFooter />
    </div>
  )
}
