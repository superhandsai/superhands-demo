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
        <div className="empty-state">
          <p>That stay is no longer available.</p>
          <Link className="btn btn--primary" to="/stays">Browse stays</Link>
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
      <div className="stay-hero">
        <img src={stay.image} alt="" />
      </div>
      <div className="stay-detail-layout">
        <section>
          <div className="detail-card">
            <h2>About this stay</h2>
            <p>{stay.description}</p>
          </div>
          <div className="detail-card">
            <h2>Amenities</h2>
            <ul className="amenity-list">
              {stay.amenities.map(a => <li key={a}>{a}</li>)}
            </ul>
          </div>
          <div className="detail-card">
            <h2>Location</h2>
            <p>{stay.location}, {stay.country}</p>
            <p className="detail-card__sub">Exact address shown after booking.</p>
          </div>
        </section>
        <aside>
          <div className="summary-card">
            <h3>£{stay.nightlyGBP} <span style={{ fontWeight: 400 }}>/ night</span></h3>
            <p className="detail-card__sub">Free cancellation within 24 hours.</p>
            <button type="button" className="btn btn--primary summary-card__cta" disabled>
              Reserve (demo)
            </button>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
