import { Outlet, useLocation } from 'react-router-dom'
import { PageShell } from './PageShell'
import { CheckoutStepper } from '../components/CheckoutStepper'

export function CheckoutLayout() {
  const { pathname } = useLocation()
  const step =
    pathname.endsWith('/seats') ? 'seats' :
    pathname.endsWith('/extras') ? 'extras' :
    pathname.endsWith('/payment') ? 'payment' :
    'passengers'

  return (
    <PageShell
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Book your trip' }]}
      title="Book your trip"
      subtitle="All bookings include our 24-hour free cancellation promise."
    >
      <CheckoutStepper current={step} />
      <Outlet />
    </PageShell>
  )
}
