import Modal from '../../../components/ui/Modal'

const AVATAR_COLORS = [
  'linear-gradient(135deg, #0F6B5C, #0A4F44)',
  'linear-gradient(135deg, #2C6DAA, #1e4f7e)',
  'linear-gradient(135deg, #7C3AED, #5B21B6)',
  'linear-gradient(135deg, #D97706, #b45309)',
  'linear-gradient(135deg, #DB2777, #9d174d)',
  'linear-gradient(135deg, #0891B2, #0e7490)',
  'linear-gradient(135deg, #059669, #047857)',
  'linear-gradient(135deg, #9333EA, #7e22ce)',
]

const STATUS_CONFIG = {
  active:   { label: 'نشط',     color: 'var(--ok)',     bg: 'rgba(15,107,92,0.1)' },
  leave:    { label: 'إجازة',   color: 'var(--warn)',   bg: 'rgba(169,118,18,0.1)' },
  inactive: { label: 'غير نشط', color: 'var(--ink-45)', bg: 'var(--paper)' },
}

function Row({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <span style={{ fontSize: 12, color: 'var(--ink-45)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', fontFamily: mono ? "'Readex Pro'" : 'inherit' }} dir={mono ? 'ltr' : undefined}>
        {value}
      </span>
    </div>
  )
}

export default function DoctorFileModal({ open, onClose, doctor, index = 0 }) {
  if (!doctor) return null
  const avatarBg = AVATAR_COLORS[index % AVATAR_COLORS.length]
  const status   = STATUS_CONFIG[doctor.status] || STATUS_CONFIG.active

  return (
    <Modal open={open} onClose={onClose} title="ملف الطبيب" subtitle={doctor.specialty}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: '14px 18px', background: 'var(--paper)', borderRadius: 12, border: '1px solid var(--line)' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Readex Pro'", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
          {doctor.initial}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Readex Pro'", fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{doctor.name}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-45)', marginTop: 3 }}>{doctor.specialty} · {doctor.branch}</div>
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 99, color: status.color, background: status.bg }}>
          {status.label}
        </span>
      </div>

      {/* Info rows */}
      <Row label="الجوال"            value={doctor.phone}   mono />
      <Row label="الفرع"             value={doctor.branch} />
      <Row label="رقم الرخصة"       value={doctor.license} mono />
      <Row label="زيارات هذا الشهر" value={`${doctor.visits} زيارة`} mono />
      <Row label="متوسط التقييم"    value={`${doctor.rating} / 5`}   mono />
      {doctor.licenseExpiring && (
        <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(169,118,18,0.08)', border: '1px solid rgba(169,118,18,0.2)', borderRadius: 10, fontSize: 12, color: 'var(--warn)', fontWeight: 500 }}>
          ⚠ الرخصة تحتاج تجديد قريباً
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}
