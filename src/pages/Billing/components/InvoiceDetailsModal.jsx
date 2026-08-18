import Modal from '../../../components/ui/Modal'
import { STATUS_CONFIG } from '../billing.data'

function Row({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <span style={{ fontSize: 12, color: 'var(--ink-45)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', fontFamily: mono ? "'Readex Pro'" : 'inherit' }}>{value}</span>
    </div>
  )
}

export default function InvoiceDetailsModal({ open, onClose, invoice }) {
  if (!invoice) return null
  const st = STATUS_CONFIG[invoice.status]
  return (
    <Modal open={open} onClose={onClose} title={invoice.number} subtitle="تفاصيل الفاتورة">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--paper)', borderRadius: 12, border: '1px solid var(--line)', marginBottom: 16 }}>
        <div style={{ fontFamily: "'Readex Pro'", fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>
          {invoice.amount} <span style={{ fontSize: 13, color: 'var(--ink-45)', fontWeight: 400 }}>ر.س</span>
        </div>
        <span className={`chip ${st.cls}`}>{st.label}</span>
      </div>
      <Row label="المريض"       value={invoice.patient} />
      <Row label="الخدمة"       value={invoice.service} />
      <Row label="الطبيب"       value={invoice.doctor} />
      <Row label="التاريخ"      value={invoice.date} />
      <Row label="طريقة الدفع" value={invoice.method} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}
