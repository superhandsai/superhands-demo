import { Link, useParams } from 'react-router-dom'
import { PageShell } from './PageShell'
import { STAYS } from '../data/stays'
import { SaveButton } from '../components/SaveButton'

export function StayDetailPage() {
  const { id = '' } = useParams()
  const stay = STAYS.find(s => s.id === id)

  if (!stay) {
    return (
      <PageShell
        title="Stay not found"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Stays', to: '/stays' }]}
      >
        <div className="bg-white p-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4">
          <p>That stay is no longer available.</p>
          <Link
            className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
            to="/stays"
          >
            Browse stays
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      title={stay.name}
      subtitle={`${stay.location}, ${stay.country} · ★ ${stay.rating} (${stay.reviewCount} reviews)`}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Stays', to: '/stays' },
        { label: stay.name },
      ]}
      actions={
        <SaveButton
          kind="stay"
          stay={{
            id: stay.id,
            name: stay.name,
            location: `${stay.location}, ${stay.country}`,
            nightlyGBP: stay.nightlyGBP,
          }}
        />
      }
    >
      <div>
        <img
          className="w-full h-80 object-cover rounded-card mb-6"
          src={stay.image}
          alt=""
        />
      </div>
      <div className="grid grid-cols-[1fr_340px] gap-6 items-start max-[900px]:grid-cols-1">
        <section>
          <div className="bg-white rounded-card p-6 shadow-card mb-4">
            <h2 className="mt-0 mb-2 text-xl text-grey-900">About this stay</h2>
            <p>{stay.description}</p>
          </div>
          <div className="bg-white rounded-card p-6 shadow-card mb-4">
            <h2 className="mt-0 mb-2 text-xl text-grey-900">Amenities</h2>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-y-2 gap-x-4 list-none p-0 m-0">
              {stay.amenities.map(a => (
                <li
                  key={a}
                  className="pl-5 relative text-grey-900 before:content-['✓'] before:text-purple before:absolute before:left-0 before:font-bold"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-card p-6 shadow-card mb-4">
            <h2 className="mt-0 mb-2 text-xl text-grey-900">Location</h2>
            <p>
              {stay.location}, {stay.country}
            </p>
            <p className="mt-0 mb-4 text-grey-600 text-sm">
              Exact address shown after booking.
            </p>
          </div>
        </section>
        <aside>
          <div className="bg-white rounded-card p-5 shadow-card sticky top-4">
            <h3 className="mt-0 mb-1.5 text-base text-grey-900">
              £{stay.nightlyGBP} <span style={{ fontWeight: 400 }}>/ night</span>
            </h3>
            <p className="mt-0 mb-4 text-grey-600 text-sm">Free cancellation within 24 hours.</p>
            <button
              type="button"
              className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover disabled:cursor-not-allowed disabled:opacity-60 w-full mt-3"
              disabled
            >
              Reserve (demo)
            </button>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
