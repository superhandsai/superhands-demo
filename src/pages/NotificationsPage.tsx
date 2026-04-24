import { Link } from 'react-router-dom'
import { PageShell } from './PageShell'
import { useStore } from '../lib/useStore'
import {
  formatRelativeTime,
  markAllNotificationsRead,
  markNotificationRead,
  notificationsStore,
  type NotificationType,
} from '../lib/notificationsStore'

function iconFor(type: NotificationType) {
  switch (type) {
    case 'alert':
      return '⚠'
    case 'deal':
      return '✦'
    case 'booking':
      return '✈'
    case 'system':
      return 'ℹ'
  }
}

function iconClassFor(type: NotificationType) {
  switch (type) {
    case 'alert':
      return 'bg-warn-soft text-warn'
    case 'deal':
      return 'bg-success-soft text-success'
    case 'booking':
      return 'bg-purple-soft text-purple'
    case 'system':
      return 'bg-grey-100 text-grey-600'
  }
}

export function NotificationsPage() {
  const items = useStore(notificationsStore)
  const unread = items.filter(n => !n.read).length
  return (
    <PageShell
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Notifications' }]}
      title="Notifications"
      subtitle={unread > 0 ? `${unread} unread` : 'All caught up.'}
      actions={
        items.length > 0 && unread > 0 ? (
          <button
            type="button"
            className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on"
            onClick={markAllNotificationsRead}
          >
            Mark all read
          </button>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-[14px] border border-dashed border-grey-200">
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(n => (
            <article
              key={n.id}
              className={`bg-white rounded-[14px] p-4 px-5 grid grid-cols-[36px_1fr_auto] gap-3 items-start ${
                n.read
                  ? 'border border-grey-200'
                  : 'border border-purple shadow-[0_0_0_1px_rgba(96,93,236,0.15)]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${iconClassFor(n.type)}`}
                aria-hidden
              >
                {iconFor(n.type)}
              </div>
              <div>
                <h3 className="mt-0 mb-1 text-[15px] text-grey-900">{n.title}</h3>
                <p className="m-0 text-grey-600 text-sm">{n.body}</p>
                {n.href && n.ctaLabel ? (
                  <div className="mt-2.5 flex gap-2 flex-wrap">
                    <Link
                      className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on"
                      to={n.href}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      {n.ctaLabel}
                    </Link>
                    {!n.read ? (
                      <button
                        type="button"
                        className="text-purple no-underline font-normal hover:underline bg-transparent border-0 p-0 cursor-pointer"
                        onClick={() => markNotificationRead(n.id)}
                      >
                        Mark read
                      </button>
                    ) : null}
                  </div>
                ) : !n.read ? (
                  <div className="mt-2.5 flex gap-2 flex-wrap">
                    <button
                      type="button"
                      className="text-purple no-underline font-normal hover:underline bg-transparent border-0 p-0 cursor-pointer"
                      onClick={() => markNotificationRead(n.id)}
                    >
                      Mark read
                    </button>
                  </div>
                ) : null}
              </div>
              <span className="text-xs text-grey-600 whitespace-nowrap">
                {formatRelativeTime(n.createdAt)}
              </span>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  )
}
