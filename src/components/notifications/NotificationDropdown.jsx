import { useState } from 'react'
import {
  CalendarCheck, FileText, CreditCard,
  UserCheck, Bell, CheckCheck, ArrowLeft
} from 'lucide-react'
import './NotificationDropdown.css'

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    icon: <UserCheck size={15} strokeWidth={1.8} />,
    iconColor: 'warn',
    title: 'طلب إجازة مرضية جديد',
    desc: 'من نورة العتيبي',
    time: 'قبل 5 د',
    read: false,
  },
  {
    id: 2,
    icon: <CalendarCheck size={15} strokeWidth={1.8} />,
    iconColor: 'info',
    title: 'حجز جديد لـ د. خالد',
    desc: '15 يوليو · 10:30 صباحاً',
    time: 'قبل 12 د',
    read: false,
  },
  {
    id: 3,
    icon: <CreditCard size={15} strokeWidth={1.8} />,
    iconColor: 'ok',
    title: 'اشتراك جديد في المساعد',
    desc: '290 ريال سنوياً',
    time: 'قبل ساعة',
    read: false,
  },
  {
    id: 4,
    icon: <FileText size={15} strokeWidth={1.8} />,
    iconColor: 'mut',
    title: 'تقرير مالي جاهز للمراجعة',
    desc: 'يونيو 2026',
    time: 'أمس',
    read: true,
  },
]

const COLOR_MAP = {
  ok:   { bg: 'rgba(15,107,92,.1)',   color: 'var(--ok)' },
  warn: { bg: 'rgba(169,118,18,.1)',  color: 'var(--warn)' },
  info: { bg: 'rgba(44,109,170,.1)',  color: 'var(--info)' },
  mut:  { bg: 'var(--paper)',         color: 'var(--ink-45)' },
}

export default function NotificationDropdown({ open, onMarkAllRead }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAll() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    onMarkAllRead()
  }

  function markOne(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  if (!open) return null

  return (
    <div className="notif-dd" role="dialog" aria-label="الإشعارات">
      {/* Header */}
      <div className="notif-header">
        <div className="notif-header-left">
          <span className="notif-title-text">الإشعارات</span>
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="notif-mark-all" onClick={markAll}>
            <CheckCheck size={13} strokeWidth={2} />
            علّم الكل مقروءً
          </button>
        )}
      </div>

      {/* List */}
      <div className="notif-list">
        {notifications.map((n) => {
          const colors = COLOR_MAP[n.iconColor] || COLOR_MAP.mut
          return (
            <div
              key={n.id}
              className={`notif-item${n.read ? ' read' : ''}`}
              onClick={() => markOne(n.id)}
            >
              <div
                className="notif-icon"
                style={{ background: colors.bg, color: colors.color }}
              >
                {n.icon}
              </div>
              <div className="notif-body">
                <div className="notif-item-title">{n.title}</div>
                <div className="notif-item-desc">{n.desc}</div>
              </div>
              <div className="notif-meta">
                <span className="notif-time">{n.time}</span>
                {!n.read && <span className="notif-dot" />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="notif-footer">
        <button className="notif-footer-btn">
          <Bell size={13} strokeWidth={1.8} />
          عرض كل الإشعارات
          <ArrowLeft size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
