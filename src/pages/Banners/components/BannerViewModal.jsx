import Modal from '../../../components/ui/Modal'
import { useBanner } from '../../../hooks/queries/useBanners'

export default function BannerViewModal({ open, onClose, banner }) {
  // نجيب البيانات الكاملة من GET /api/admin/banners/{id}
  const { data: full, isLoading } = useBanner(open && banner ? banner.id : null)
  const b = full || banner

  if (!b) return null

  const offerName = b.offer?.name?.ar || (b.offer_id ? `عرض #${b.offer_id}` : null)

  return (
    <Modal open={open} onClose={onClose} title="تفاصيل البانر" subtitle={b.title?.ar}>
      {isLoading && (
        <div style={{ fontSize: 12, color: 'var(--ink-45)', marginBottom: 12 }}>جاري التحميل...</div>
      )}

      {b.image && (
        <img
          src={b.image}
          alt={b.title?.ar}
          style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10, marginBottom: 16 }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
        <Row label="العنوان (عربي)" value={b.title?.ar} />
        <Row label="العنوان (إنجليزي)" value={b.title?.en} />
        <Row label="العرض المرتبط" value={offerName} />
        <Row
          label="تاريخ الإنشاء"
          value={b.created_at ? new Date(b.created_at).toLocaleDateString('ar-EG') : null}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--ink-45)', minWidth: 130, flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  )
}
