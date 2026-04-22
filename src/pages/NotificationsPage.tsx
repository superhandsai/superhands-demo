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
            className="btn btn--secondary"
            onClick={markAllNotificationsRead}
          >
            Mark all read
          </button>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div className="notif-empty">
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="notif-list">
          {items.map(n => (
            <article key={n.id} className={`notif-card ${n.read ? '' : 'is-unread'}`}>
              <div className={`notif-card__icon type-${n.type}`} aria-hidden>
                {iconFor(n.type)}
              </div>
              <div className="notif-card__body">
                <h3>{n.title}</h3>
                <p>{n.body}</p>
                {n.href && n.ctaLabel ? (
                  <div className="notif-card__cta">
                    <Link
                      className="btn btn--secondary"
                      to={n.href}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      {n.ctaLabel}
                    </Link>
                    {!n.read ? (
                      <button
                        type="button"
                        className="link-more"
                        onClick={() => markNotificationRead(n.id)}
                      >
                        Mark read
                      </button>
                    ) : null}
                  </div>
                ) : !n.read ? (
                  <div className="notif-card__cta">
                    <button
                      type="button"
                      className="link-more"
                      onClick={() => markNotificationRead(n.id)}
                    >
                      Mark read
                    </button>
                  </div>
                ) : null}
              </div>
              <span className="notif-card__time">{formatRelativeTime(n.createdAt)}</span>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  )
}
