import Modal from '../../../components/ui/Modal'

export default function PatientFileModal({ patient, onClose }) {
  if (!patient) return null

  return (
    <Modal open={Boolean(patient)} onClose={onClose} title="ملف المريض" subtitle="البيانات الأساسية وسجل الزيارات">
      <div className="patient-modal-profile">
        <div className="patient-modal-avatar">{patient.initial}</div>
        <div><div className="patient-modal-name">{patient.name}</div><div className="patient-modal-file">{patient.fileNo}</div></div>
        <span className={`chip ${patient.status === 'vip' ? 'info' : 'ok'}`}>{patient.status === 'vip' ? 'VIP' : 'نشط'}</span>
      </div>
      <div className="patient-modal-grid">
        <div><span>رقم الهوية</span><strong className="num">{patient.idNo}</strong></div>
        <div><span>رقم الجوال</span><strong className="num" dir="ltr">{patient.phone}</strong></div>
        <div><span>آخر زيارة</span><strong>{patient.lastVisit}</strong></div>
        <div><span>إجمالي الزيارات</span><strong>{patient.visits} زيارة</strong></div>
      </div>
      <div className="patient-modal-history-title">ملخص السجل</div>
      <div className="patient-modal-history"><span>آخر زيارة: {patient.lastVisit}</span><strong>يمكن متابعة الزيارات والوصفات من ملف المريض الكامل.</strong></div>
      <div className="patient-modal-actions"><button className="btn btn-q" onClick={onClose}>إغلاق</button><button className="btn btn-p" onClick={onClose}>تم</button></div>
    </Modal>
  )
}
