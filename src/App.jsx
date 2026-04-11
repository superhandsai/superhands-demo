import { createPortal } from 'react-dom'
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { tripma } from './assets/tripma/urls.js'
import { DateRangeField } from './DateRangeField.jsx'
import { FieldClearButton } from './FieldClearButton.jsx'
import { PassengersField } from './PassengersField.jsx'
import {
  buildAirportLocationLabel,
  buildAirportOptionSubtitle,
  buildAirportOptionTitle,
  getAirportApi,
} from './lib/airportSearch.js'

function StarRow({ filled, total = 5 }) {
  return (
    <div className="star-row" role="img" aria-label={`${filled} out of ${total} stars`}>
      {Array.from({ length: total }, (_, i) => (
        <img
          key={i}
          src={i < filled ? tripma.starFilled : tripma.starEmpty}
          alt=""
          width={24}
          height={24}
        />
      ))}
    </div>
  )
}

function HeartIcon() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke="currentColor"
        strokeWidth="2"
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

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const navId = useId()

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#" className="site-header__logo">
          <img src={tripma.wordmark} alt="Tripma" width={105} height={30} />
        </a>
        <button
          type="button"
          className="site-header__menu-btn"
          aria-expanded={open}
          aria-controls={navId}
          onClick={() => setOpen(v => !v)}
        >
          <span className="visually-hidden">Menu</span>
          <span className="site-header__burger" aria-hidden />
        </button>
        <nav id={navId} className={`site-header__nav ${open ? 'is-open' : ''}`}>
          <a className="site-header__link" href="#">
            Help
          </a>
          <div
            className="site-header__locale"
            role="group"
            aria-label="Language, location, and currency"
          >
            <a className="site-header__link" href="#">
              English (UK)
            </a>
            <a className="site-header__link" href="#">
              <span className="site-header__locale-pair">
                <UkFlagIcon /><span className="site-header__locale-text">United Kingdom</span>
              </span>
            </a>
            <a className="site-header__link" href="#">
              £ GBP
            </a>
          </div>
          <a className="site-header__favourites" href="#" aria-label="Favourites">
            <HeartIcon />
          </a>
          <a className="btn btn--header" href="#">
            Log in
          </a>
        </nav>
      </div>
    </header>
  )
}

