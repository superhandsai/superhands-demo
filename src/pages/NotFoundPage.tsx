import { Link, useLocation } from 'react-router-dom'
import { PageShell } from './PageShell'

export function NotFoundPage() {
  const location = useLocation()
  return (
    <PageShell breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Not found' }]} title="">
      <div className="notfound">
        <h1>404</h1>
        <h2>We can't find that page</h2>
        <p>
          The page <code>{location.pathname}</code> doesn't exist. It may have moved,
          or the link you followed is broken.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="btn btn--primary" to="/">Back to home</Link>
          <Link className="btn btn--secondary" to="/help">Visit help center</Link>
        </div>
      </div>
    </PageShell>
  )
}
