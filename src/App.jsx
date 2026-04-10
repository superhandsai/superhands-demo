import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { tripma } from './assets/tripma/urls.js'
import { DateRangeField } from './DateRangeField.jsx'
import { PassengersField } from './PassengersField.jsx'
import {
  buildAirportLocationLabel,
  buildAirportOptionSubtitle,
  buildAirportOptionTitle,
  getAirportApi,
} from './lib/airportSearch.js'

function Icon32({ src, alt = '' }) {
  return (
    <span className="icon-32">
      <img src={src} alt={alt} width={24} height={24} />
    </span>
  )
}

function CalendarIcon() {
  return (
    <span className="icon-32 icon-32--calendar">
      <img className="icon-32__cal" src={tripma.calendar} alt="" width={18} height={21} />
      <img className="icon-32__dot icon-32__dot--1" src={tripma.calDot1} alt="" width={3} height={3} />
      <img className="icon-32__dot icon-32__dot--2" src={tripma.calDot2} alt="" width={3} height={3} />
    </span>
  )
}

function PersonIcon() {
  return (
    <span className="icon-32 icon-32--person">
      <img className="icon-32__head" src={tripma.personHead} alt="" width={8} height={8} />
      <img className="icon-32__body" src={tripma.personBody} alt="" width={16} height={8} />
    </span>
  )
}

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
              <UkFlagIcon />
              United Kingdom
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
  placeholder,
  iconSrc,
  value,
  onChange,
  menuOpen,
  onOpenMenu,
  onCloseMenu,
  excludeCodes = [],
}) {
  const rootRef = useRef(null)
  const listId = useId()
  const [filter, setFilter] = useState('')
  const [airportApi, setAirportApi] = useState(null)

  const open = menuOpen === fieldKey

  useEffect(() => {
    getAirportApi().then(setAirportApi)
  }, [])

  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) onCloseMenu()
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
    return airportApi.searchAirports(filter, { limit: 80, excludeCodes })
  }, [airportApi, filter, excludeCodes])

  const closedDisplay =
    value && airportApi ? airportApi.formatAirportFieldValue(value) : value || ''
  const inputDisplay = open ? filter : closedDisplay
  const showPlaceholder = !inputDisplay

  function pick(code) {
    onChange(code)
    onCloseMenu()
  }

  return (
    <div ref={rootRef} className={`flight-search__airport ${open ? 'is-active' : ''}`}>
      <input type="hidden" name={name} value={value} />
      <div className={`flight-search__control ${open ? 'is-open' : ''}`}>
        <Icon32 src={iconSrc} alt="" />
        {showPlaceholder && <span className="flight-search__placeholder">{placeholder}</span>}
        <input
          id={`${name}-combobox`}
          type="text"
          className="flight-search__input"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={placeholder}
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
      </div>
      {open && (
        <div id={listId} className="flight-search__popover" role="listbox" aria-label={placeholder}>
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
        </div>
      )}
    </div>
  )
}

const HERO_SEARCH_TABS = [
  { id: 'flights', label: 'Flights' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'cars', label: 'Cars' },
  { id: 'packages', label: 'Packages' },
]