function AirportField({
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
  nearbyAirportsChecked = false,
  onNearbyAirportsChange,
  directFlightsChecked = false,
  onDirectFlightsChange,
  showToNearbyAirportsOption = false,
  toNearbyAirportsChecked = false,
  onToNearbyAirportsChange,
}) {
  const rootRef = useRef(null)
  const controlRef = useRef(null)
  const popoverRef = useRef(null)
  const listId = useId()
  const labelId = useId()
  const nearbyId = useId()
  const directId = useId()
  const toNearbyId = useId()
  const [filter, setFilter] = useState('')
  const [airportApi, setAirportApi] = useState(null)
  const [popoverPlacement, setPopoverPlacement] = useState(null)

  const open = menuOpen === fieldKey

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
    function onDocMouseDown(e) {
      if (
        (rootRef.current && rootRef.current.contains(e.target)) ||
        (popoverRef.current && popoverRef.current.contains(e.target))
      ) {
        return
      }
      onCloseMenu()
    }
    function onKey(e) {
      if (e.key === 'Escape') onCloseMenu()
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onCloseMenu])

  const filtered = useMemo(() => {
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

  function pick(code) {
    onChange(code)
    onCloseMenu()
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
      {showFlightSearchOptions &&
      onNearbyAirportsChange &&
      onDirectFlightsChange ? (
        <div className="flight-search__airport-options" role="group" aria-label="Flight search options">
          <label className="flight-search__airport-option" htmlFor={nearbyId}>
            <input
              id={nearbyId}
              type="checkbox"
              name="nearby_airports"
              checked={nearbyAirportsChecked}
              onChange={e => onNearbyAirportsChange(e.target.checked)}
            />
            <span>Add nearby airports</span>
          </label>
          <label className="flight-search__airport-option" htmlFor={directId}>
            <input
              id={directId}
              type="checkbox"
              name="direct_flights"
              checked={directFlightsChecked}
              onChange={e => onDirectFlightsChange(e.target.checked)}
            />
            <span>Direct flights</span>
          </label>
        </div>
      ) : null}
      {showToNearbyAirportsOption && onToNearbyAirportsChange ? (
        <div className="flight-search__airport-options" role="group" aria-label="Arrival airport options">
          <label className="flight-search__airport-option" htmlFor={toNearbyId}>
            <input
              id={toNearbyId}
              type="checkbox"
              name="to_nearby_airports"
              checked={toNearbyAirportsChecked}
              onChange={e => onToNearbyAirportsChange(e.target.checked)}
            />
            <span>Add nearby airports</span>
          </label>
        </div>
      ) : null}
      {open &&
        popoverPlacement &&
        createPortal(
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
            {!airportApi ? (
              <p className="flight-search__empty">Loading airports…</p>
            ) : filtered.length === 0 ? (
              <p className="flight-search__empty">No airports match</p>
            ) : (
              filtered.map(a => {
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
            )}
          </div>,
          document.body
        )}
    </div>
  )
}

function FlightsTabIcon() {
  return (
    <span className="search-pills__pill-icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17.7448 2.81298C18.7095 1.8165 20.3036 1.80361 21.2843 2.78436C22.2382 3.73823 22.2559 5.27921 21.3243 6.25481L18.5456 9.16457C18.3278 9.39265 18.219 9.50668 18.1518 9.64024C18.0924 9.75847 18.0571 9.88732 18.0478 10.0193C18.0374 10.1684 18.0728 10.3221 18.1438 10.6293L19.8717 18.1169C19.9444 18.4323 19.9808 18.59 19.9691 18.7426C19.9587 18.8776 19.921 19.0091 19.8582 19.1291C19.7873 19.2647 19.6729 19.3792 19.444 19.608L19.0732 19.9788C18.4671 20.585 18.164 20.888 17.8538 20.9429C17.583 20.9908 17.3043 20.925 17.0835 20.761C16.8306 20.5733 16.695 20.1666 16.424 19.3534L14.4142 13.3241L11.0689 16.6695C10.8692 16.8691 10.7694 16.969 10.7026 17.0866C10.6434 17.1907 10.6034 17.3047 10.5846 17.423C10.5633 17.5565 10.5789 17.6968 10.61 17.9775L10.7937 19.6309C10.8249 19.9116 10.8405 20.0519 10.8192 20.1854C10.8004 20.3037 10.7604 20.4177 10.7012 20.5219C10.6344 20.6394 10.5346 20.7393 10.3349 20.939L10.1374 21.1365C9.66434 21.6095 9.42781 21.8461 9.16496 21.9146C8.93442 21.9746 8.68999 21.9504 8.47571 21.8463C8.2314 21.7276 8.04585 21.4493 7.67475 20.8926L6.10643 18.5401C6.04013 18.4407 6.00698 18.391 5.96849 18.3459C5.9343 18.3058 5.89701 18.2685 5.85694 18.2343C5.81184 18.1958 5.76212 18.1627 5.66267 18.0964L3.31018 16.5281C2.75354 16.157 2.47521 15.9714 2.35649 15.7271C2.25236 15.5128 2.22816 15.2684 2.28824 15.0378C2.35674 14.775 2.59327 14.5385 3.06633 14.0654L3.26384 13.8679C3.46352 13.6682 3.56337 13.5684 3.68095 13.5016C3.78511 13.4424 3.89906 13.4024 4.01736 13.3836C4.15089 13.3623 4.29123 13.3779 4.5719 13.4091L6.22529 13.5928C6.50596 13.6239 6.6463 13.6395 6.77983 13.6182C6.89813 13.5994 7.01208 13.5594 7.11624 13.5002C7.23382 13.4334 7.33366 13.3336 7.53335 13.1339L10.8787 9.7886L4.84939 7.77884C4.03616 7.50776 3.62955 7.37222 3.44176 7.11932C3.27777 6.89848 3.212 6.61984 3.2599 6.34898C3.31477 6.03879 3.61784 5.73572 4.22399 5.12957L4.59476 4.7588C4.82365 4.52991 4.9381 4.41546 5.07369 4.34457C5.1937 4.28183 5.3252 4.24411 5.46023 4.23371C5.61278 4.22197 5.77049 4.25836 6.0859 4.33115L13.545 6.05249C13.855 6.12401 14.01 6.15978 14.1596 6.14914C14.3041 6.13886 14.4446 6.09733 14.5714 6.02742C14.7028 5.95501 14.8134 5.84074 15.0347 5.6122L17.7448 2.81298Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function HotelsTabIcon() {
  return (
    <span className="search-pills__pill-icon" aria-hidden>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 4v16" />
        <path d="M2 8h18a2 2 0 0 1 2 2v8" />
        <path d="M2 17h20" />
        <path d="M6 8v9" />
      </svg>
    </span>
  )
}

function CarsTabIcon() {
  return (
    <span className="search-pills__pill-icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 13H8M2 9L4 10L5.27064 6.18807C5.53292 5.40125 5.66405 5.00784 5.90729 4.71698C6.12208 4.46013 6.39792 4.26132 6.70951 4.13878C7.06236 4 7.47705 4 8.30643 4H15.6936C16.523 4 16.9376 4 17.2905 4.13878C17.6021 4.26132 17.8779 4.46013 18.0927 4.71698C18.3359 5.00784 18.4671 5.40125 18.7294 6.18807L20 10L22 9M16 13H19M6.8 10H17.2C18.8802 10 19.7202 10 20.362 10.327C20.9265 10.6146 21.3854 11.0735 21.673 11.638C22 12.2798 22 13.1198 22 14.8V17.5C22 17.9647 22 18.197 21.9616 18.3902C21.8038 19.1836 21.1836 19.8038 20.3902 19.9616C20.197 20 19.9647 20 19.5 20H19C17.8954 20 17 19.1046 17 18C17 17.7239 16.7761 17.5 16.5 17.5H7.5C7.22386 17.5 7 17.7239 7 18C7 19.1046 6.10457 20 5 20H4.5C4.03534 20 3.80302 20 3.60982 19.9616C2.81644 19.8038 2.19624 19.1836 2.03843 18.3902C2 18.197 2 17.9647 2 17.5V14.8C2 13.1198 2 12.2798 2.32698 11.638C2.6146 11.0735 3.07354 10.6146 3.63803 10.327C4.27976 10 5.11984 10 6.8 10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function PackagesTabIcon() {
  return (
    <span className="search-pills__pill-icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 7C16 6.07003 16 5.60504 15.8978 5.22354C15.6204 4.18827 14.8117 3.37962 13.7765 3.10222C13.395 3 12.93 3 12 3C11.07 3 10.605 3 10.2235 3.10222C9.18827 3.37962 8.37962 4.18827 8.10222 5.22354C8 5.60504 8 6.07003 8 7M12.8 17.5H17.7C17.98 17.5 18.12 17.5 18.227 17.4455C18.3211 17.3976 18.3976 17.3211 18.4455 17.227C18.5 17.12 18.5 16.98 18.5 16.7V14.3C18.5 14.02 18.5 13.88 18.4455 13.773C18.3976 13.6789 18.3211 13.6024 18.227 13.5545C18.12 13.5 17.98 13.5 17.7 13.5H12.8C12.52 13.5 12.38 13.5 12.273 13.5545C12.1789 13.6024 12.1024 13.6789 12.0545 13.773C12 13.88 12 14.02 12 14.3V16.7C12 16.98 12 17.12 12.0545 17.227C12.1024 17.3211 12.1789 17.3976 12.273 17.4455C12.38 17.5 12.52 17.5 12.8 17.5ZM6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V11.8C22 10.1198 22 9.27976 21.673 8.63803C21.3854 8.07354 20.9265 7.6146 20.362 7.32698C19.7202 7 18.8802 7 17.2 7H6.8C5.11984 7 4.27976 7 3.63803 7.32698C3.07354 7.6146 2.6146 8.07354 2.32698 8.63803C2 9.27976 2 10.1198 2 11.8V16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

const HERO_SEARCH_TABS = [
  { id: 'flights', label: 'Flights' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'cars', label: 'Cars' },
  { id: 'packages', label: 'Packages' },
]

function HeroSearchGroup() {
  const pillsId = useId()
  const selectedTab = 'flights'

  return (
    <div className="hero__search-block">
      <div className="hero__search-block__lead">
        <div
          id={pillsId}
          className="search-pills"
          role="group"
          aria-label="What are you booking?"
        >
          {HERO_SEARCH_TABS.map(tab => (
            <span
              key={tab.id}
              id={`${pillsId}-${tab.id}`}
              className={`search-pills__pill ${selectedTab === tab.id ? 'is-selected' : ''}`}
              aria-current={selectedTab === tab.id ? 'page' : undefined}
            >
              {tab.id === 'flights' ? <FlightsTabIcon /> : null}
              {tab.id === 'hotels' ? <HotelsTabIcon /> : null}
              {tab.id === 'cars' ? <CarsTabIcon /> : null}
              {tab.id === 'packages' ? <PackagesTabIcon /> : null}
              {tab.label}
            </span>
          ))}
        </div>
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

const FLIGHT_TRIP_TYPES = [
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

function TripTypeTriggerChevron({ open }) {
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

function TripTypeSelect({ value, onChange }) {
  const rootRef = useRef(null)
  const listId = useId()
  const [open, setOpen] = useState(false)
  const selected = FLIGHT_TRIP_TYPES.find(t => t.value === value) ?? FLIGHT_TRIP_TYPES[0]

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

function FlightSearchBar() {
  const [tripType, setTripType] = useState('return')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [airportMenu, setAirportMenu] = useState(null)
  const [nearbyAirports, setNearbyAirports] = useState(false)
  const [toNearbyAirports, setToNearbyAirports] = useState(false)
  const [directFlights, setDirectFlights] = useState(false)
  const [swapIconFlipped, setSwapIconFlipped] = useState(false)

  function onSubmit(e) {
    e.preventDefault()
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
      </div>
      <div className="flight-search">
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
            nearbyAirportsChecked={nearbyAirports}
            onNearbyAirportsChange={setNearbyAirports}
            directFlightsChecked={directFlights}
            onDirectFlightsChange={setDirectFlights}
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
        <DateRangeField oneWay={tripType === 'one-way'} />
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

function SectionTitle({ children, aside, headingId }) {
  return (
    <div className="section-title">
      <h2 className="section-title__heading" id={headingId}>
        {children}
      </h2>
      {aside}
    </div>
  )
}

function ArrowRightIcon({ className }) {
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

function SeeAllLink() {
  return (
    <a className="see-all" href="#">
      <span className="see-all__label">All</span>
      <span className="see-all__icon">
        <ArrowRightIcon className="see-all__arrow" />
      </span>
    </a>
  )
}

function splitDealPrice(price) {
  const m = String(price).match(/^(\D+)(\d[\d,]*)$/)
  if (m) return { prefix: m[1], digits: m[2] }
  return { prefix: '', digits: String(price) }
}

function DealCard({ image, title, highlight, price, description, imageClass }) {
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

function StayCard({ image, title, description, imageClass }) {
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

function Testimonial({ avatar, name, meta, stars, children }) {
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

function FooterColumn({ title, links }) {
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

function SiteFooter() {
  const about = [
    'About Tripma',
    'How it works',
    'Careers',
    'Press',
    'Blog',
    'Forum',
  ]
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

export default function App() {
  return (
    <div className="tripma">
      <SiteHeader />

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
              <a className="btn btn--primary" href="#">
                <span className="btn--primary__text">Explore more stays</span>
                <span className="btn--primary__icon" aria-hidden>
                  <ArrowRightIcon className="btn--primary__arrow" />
                </span>
              </a>
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
                    Seoul, South Korea <span className="text-muted-sep">|</span> April 2019
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
                    Honolulu, Hawaii <span className="text-muted-sep">|</span> February 2017
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
                    Berlin, Germany <span className="text-muted-sep">|</span> April 2019
                  </>
                }
              >
                When I was looking to book my flight to Berlin from LAX, Tripma had the best browsing experiece so I figured I’d give it a try. It was my first time using Tripma, but I’d definitely recommend it to a friend and use it for
              </Testimonial>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
