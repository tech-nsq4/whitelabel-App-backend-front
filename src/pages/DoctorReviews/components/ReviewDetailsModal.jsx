import Modal from '../../../components/ui/Modal'

function Stars({ rate }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24"
          fill={i <= rate ? '#F59E0B' : 'none'}
          stroke={i <= rate ? '#F59E0B' : 'var(--ink-30)'}
          strokeWidth="1.8">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <span style={{ fontSize: 12, color: 'var(--ink-45)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{value ?? '—'}</span>
    </div>
  )
}

export default function ReviewDetailsModal({ open, onClose, review }) {
  if (!review) return null
  return (
    <Modal open={open} onClose={onClose} title={`تقييم #${review.id}`} subtitle="تفاصيل التقييم">
      {/* Rating header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--paper)', borderRadius: 12, border: '1px solid var(--line)', marginBottom: 16 }}>
        <Stars rate={review.rate} />
        <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Readex Pro'" }}>{review.rate}<span style={{ fontSize: 13, color: 'var(--ink-45)', fontWeight: 400 }}> / 5</span></span>
      </div>

      <Row label="المريض"  value={review.user?.name || review.user?.phone} />
      <Row label="الطبيب"  value={review.doctor?.name?.ar} />
      <Row label="العيادة" value={review.clinic?.name?.ar} />
      <Row label="التاريخ" value={review.date} />

      {review.comment && (
        <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-45)', marginBottom: 6 }}>التعليق</div>
          <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.7 }}>{review.comment}</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}
