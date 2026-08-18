import { useEffect, useState } from 'react'
import Modal from '../../../components/ui/Modal'

export default function PatientEditModal({ patient, onClose, onSave }) {
  const [form, setForm] = useState(patient)

  useEffect(() => { setForm(patient) }, [patient])
  if (!patient || !form) return null

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })) }

  return (
    <Modal open={Boolean(patient)} onClose={onClose} title="تعديل بيانات المريض" subtitle="تحديث بيانات التواصل والهوية">
      <div className="field"><label className="field-label" htmlFor="edit-patient-name">اسم المريض</label><input id="edit-patient-name" className="inp" value={form.name} onChange={(event) => update('name', event.target.value)} /></div>
      <div className="field-row">
        <div className="field"><label className="field-label" htmlFor="edit-patient-id">رقم الهوية</label><input id="edit-patient-id" className="inp num" dir="ltr" value={form.idNo} onChange={(event) => update('idNo', event.target.value)} /></div>
        <div className="field"><label className="field-label" htmlFor="edit-patient-phone">رقم الجوال</label><input id="edit-patient-phone" className="inp num" dir="ltr" value={form.phone} onChange={(event) => update('phone', event.target.value)} /></div>
      </div>
      <div className="patient-modal-actions"><button className="btn btn-q" onClick={onClose}>إلغاء</button><button className="btn btn-p" onClick={() => onSave(form)}>حفظ التغييرات</button></div>
    </Modal>
  )
}
