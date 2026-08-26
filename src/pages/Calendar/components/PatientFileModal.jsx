import Modal from "../../../components/ui/Modal";

export default function PatientFileModal({ appointment, doctor, onClose }) {
  if (!appointment || !doctor) return null;
  const fileNumber = `#${(30000 + appointment.id).toString()}`;

  return (
    <Modal
      open={Boolean(appointment)}
      onClose={onClose}
      title="ملف المريض"
      subtitle="نظرة سريعة على البيانات والسجل الطبي"
    >
      <div className="patient-file-profile">
        <div className="patient-file-avatar">
          {appointment.patientName.charAt(0)}
        </div>
        <div>
          <div className="patient-file-name">{appointment.patientName}</div>
          <div className="patient-file-number">رقم الملف {fileNumber}</div>
        </div>
        <span className="chip ok">نشط</span>
      </div>
      <div className="patient-file-stats">
        <div>
          <span>الزيارة الحالية</span>
          <strong>{appointment.time}</strong>
        </div>
        <div>
          <span>الطبيب</span>
          <strong>{doctor.name}</strong>
        </div>
        <div>
          <span>التخصص</span>
          <strong>{doctor.specialty}</strong>
        </div>
      </div>
      <div className="patient-file-section-title">آخر الزيارات</div>
      <div className="patient-file-history">
        <div>
          <span>اليوم · {appointment.time}</span>
          <strong>كشف عيادة مع {doctor.name}</strong>
        </div>
        <div>
          <span>18 يوليو 2026</span>
          <strong>متابعة دورية</strong>
        </div>
        <div>
          <span>4 يونيو 2026</span>
          <strong>زيارة عيادة</strong>
        </div>
      </div>
      <div className="appointment-detail-actions">
        <button className="btn btn-p" onClick={onClose}>
          تم
        </button>
      </div>
    </Modal>
  );
}