function HeroSearchGroup() {
  const [searchTab, setSearchTab] = useState('flights')
  const pillsId = useId()

  return (
    <div className="hero__search-block">
      <div className="hero__search-block__lead">
        <h1 id="hero-heading" className="hero__title">
          Book your next trip
        </h1>
        <div
          id={pillsId}
          className="search-pills"
          role="tablist"
          aria-label="What are you booking?"
        >
          {HERO_SEARCH_TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${pillsId}-${tab.id}`}
              aria-selected={searchTab === tab.id}
              tabIndex={searchTab === tab.id ? 0 : -1}
              className={`search-pills__pill ${searchTab === tab.id ? 'is-selected' : ''}`}
              onClick={() => setSearchTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div
        role="tabpanel"
        aria-labelledby={`${pillsId}-${searchTab}`}
        className="hero__search-panel"
      >
        <FlightSearchBar />
      </div>
    </div>
  )
}

function FlightSearchBar() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [airportMenu, setAirportMenu] = useState(null)

  function onSubmit(e) {
    e.preventDefault()
  }

  return (
    <form className="flight-search" onSubmit={onSubmit}>
      <AirportField
        fieldKey="from"
        name="from"
        placeholder="From where?"
        iconSrc={tripma.departure}
        value={from}
        onChange={setFrom}
        menuOpen={airportMenu}
        onOpenMenu={setAirportMenu}
        onCloseMenu={() => setAirportMenu(null)}
        excludeCodes={to ? [to] : []}
      />
      <span className="flight-search__divider" aria-hidden />
      <AirportField
        fieldKey="to"
        name="to"
        placeholder="Where to?"
        iconSrc={tripma.arrival}
        value={to}
        onChange={setTo}
        menuOpen={airportMenu}
        onOpenMenu={setAirportMenu}
        onCloseMenu={() => setAirportMenu(null)}
        excludeCodes={from ? [from] : []}
      />
      <span className="flight-search__divider" aria-hidden />
      <DateRangeField icon={<CalendarIcon />} placeholder="Depart - Return" />
      <span className="flight-search__divider" aria-hidden />
      <PassengersField icon={<PersonIcon />} />
      <button type="submit" className="btn btn--search">
        Search
      </button>
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

function SeeAllLink() {
  return (
    <a className="see-all" href="#">
      <span>All</span>
      <span className="see-all__icon">
        <img src={tripma.arrowRight} alt="" width={20} height={15} />
      </span>
    </a>
  )
}

function DealCard({ image, title, highlight, price, description, imageClass }) {
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
          <p className="deal-card__price">{price}</p>
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
        <a href="#" className="site-footer__logo">
          <img src={tripma.wordmark} alt="Tripma" width={131} height={37} />
        </a>
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
            <a href="#" className="badge-app-store" aria-label="Download on the App Store">
              <span className="badge-app-store__apple">
                <img src={tripma.appleIcon} alt="" width={30} height={30} />
              </span>
              <span className="badge-app-store__text">
                <img src={tripma.downloadOnThe} alt="" className="badge-app-store__line1" />
                <img src={tripma.appStore} alt="" className="badge-app-store__line2" />
              </span>
            </a>
            <a href="#" className="badge-google-play" aria-label="Get it on Google Play">
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
                price="£2"
                description="China’s most international city"
              />
              <DealCard
                image={tripma.dealSydney}
                title="Sydney Opera House,"
                highlight=" Sydney"
                price="£2"
                description="Take a stroll along the famous harbor"
              />
              <DealCard
                image={tripma.dealKyoto}
                title="Kōdaiji Temple,"
                highlight=" Kyoto"
                price="£2"
                description="Step back in time in the Gion district"
              />
            </div>
          </section>

          <section className="band" aria-labelledby="stays-heading">
            <SectionTitle aside={<SeeAllLink />} headingId="stays-heading">
              Explore unique <span className="text-gradient-teal">places to stay</span>
            </SectionTitle>
            <div className="card-grid card-grid--stays">
              <StayCard
                image={tripma.stayMaldives}
                title={
                  <>
                    Stay among the atolls in <span className="text-gradient-teal">Maldives</span>
                  </>
                }
                description="From the 2nd century AD, the islands were known as the 'Money Isles' due to the abundance of cowry shells, a currency of the early ages."
              />
              <StayCard
                image={tripma.stayMorocco}
                title={
                  <>
                    Experience the Ourika Valley in <span className="text-gradient-teal">Morocco</span>
                  </>
                }
                description="Morocco’s Hispano-Moorish architecture blends influences from Berber culture, Spain, and contemporary artistic currents in the Middle East."
              />
              <StayCard
                image={tripma.stayMongolia}
                title={
                  <>
                    Live traditionally in <span className="text-gradient-teal">Mongolia</span>
                  </>
                }
                description="Traditional Mongolian yurts consists of an angled latticework of wood or bamboo for walls, ribs, and a wheel."
                imageClass="deal-card__image--mongolia"
              />
            </div>
            <div className="band__cta">
              <a className="btn btn--primary" href="#">
                Explore more stays
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
