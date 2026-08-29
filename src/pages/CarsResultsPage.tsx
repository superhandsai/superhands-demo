import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PageShell } from './PageShell'

export function CarsResultsPage() {
  const [params] = useSearchParams()
  const pickup = params.get('pickup') || ''
  const start = params.get('start') || ''
  const end = params.get('end') || ''
  const age = params.get('age') || ''

  useEffect(() => {
    // Log the fake-door interaction for analytics
    console.log('Car search interest logged:', {
      pickup,
      start,
      end,
      age,
      timestamp: new Date().toISOString(),
    })
  }, [pickup, start, end, age])

  return (
    <PageShell
      title="Car Rentals"
      subtitle={pickup ? `Pickup location: ${pickup}` : ''}
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Car Rentals' }]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-card shadow-card p-8 text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-purple"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-grey-900 mt-0 mb-4">
            Car Rentals Coming Soon!
          </h2>

          <p className="text-grey-700 mb-4 leading-relaxed">
            Thank you for your interest in car rentals. This feature is currently under construction,
            and we've logged your interest to help us prioritize development.
          </p>

          {pickup && (
            <div className="bg-grey-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-grey-700 mt-0 mb-2">Your search:</h3>
              <ul className="list-none m-0 p-0 space-y-1 text-sm text-grey-600">
                {pickup && <li><strong>Pickup location:</strong> {pickup}</li>}
                {start && <li><strong>Pickup date:</strong> {start}</li>}
                {end && <li><strong>Drop-off date:</strong> {end}</li>}
                {age && <li><strong>Driver age:</strong> {age}</li>}
              </ul>
            </div>
          )}

          <p className="text-grey-600 text-sm mb-6">
            Thank you for taking the time to use Superhands. Your feedback helps us build better features!
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-purple text-white rounded-lg font-semibold text-base transition-colors hover:bg-purple-hover no-underline hover:no-underline"
            >
              Back to Home
            </Link>
            <Link
              to="/stays/results"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple border-2 border-purple rounded-lg font-semibold text-base transition-colors hover:bg-grey-50 no-underline hover:no-underline"
            >
              Browse Hotels Instead
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
