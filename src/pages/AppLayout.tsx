import { Outlet } from 'react-router-dom'
import { SiteHeader, SiteFooter } from '../App'
import { ToastViewport } from '../components/ToastViewport'
import { SupportChat } from '../components/SupportChat'
import { CommandPalette } from '../components/CommandPalette'

export function AppLayout() {
  return (
    <div className="tripma">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <ToastViewport />
      <SupportChat />
      <CommandPalette />
    </div>
  )
}
