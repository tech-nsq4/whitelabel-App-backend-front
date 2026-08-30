import { Bell, X, Trash2, Send, Users } from 'lucide-react'
import { usePushNotifications, useDeletePushNotification } from '../../hooks/queries/usePushNotifications'
import './NotificationPanel.css'

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)    return 'الآن'
  if (diff < 3600)  return `قبل ${Math.floor(diff / 60)} د`
  if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} س`
  return `قبل ${Math.floor(diff / 86400)} يوم`
}

export default function NotificationPanel({ open, onClose, onCompose, pushed }) {
  const { data: notifications = [], isLoading } = usePushNotifications()
  const deleteNotif = useDeletePushNotification()

  return (
    <>
      {/* Backdrop — only when notif panel alone is open */}
      {open && !pushed && <div className="np-backdrop" onClick={onClose} />}

      {/* Panel */}
      <div className={`np-panel${open ? ' np-open' : ''}${pushed ? ' np-pushed' : ''}`}>
        {/* Header */}
        <div className="np-header">
          <div className="np-header-title">
            <Bell size={16} strokeWidth={1.8} />
            <span>الإشعارات</span>
            {notifications.length > 0 && (
              <span className="np-count">{notifications.length}</span>
            )}
          </div>
          <button className="np-close" onClick={onClose} aria-label="إغلاق">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* List */}
        <div className="np-list">
          {isLoading ? (
            <div className="np-empty">
              <div className="np-empty-icon"><Bell size={28} strokeWidth={1.3} /></div>
              <p>جارٍ التحميل...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="np-empty">
              <div className="np-empty-icon"><Bell size={28} strokeWidth={1.3} /></div>
              <p>لا توجد إشعارات</p>
              <span>أرسل إشعاراً للمستخدمين الآن</span>
            </div>
          ) : notifications.map(n => (
            <div key={n.id} className="np-item">
              <div className="np-item-icon">
                <Bell size={15} strokeWidth={1.8} />
              </div>
              <div className="np-item-body">
                <div className="np-item-title">{n.title?.ar || n.title || '—'}</div>
                {(n.description?.ar || n.description) && (
                  <div className="np-item-desc">{n.description?.ar || n.description}</div>
                )}
                <div className="np-item-meta">
                  <span className="np-item-recipients">
                    <Users size={10} strokeWidth={2} />
                    {n.recipients_count ?? 0} مستلم
                  </span>
                  <span className="np-item-time">{timeAgo(n.created_at)}</span>
                </div>
              </div>
              <button className="np-item-delete" onClick={() => deleteNotif.mutate(n.id)} aria-label="حذف">
                <Trash2 size={13} strokeWidth={1.8} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="np-footer">
            <span className="np-footer-note">{notifications.length} إشعار مرسل</span>
          </div>
        )}
      </div>
    </>
  )
}
