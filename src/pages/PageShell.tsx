import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface PageShellProps {
  title: ReactNode
  subtitle?: ReactNode
  breadcrumbs?: Array<{ label: string; to?: string }>
  actions?: ReactNode
  children: ReactNode
}

export function PageShell({ title, subtitle, breadcrumbs, actions, children }: PageShellProps) {
  return (
    <main className="page-shell">
      <div className="page-shell__inner">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="page-shell__crumbs" aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((c, i) => (
                <li key={i}>
                  {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <header className="page-shell__header">
          <div>
            <h1 className="page-shell__title">{title}</h1>
            {subtitle ? <p className="page-shell__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="page-shell__actions">{actions}</div> : null}
        </header>
        {children}
      </div>
    </main>
  )
}
