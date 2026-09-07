import Modal from '../../../components/ui/Modal'
import { usePatientHistory } from '../../../hooks/queries/usePatients'
import { Pill, FlaskConical, ScanLine, Star, FileText, Stethoscope } from 'lucide-react'

function getInitial(name) {
  if (!name) return '؟'
  return name.trim().charAt(0).toUpperCase()
}

const STATUS_MAP = {
  pending:     { label: 'انتظار',    bg: 'rgba(201,162,39,.1)',  color: '#C9A227' },
  confirmed:   { label: 'مؤكد',     bg: 'rgba(15,107,92,.1)',   color: '#0F6B5C' },
  in_progress: { label: 'في الكشف', bg: 'rgba(44,109,170,.1)',  color: '#2C6DAA' },
  completed:   { label: 'مكتمل',    bg: 'rgba(124,58,237,.1)',  color: '#7C3AED' },
  cancelled:   { label: 'ملغي',     bg: 'rgba(179,64,47,.1)',   color: '#B3402F' },
}

function SectionLabel({ icon, children, color = 'var(--ink-45)' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 700, color,
      letterSpacing: '.4px', textTransform: 'uppercase',
      margin: '10px 0 6px',
    }}>
      {icon && <span style={{ display: 'flex', color }}>{icon}</span>}
      {children}
    </div>
  )
}

