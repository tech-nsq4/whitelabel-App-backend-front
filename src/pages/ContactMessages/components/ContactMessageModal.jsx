import Modal from '../../../components/ui/Modal'
import { useContactMessage } from '../../../hooks/queries/useContactMessages'
import { SkeletonBox } from '../../../components/ui/Skeleton'

export default function ContactMessageModal({ open, onClose, messageId }) {
  const { data: msg, isLoading, isError } = useContactMessage(open ? messageId : null)

  return (
    <Modal open={open} onClose={onClose} title="تفاصيل الرسالة">
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SkeletonBox height={18} style={{ borderRadius: 6, width: '60%' }} />
          <SkeletonBox height={18} style={{ borderRadius: 6, width: '80%' }} />
          <SkeletonBox height={80} style={{ borderRadius: 8 }} />
        </div>
      ) : isError ? (
        <div style={{ color: 'var(--danger)', fontSize: 13, padding: '16px 0' }}>
          تعذر تحميل الرسالة. ربما تم حذفها أو الرابط غير صحيح.
        </div>
      ) : msg ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Row label="الاسم"            value={msg.name} />
          <Row label="البريد الإلكتروني" value={msg.email} dir="ltr" />
          <Row label="رقم الهاتف"       value={msg.phone} dir="ltr" />
          <Row label="الموضوع"          value={msg.subject} />
          {msg.message && (
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-45)', fontWeight: 600, marginBottom: 6 }}>
                الرسالة
              </div>
              <div style={{
                background: 'var(--paper)',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 13,
                color: 'var(--ink)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.message}
              </div>
            </div>
          )}
          <Row
            label="تاريخ الإرسال"
            value={msg.created_at ? new Date(msg.created_at).toLocaleString('ar-EG') : null}
          />
        </div>
      ) : (
        <div style={{ color: 'var(--ink-45)', fontSize: 13, padding: '16px 0' }}>
          تعذر تحميل الرسالة
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}

function Row({ label, value, dir }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--ink-45)', fontSize: 12, fontWeight: 600, minWidth: 130, flexShrink: 0 }}>
        {label}
      </span>
      <span dir={dir} style={{ color: 'var(--ink)', fontSize: 13, fontWeight: 500 }}>
        {value}
      </span>
    </div>
  )
}
