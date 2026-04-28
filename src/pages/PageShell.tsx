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
    <main className="px-6 py-10 pb-16 bg-grey-100 min-h-[60vh]">
      <div className="max-w-[1312px] mx-auto">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="text-sm text-grey-400 mb-2" aria-label="Breadcrumb">
            <ol className="list-none p-0 m-0 flex gap-2 flex-wrap">
              {breadcrumbs.map((c, i) => (
                <li
                  key={i}
                  className="[&+li]:before:content-['›'] [&+li]:before:mr-2 [&+li]:before:text-grey-300"
                >
                  {c.to ? (
                    <Link className="text-grey-600" to={c.to}>
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-grey-900 font-semibold" aria-current="page">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <header className="flex justify-between items-end gap-6 my-2 mb-6 flex-wrap">
          <div>
            <h1 className="text-[32px] leading-[1.15] text-grey-900 m-0">{title}</h1>
            {subtitle ? <p className="mt-1.5 text-grey-600">{subtitle}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </header>
        {children}
      </div>
    </main>
  )
}
