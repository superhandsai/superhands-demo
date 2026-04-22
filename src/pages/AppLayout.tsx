import { Outlet } from 'react-router-dom'
import { SiteHeader, SiteFooter } from '../App'

export function AppLayout() {
  return (
    <div className="tripma">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  )
}
