import { Bell, CheckCheck, ArrowLeft, Trash2, Send } from "lucide-react";
import {
  usePushNotifications,
  useDeletePushNotification,
} from "../../hooks/queries/usePushNotifications";
import "./NotificationDropdown.css";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "الآن";
  if (diff < 3600) return `قبل ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} س`;
  return `قبل ${Math.floor(diff / 86400)} يوم`;
}

export default function NotificationDropdown({
  open,
  onMarkAllRead,
  onCompose,
}) {
  const { data: notifications = [], isLoading } = usePushNotifications();
  const deleteNotif = useDeletePushNotification();

  if (!open) return null;

  return (
    <div className="notif-dd" role="dialog" aria-label="الإشعارات">
      {/* Header */}
      <div className="notif-header">
        <div className="notif-header-left">
          <span className="notif-title-text">الإشعارات</span>
          {notifications.length > 0 && (
            <span className="notif-badge">{notifications.length}</span>
          )}
        </div>
        <button className="notif-mark-all" onClick={onCompose}>
          <Send size={12} strokeWidth={2} />
          إرسال إشعار
        </button>
      </div>

      {/* List */}
      <div className="notif-list">
        {isLoading ? (
          <div className="notif-empty">جارٍ التحميل...</div>
        ) : notifications.length === 0 ? (
          <div className="notif-empty">لا توجد إشعارات</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="notif-item">
              <div
                className="notif-icon"
                style={{
                  background: "rgba(15,107,92,.1)",
                  color: "var(--brand)",
                }}
              >
                <Bell size={15} strokeWidth={1.8} />
              </div>
              <div className="notif-body">
                <div className="notif-item-title">{n.title?.ar || n.title}</div>
                <div className="notif-item-desc">
                  {n.description?.ar || n.description}
                </div>
                <div className="notif-item-meta">
                  <span className="notif-recipients">
                    {n.recipients_count} مستلم
                  </span>
                  <span className="notif-time">{timeAgo(n.created_at)}</span>
                </div>
              </div>
              <button
                className="notif-delete"
                onClick={() => deleteNotif.mutate(n.id)}
                aria-label="حذف"
              >
                <Trash2 size={13} strokeWidth={1.8} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="notif-footer">
        <button className="notif-footer-btn" onClick={onMarkAllRead}>
          <CheckCheck size={13} strokeWidth={1.8} />
          علّم الكل مقروءً
          <ArrowLeft size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
