import Modal from '../../../components/ui/Modal'

const BRANCHES = { olaya: 'العليا', nakheel: 'النخيل', malqa: 'الملقا' }

export default function AppointmentDetailsModal({ appointment, doctor, onClose, onViewPatient }) {
  if (!appointment || !doctor) return null

  return (
    <Modal open={Boolean(appointment)} onClose={onClose} title="تفاصيل الحجز" subtitle="موعد مؤكد ضمن جدول اليوم">
      <div className="appointment-detail-hero" style={{ '--doctor-color': doctor.color }}>
        <div className="appointment-detail-avatar">{appointment.patientName.charAt(0)}</div>
        <div>
          <div className="appointment-detail-name">{appointment.patientName}</div>
          <div className="appointment-detail-id">موعد #{appointment.id.toString().padStart(4, '0')}</div>
        </div>
        <span className="chip ok">مؤكد</span>
      </div>
      <div className="appointment-detail-grid">
        <div className="appointment-detail-item"><span>الطبيب</span><strong>{doctor.name}</strong><small>{doctor.specialty}</small></div>
        <div className="appointment-detail-item"><span>الفرع</span><strong>{BRANCHES[appointment.branch]}</strong><small>مجمع الشفاء</small></div>
        <div className="appointment-detail-item"><span>التوقيت</span><strong>{appointment.time}</strong><small>الأحد 4 أغسطس 2026</small></div>
        <div className="appointment-detail-item"><span>نوع الزيارة</span><strong>كشف عيادة</strong><small>موعد حضوري</small></div>
      </div>
      <div className="appointment-detail-actions">
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
        <button className="btn btn-p" onClick={onViewPatient}>فتح ملف المريض</button>
      </div>
    </Modal>
  )
}
