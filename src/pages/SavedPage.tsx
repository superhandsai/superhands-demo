import { Link } from 'react-router-dom'
import { PageShell } from './PageShell'
import { savedStore, toggleSavedFlight, toggleSavedStay } from '../lib/savedStore'
import { useStore } from '../lib/useStore'
import { formatIsoDate } from '../data/flights'
import { pushToast } from '../lib/toastStore'

const btnPrimaryCls =
  'font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover'
const btnSecondaryCls =
  'font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on'
const linkMoreCls =
  'text-purple no-underline font-normal hover:underline bg-transparent border-0 p-0 cursor-pointer self-start mt-1 text-[13px]'

export function SavedPage() {
  const { flights, stays } = useStore(savedStore)

  if (flights.length === 0 && stays.length === 0) {
    return (
      <PageShell
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Saved' }]}
        title="Saved"
        subtitle="Tap the heart on any flight or stay to save it here."
      >
        <div className="bg-white p-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
          <p>Nothing saved yet.</p>
          <Link to="/" className={btnPrimaryCls}>
            Start exploring
          </Link>
        </div>
      </PageShell>
    )
  }

  const lowestFlight = flights.length > 0 ? Math.min(...flights.map(f => f.priceGBP)) : null
  const lowestStay = stays.length > 0 ? Math.min(...stays.map(s => s.nightlyGBP)) : null

  return (
    <PageShell
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Saved' }]}
      title="Saved"
      subtitle={`${flights.length} flight${flights.length === 1 ? '' : 's'} · ${stays.length} stay${stays.length === 1 ? '' : 's'}`}
    >
      <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-3 mb-4 max-[720px]:grid-cols-1">
        <div className="bg-white rounded-card p-4 shadow-card">
          <span className="block text-[11px] uppercase tracking-[0.08em] text-grey-600 mb-1">
            Saved items
          </span>
          <strong className="text-xl text-grey-900">{flights.length + stays.length}</strong>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card">
          <span className="block text-[11px] uppercase tracking-[0.08em] text-grey-600 mb-1">
            Lowest flight
          </span>
          <strong className="text-xl text-grey-900">
            {lowestFlight === null ? 'None' : `£${lowestFlight}`}
          </strong>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card">
          <span className="block text-[11px] uppercase tracking-[0.08em] text-grey-600 mb-1">
            Lowest stay
          </span>
          <strong className="text-xl text-grey-900">
            {lowestStay === null ? 'None' : `£${lowestStay}/night`}
          </strong>
        </div>
      </div>
      {flights.length > 0 ? (
        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="mt-0 mb-2 text-xl text-grey-900">Flights</h2>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {flights.map(f => (
              <li
                key={f.id}
                className="flex flex-col py-2.5 border-b border-grey-200"
              >
                <div>
                  <strong className="text-grey-900">
                    {f.from} → {f.to}
                  </strong>
                  <span className="text-grey-600 text-[13px]">
                    {formatIsoDate(f.depart)}
                    {f.returnDate ? ` – ${formatIsoDate(f.returnDate)}` : ''} · {f.carrier} · £
                    {f.priceGBP}
                  </span>
                </div>
                <Link
                  className={btnSecondaryCls}
                  to={`/flights?from=${f.from}&to=${f.to}&depart=${f.depart}${f.returnDate ? `&return=${f.returnDate}` : ''}&adults=1&trip=${f.returnDate ? 'return' : 'oneway'}`}
                >
                  View
                </Link>
                <button
                  type="button"
                  className={linkMoreCls}
                  onClick={() => {
                    toggleSavedFlight(f)
                    pushToast({ tone: 'info', title: 'Removed from saved', body: `${f.from} → ${f.to}` })
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {stays.length > 0 ? (
        <div className="bg-white rounded-card p-6 shadow-card mb-4">
          <h2 className="mt-0 mb-2 text-xl text-grey-900">Stays</h2>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {stays.map(s => (
              <li
                key={s.id}
                className="flex flex-col py-2.5 border-b border-grey-200"
              >
                <div>
                  <strong className="text-grey-900">{s.name}</strong>
                  <span className="text-grey-600 text-[13px]">
                    {s.location} · £{s.nightlyGBP}/night
                  </span>
                </div>
                <Link className={btnSecondaryCls} to={`/stays/${s.id}`}>
                  View
                </Link>
                <button
                  type="button"
                  className={linkMoreCls}
                  onClick={() => {
                    toggleSavedStay(s)
                    pushToast({ tone: 'info', title: 'Removed from saved', body: s.name })
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </PageShell>
  )
}
