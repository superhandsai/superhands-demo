import { Link, useLocation } from 'react-router-dom'
import { PageShell } from './PageShell'

export function NotFoundPage() {
  const location = useLocation()
  return (
    <PageShell breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Not found' }]} title="">
      <div className="max-w-[560px] mx-auto text-center px-5 py-[60px]">
        <h1 className="text-[80px] text-purple m-0">404</h1>
        <h2>We can't find that page</h2>
        <p className="text-grey-600 mb-6">
          The page <code>{location.pathname}</code> doesn't exist. It may have moved,
          or the link you followed is broken.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
            to="/"
          >
            Back to home
          </Link>
          <Link
            className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on"
            to="/help"
          >
            Visit help center
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
