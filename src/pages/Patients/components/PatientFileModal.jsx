import Modal from '../../../components/ui/Modal'
import { usePatientHistory } from '../../../hooks/queries/usePatients'

function getInitial(name) {
  if (!name) return '؟'
  return name.trim().charAt(0).toUpperCase()
}

export default function PatientFileModal({ patient, onClose }) {
  const { data: history, isLoading } = usePatientHistory(patient?.id)

  if (!patient) return null

  const appointments  = history?.appointments  ?? []
  const prescriptions = history?.prescriptions ?? []

  return (
    <Modal open={Boolean(patient)} onClose={onClose} title="ملف المريض" subtitle="البيانات الأساسية والسجل الطبي">
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
      <div className="patient-modal-history-title">السجل الطبي</div>
      {isLoading ? (
        <div style={{ color: 'var(--ink-45)', fontSize: 13 }}>جارٍ تحميل السجل...</div>
      ) : appointments.length === 0 ? (
        <div style={{ color: 'var(--ink-45)', fontSize: 13 }}>لا توجد مواعيد مسجلة</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {appointments.map((appt) => (
            <div key={appt.id} className="patient-modal-history">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{appt.date} — {appt.times}</span>
                <span className={`chip ${appt.status === 'completed' ? 'ok' : 'mut'}`}>
                  {appt.status === 'completed' ? 'مكتمل' : appt.status}
                </span>
              </div>
              {appt.complaint  && <div style={{ fontSize: 12 }}>الشكوى: {appt.complaint}</div>}
              {appt.diagnosis  && <div style={{ fontSize: 12 }}>التشخيص: {appt.diagnosis}</div>}
              {appt.doctor?.name?.ar && <div style={{ fontSize: 12, color: 'var(--ink-45)' }}>{appt.doctor.name.ar}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Prescriptions */}
      {prescriptions.length > 0 && (
        <>
          <div className="patient-modal-history-title" style={{ marginTop: 14 }}>الوصفات الطبية</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {prescriptions.map((rx) => (
              <div key={rx.id} className="patient-modal-history">
                <span style={{ fontWeight: 600 }}>{rx.drug_name}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-45)' }}> — {rx.dosage} — {rx.duration}</span>
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
