import { useAppointment } from '../../../hooks/queries/useAppointments'
import Modal from '../../../components/ui/Modal'
import { SkeletonBox } from '../../../components/ui/Skeleton'

const STATUSES = {
  pending:     { label: 'انتظار',    bg: 'rgba(201,162,39,.1)',  color: '#C9A227' },
  confirmed:   { label: 'مؤكد',     bg: 'rgba(15,107,92,.1)',   color: '#0F6B5C' },
  in_progress: { label: 'في الكشف', bg: 'rgba(44,109,170,.1)',  color: '#2C6DAA' },
  completed:   { label: 'مكمل',     bg: 'rgba(124,58,237,.1)',  color: '#7C3AED' },
  cancelled:   { label: 'ملغي',     bg: 'rgba(179,64,47,.1)',   color: '#B3402F' },
}

const TEST_TYPE = { analysis: 'تحليل', xray: 'أشعة' }

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <span style={{ fontSize: 12, color: 'var(--ink-45)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', textAlign: 'left' }}>{value || '—'}</span>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-45)', letterSpacing: 0.3, textTransform: 'uppercase', margin: '16px 0 8px' }}>
      {children}
    </div>
  )
}

export default function AppointmentDetailsModal({ appointmentId, onClose }) {
  const { data: appt, isLoading } = useAppointment(appointmentId)
  const open = !!appointmentId
  if (!open) return null

  const patientName   = appt?.family_member?.name || appt?.user?.name || '—'
  const doctorName    = appt?.doctor?.name?.ar || '—'
  const clinicName    = appt?.doctor?.clinic?.name?.ar || '—'
  const specialty     = appt?.doctor?.specializations?.[0]?.title?.ar || '—'
  const status        = STATUSES[appt?.status] || STATUSES.pending
  const prescriptions = appt?.prescriptions   || []
  const testRequests  = appt?.test_requests   || []

  return (
    <Modal open={open} onClose={onClose} title="تفاصيل الحجز" subtitle={`موعد #${appointmentId}`}>
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0' }}>
          <SkeletonBox height={60} style={{ borderRadius: 14 }} />
          <SkeletonBox height={14} width="80%" />
          <SkeletonBox height={14} width="60%" />
          <SkeletonBox height={14} width="70%" />
        </div>
      ) : appt ? (
        <>
          {/* ── Patient hero ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: 'var(--paper)', border: '1px solid var(--line)', marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg, var(--brand-l), var(--brand-d))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, flexShrink: 0, boxShadow: '0 4px 10px rgba(15,107,92,.2)' }}>
              {patientName.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{patientName}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-45)', marginTop: 2 }}>{appt.user?.phone || appt.user?.email || '—'}</div>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 12px', borderRadius: 99, background: status.bg, color: status.color, flexShrink: 0 }}>
              {status.label}
            </span>
          </div>

          {/* ── Appointment info ── */}
          <SectionTitle>معلومات الموعد</SectionTitle>
          <div style={{ borderRadius: 12, border: '1px solid var(--line)', overflow: 'hidden', padding: '0 14px' }}>
            <InfoRow label="الطبيب"     value={doctorName} />
            <InfoRow label="العيادة"    value={clinicName} />
            <InfoRow label="التخصص"     value={specialty} />
            <InfoRow label="التاريخ"    value={appt.date} />
            <InfoRow label="الوقت"      value={appt.times} />
            <InfoRow label="نوع الزيارة" value={appt.time_table?.type === 'clinic' ? 'عيادة' : appt.time_table?.type || '—'} />
          </div>

          {/* ── Complaint & Diagnosis ── */}
          {(appt.complaint || appt.diagnosis) && (
            <>
              <SectionTitle>الشكوى والتشخيص</SectionTitle>
              <div style={{ borderRadius: 12, border: '1px solid var(--line)', overflow: 'hidden', padding: '0 14px' }}>
                {appt.complaint && <InfoRow label="الشكوى" value={appt.complaint} />}
                {appt.diagnosis && <InfoRow label="التشخيص" value={appt.diagnosis} />}
              </div>
            </>
          )}

          {/* ── Prescriptions ── */}
          {prescriptions.length > 0 && (
            <>
              <SectionTitle>الأدوية</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {prescriptions.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{p.drug_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-45)', marginTop: 2 }}>{p.dosage}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: 'rgba(15,107,92,.1)', color: '#0F6B5C' }}>{p.duration}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Test requests ── */}
          {testRequests.length > 0 && (
            <>
              <SectionTitle>التحاليل والأشعة</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {testRequests.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{t.test?.name || '—'}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-45)', marginTop: 2 }}>{TEST_TYPE[t.type] || t.type}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: t.has_result ? 'rgba(15,107,92,.1)' : 'rgba(201,162,39,.1)', color: t.has_result ? '#0F6B5C' : '#C9A227' }}>
                      {t.has_result ? 'مكتمل' : 'منتظر'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Rating ── */}
          {appt.rate && (
            <>
              <SectionTitle>التقييم</SectionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)' }}>
                <span style={{ fontSize: 15, color: '#D97706', letterSpacing: 2 }}>{'★'.repeat(appt.rate)}{'☆'.repeat(5 - appt.rate)}</span>
                {appt.comment && <span style={{ fontSize: 12, color: 'var(--ink-70)' }}>{appt.comment}</span>}
              </div>
            </>
          )}
        </>
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-45)', fontSize: 13 }}>لا توجد بيانات</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}
