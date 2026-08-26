import { useAppointment } from '../../../hooks/queries/useAppointments'
import Modal from '../../../components/ui/Modal'

const STATUSES = {
  pending:     { label: 'انتظار',    bg: 'rgba(201,162,39,.1)',  color: '#C9A227' },
  confirmed:   { label: 'مؤكد',     bg: 'rgba(15,107,92,.1)',   color: '#0F6B5C' },
  in_progress: { label: 'في الكشف', bg: 'rgba(44,109,170,.1)',  color: '#2C6DAA' },
  completed:   { label: 'مكمل',     bg: 'rgba(124,58,237,.1)',  color: '#7C3AED' },
  cancelled:   { label: 'ملغي',     bg: 'rgba(179,64,47,.1)',   color: '#B3402F' },
}

const TEST_TYPE = { analysis: 'تحليل', xray: 'أشعة' }

function Row({ label, value }) {
  return (
    <div className="appointment-detail-item">
      <span>{label}</span>
      <strong>{value || '—'}</strong>
    </div>
  )
}

export default function AppointmentDetailsModal({ appointmentId, onClose }) {
  const { data: appt, isLoading } = useAppointment(appointmentId)
  const open = !!appointmentId

  if (!open) return null

  const patientName  = appt?.family_member?.name || appt?.user?.name || '—'
  const doctorName   = appt?.doctor?.name?.ar || '—'
  const clinicName   = appt?.doctor?.clinic?.name?.ar || '—'
  const specialty    = appt?.doctor?.specializations?.[0]?.title?.ar || '—'
  const status       = STATUSES[appt?.status] || STATUSES.pending
  const prescriptions = appt?.prescriptions || []
  const testRequests  = appt?.test_requests  || []

  return (
    <Modal open={open} onClose={onClose} title="تفاصيل الحجز" subtitle={`موعد #${appointmentId}`}>
      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-45)', fontSize: 13 }}>
          جارٍ التحميل...
        </div>
      ) : appt ? (
        <>
          {/* Hero */}
          <div className="appointment-detail-hero" style={{ '--doctor-color': '#0F6B5C' }}>
            <div className="appointment-detail-avatar">{patientName.charAt(0)}</div>
            <div>
              <div className="appointment-detail-name">{patientName}</div>
              <div className="appointment-detail-id">{appt.user?.phone || appt.user?.email || '—'}</div>
            </div>
            <span className="chip" style={{ marginRight: 'auto', background: status.bg, color: status.color, border: 'none', fontSize: 11.5 }}>
              {status.label}
            </span>
          </div>

          {/* Info grid */}
          <div className="appointment-detail-grid" style={{ marginBottom: 14 }}>
            <Row label="الطبيب"      value={doctorName} />
            <Row label="العيادة"     value={clinicName} />
            <Row label="التخصص"      value={specialty} />
            <Row label="التاريخ"     value={appt.date} />
            <Row label="الوقت"       value={appt.times} />
            <Row label="نوع الجدول"  value={appt.time_table?.type === 'clinic' ? 'عيادة' : appt.time_table?.type} />
          </div>

          {/* Complaint & Diagnosis */}
          {(appt.complaint || appt.diagnosis) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {appt.complaint && (
                <div className="appointment-detail-item" style={{ gridColumn: 'span 2' }}>
                  <span>الشكوى</span>
                  <strong style={{ whiteSpace: 'pre-wrap', fontWeight: 500, fontSize: 12.5 }}>{appt.complaint}</strong>
                </div>
              )}
              {appt.diagnosis && (
                <div className="appointment-detail-item" style={{ gridColumn: 'span 2' }}>
                  <span>التشخيص</span>
                  <strong style={{ whiteSpace: 'pre-wrap', fontWeight: 500, fontSize: 12.5 }}>{appt.diagnosis}</strong>
                </div>
              )}
            </div>
          )}

          {/* Prescriptions */}
          {prescriptions.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>الأدوية</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {prescriptions.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{p.drug_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-45)', marginTop: 2 }}>{p.dosage}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: 'rgba(15,107,92,.1)', color: '#0F6B5C' }}>{p.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test requests */}
          {testRequests.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>التحاليل والأشعة</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {testRequests.map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{t.test?.name || '—'}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-45)', marginTop: 2 }}>{TEST_TYPE[t.type] || t.type}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: t.has_result ? 'rgba(15,107,92,.1)' : 'rgba(201,162,39,.1)', color: t.has_result ? '#0F6B5C' : '#C9A227' }}>
                      {t.has_result ? 'مكتمل' : 'منتظر'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          {appt.rate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)', marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-45)' }}>التقييم</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#D97706' }}>{'★'.repeat(appt.rate)}{'☆'.repeat(5 - appt.rate)}</span>
              {appt.comment && <span style={{ fontSize: 12, color: 'var(--ink-70)', marginRight: 4 }}>{appt.comment}</span>}
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-45)', fontSize: 13 }}>لا توجد بيانات</div>
      )}

      <div className="appointment-detail-actions">
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}
