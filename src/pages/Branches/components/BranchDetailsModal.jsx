import Modal from '../../../components/ui/Modal'

export default function BranchDetailsModal({ branch, onClose }) {
  if (!branch) return null
  return <Modal open={Boolean(branch)} onClose={onClose} title="تفاصيل الفرع" subtitle="ملخص تشغيل الفرع وبيانات التواصل">
    <div className="branch-modal-hero"><div className="branch-modal-icon">ف</div><div><div className="branch-modal-name">{branch.name}</div><div className="branch-modal-city">{branch.city}</div></div><span className="chip ok">نشط</span></div>
    <div className="branch-modal-contact"><span>العنوان</span><strong>{branch.address}</strong><small dir="ltr">{branch.phone}</small></div>
    <div className="branch-modal-stats"><div><strong>{branch.clinics}</strong><span>عيادات</span></div><div><strong>{branch.doctors}</strong><span>أطباء</span></div><div><strong>{branch.patients}</strong><span>مرضى</span></div><div><strong>{branch.revenue}</strong><span>إيرادات</span></div></div>
    <div className="branch-modal-actions"><button className="btn btn-p" onClick={onClose}>تم</button></div>
  </Modal>
}