function ApptCard({ appt }) {
  const st = STATUS_MAP[appt.status] || STATUS_MAP.pending
  const prescriptions = appt.prescriptions || []
  const tests = appt.test_requests || []
  const analyses = tests.filter(t => t.type === 'analysis')
  const xrays    = tests.filter(t => t.type === 'xray')

  return (
    <div style={{
      border: '1px solid var(--line)',
      borderRight: `3px solid ${st.color}`,
      borderRadius: 12,
      padding: '12px 14px',
      marginBottom: 10,
      background: 'var(--card)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{appt.date}</span>
          {appt.times && <span style={{ fontSize: 12, color: 'var(--ink-45)', marginRight: 6 }}>— {appt.times}</span>}
          {appt.doctor?.name?.ar && (
            <span style={{ fontSize: 11.5, color: 'var(--ink-45)', marginRight: 6 }}>· {appt.doctor.name.ar}</span>
          )}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 99, background: st.bg, color: st.color }}>
          {st.label}
        </span>
      </div>

      {/* Complaint & Diagnosis */}
      {(appt.complaint || appt.diagnosis) && (
        <div style={{ fontSize: 12.5, color: 'var(--ink-70)', lineHeight: 1.7, marginBottom: 8, padding: '8px 10px', background: 'var(--paper)', borderRadius: 8 }}>
          {appt.complaint && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <FileText size={12} strokeWidth={2} style={{ color: 'var(--ink-45)', marginTop: 2, flexShrink: 0 }} />
              <span><span style={{ color: 'var(--ink-45)', fontWeight: 600 }}>الشكوى: </span>{appt.complaint}</span>
            </div>
          )}
          {appt.diagnosis && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginTop: appt.complaint ? 4 : 0 }}>
              <Stethoscope size={12} strokeWidth={2} style={{ color: 'var(--brand)', marginTop: 2, flexShrink: 0 }} />
              <span><span style={{ color: 'var(--ink-45)', fontWeight: 600 }}>التشخيص: </span>{appt.diagnosis}</span>
            </div>
          )}
        </div>
      )}

      {/* Prescriptions */}
      {prescriptions.length > 0 && (
        <>
          <SectionLabel icon={<Pill size={12} strokeWidth={2} />} color="#0F6B5C">الأدوية</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {prescriptions.map(rx => (
              <div key={rx.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px', background: 'rgba(15,107,92,.05)', borderRadius: 8, fontSize: 12.5,
              }}>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{rx.drug_name}</span>
                  {rx.dosage && <span style={{ color: 'var(--ink-45)', marginRight: 6 }}>— {rx.dosage}</span>}
                </div>
                {rx.duration && (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: 'rgba(15,107,92,.1)', color: '#0F6B5C' }}>
                    {rx.duration}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Analyses */}
      {analyses.length > 0 && (
        <>
          <SectionLabel icon={<FlaskConical size={12} strokeWidth={2} />} color="#2C6DAA">التحاليل</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {analyses.map(t => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px', background: 'rgba(44,109,170,.05)', borderRadius: 8, fontSize: 12.5,
              }}>
                <span style={{ fontWeight: 600 }}>{t.test?.name || `تحليل #${t.id}`}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                  background: t.has_result ? 'rgba(15,107,92,.1)' : 'rgba(201,162,39,.1)',
                  color: t.has_result ? '#0F6B5C' : '#C9A227',
                }}>
                  {t.has_result ? 'مكتمل' : 'منتظر'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* X-rays */}
      {xrays.length > 0 && (
        <>
          <SectionLabel icon={<ScanLine size={12} strokeWidth={2} />} color="#DB2777">الأشعة</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {xrays.map(t => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px', background: 'rgba(219,39,119,.05)', borderRadius: 8, fontSize: 12.5,
              }}>
                <span style={{ fontWeight: 600 }}>{t.test?.name || `أشعة #${t.id}`}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                  background: t.has_result ? 'rgba(15,107,92,.1)' : 'rgba(219,39,119,.1)',
                  color: t.has_result ? '#0F6B5C' : '#DB2777',
                }}>
                  {t.has_result ? 'مكتمل' : 'منتظر'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Rating */}
      {appt.rate && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <Star size={12} strokeWidth={2} style={{ color: '#C9A227', fill: '#C9A227' }} />
          <div style={{ display: 'flex', gap: 1 }}>
            {[1,2,3,4,5].map(s => (
              <svg key={s} width="12" height="12" viewBox="0 0 24 24"
                fill={s <= Math.round(appt.rate) ? '#C9A227' : 'none'}
                stroke="#C9A227" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span style={{ fontWeight: 700, color: '#C9A227' }}>{Number(appt.rate).toFixed(1)}</span>
          {appt.comment && <span style={{ color: 'var(--ink-45)', fontStyle: 'italic' }}>"{appt.comment}"</span>}
        </div>
      )}
    </div>
  )
}

export default function PatientFileModal({ patient, onClose }) {
  const { data: history, isLoading } = usePatientHistory(patient?.id)

  if (!patient) return null

  const appointments  = history?.appointments  ?? []

  return (
    <Modal open={Boolean(patient)} onClose={onClose} title="ملف المريض" subtitle="البيانات الأساسية والسجل الطبي" size="lg">
      {/* Profile */}
      <div className="patient-modal-profile">
        <div className="patient-modal-avatar">{getInitial(patient.name)}</div>
        <div>
          <div className="patient-modal-name">{patient.name ?? '—'}</div>
          <div className="patient-modal-file">#{patient.id}</div>
        </div>
        <span className={`chip ${patient.phone_verified_at ? 'ok' : 'mut'}`}>
          {patient.phone_verified_at ? 'موثق' : 'غير موثق'}
        </span>
      </div>

      {/* Basic info */}
      <div className="patient-modal-grid">
        <div><span>الجوال</span><strong className="num" dir="ltr">{patient.phone}</strong></div>
        <div><span>البريد</span><strong>{patient.email ?? '—'}</strong></div>
        <div><span>تاريخ الميلاد</span><strong>{patient.date_of_birth ?? '—'}</strong></div>
        <div><span>المواعيد</span><strong>{patient.appointments_count ?? 0} موعد</strong></div>
        {patient.height && <div><span>الطول</span><strong className="num">{patient.height} cm</strong></div>}
        {patient.weight && <div><span>الوزن</span><strong className="num">{patient.weight} kg</strong></div>}
      </div>

      {/* Medical history */}
      <div className="patient-modal-history-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Stethoscope size={14} strokeWidth={2} style={{ color: 'var(--brand)' }} />
        السجل الطبي
      </div>
      {isLoading ? (
        <div style={{ color: 'var(--ink-45)', fontSize: 13, padding: '12px 0' }}>جارٍ تحميل السجل...</div>
      ) : appointments.length === 0 ? (
        <div style={{ color: 'var(--ink-45)', fontSize: 13, padding: '12px 0' }}>لا توجد مواعيد مسجلة</div>
      ) : (
        <div>
          {appointments.map(appt => <ApptCard key={appt.id} appt={appt} />)}
        </div>
      )}

      {/* Ratings section */}
      {!isLoading && appointments.filter(a => a.rate).length > 0 && (
        <>
          <div className="patient-modal-history-title" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={14} strokeWidth={2} style={{ color: '#C9A227', fill: '#C9A227' }} />
            التقييمات
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {appointments.filter(a => a.rate).map(appt => (
              <div key={appt.id} style={{
                border: '1px solid var(--line)',
                borderRadius: 12,
                padding: '10px 14px',
                background: 'var(--card)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: appt.comment ? 6 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 1 }}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="13" height="13" viewBox="0 0 24 24"
                          fill={s <= Math.round(appt.rate) ? '#C9A227' : 'none'}
                          stroke="#C9A227" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#C9A227' }}>
                      {Number(appt.rate).toFixed(1)}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-45)' }}>
                    {appt.date}
                    {appt.doctor?.name?.ar && <span> · {appt.doctor.name.ar}</span>}
                  </div>
                </div>
                {appt.comment && (
                  <div style={{ fontSize: 12.5, color: 'var(--ink-70)', fontStyle: 'italic', marginTop: 4 }}>
                    "{appt.comment}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="patient-modal-actions">
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}
