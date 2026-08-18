import Modal from '../../../components/ui/Modal'

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '14px 8px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)' }}>
      <div style={{ fontFamily: "'Readex Pro'", fontSize: 22, fontWeight: 700, color: color || 'var(--ink)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-45)', marginTop: 5 }}>{label}</div>
    </div>
  )
}

export default function InsuranceDetailsModal({ open, onClose, company }) {
  if (!company) return null
  return (
    <Modal open={open} onClose={onClose} title={company.name} subtitle="تفاصيل شركة التأمين">

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        <Stat label="المطالبات الفعالة" value={company.active} />
        <Stat label="معتمدة"  value={company.approved} color="var(--ok)" />
        <Stat label="مرفوضة" value={company.rejected} color="var(--danger)" />
        <Stat label="بانتظار" value={company.pending}  color="var(--warn)" />
      </div>

      {/* Total value */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--sand)', borderRadius: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--ink-70)' }}>القيمة الإجمالية للمطالبات</span>
        <span style={{ fontFamily: "'Readex Pro'", fontSize: 18, fontWeight: 700, color: 'var(--brand)' }}>
          {company.totalValue} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--ink-45)' }}>ر.س</span>
        </span>
      </div>

      {/* Approval rate */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-45)', marginBottom: 6 }}>
          <span>نسبة القبول</span>
          <span>{Math.round((company.approved / company.active) * 100)}%</span>
        </div>
        <div style={{ height: 6, background: 'var(--line)', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--brand)', borderRadius: 6, width: `${Math.round((company.approved / company.active) * 100)}%`, transition: 'width 0.6s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}
