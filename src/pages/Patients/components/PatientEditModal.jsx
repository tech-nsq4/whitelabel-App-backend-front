import { useEffect, useState } from 'react'
import Modal from '../../../components/ui/Modal'
import { useUpdatePatient } from '../../../hooks/queries/usePatients'
import { useToast } from '../../../components/ui/Toast'
import { useValidation } from '../../../hooks/useValidation'
import PhoneInput, { normalizeSaudiPhone } from '../../../components/ui/PhoneInput'

const toForm = (p) => ({
  name:          p?.name          ?? '',
  phone:         normalizeSaudiPhone(p?.phone ?? ''),
  email:         p?.email         ?? '',
  date_of_birth: p?.date_of_birth ?? '',
  height:        p?.height        ?? '',
  weight:        p?.weight        ?? '',
})

export default function PatientEditModal({ patient, onClose, onSave }) {
  const { showToast }  = useToast()
  const updatePatient  = useUpdatePatient()
  const [form, setForm] = useState(toForm(patient))
  const { errors, validate, clearError, resetErrors } = useValidation()

  useEffect(() => { setForm(toForm(patient)) }, [patient])
  if (!patient) return null

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); clearError(field) }

  function handleSave() {
    const ok = validate(form, { name: 'الاسم مطلوب' })
    if (!ok) return
    updatePatient.mutate({ id: patient.id, data: form }, {
      onSuccess: () => { showToast('تم تحديث بيانات المريض'); resetErrors(); onClose() },
      onError:   () => showToast('حدث خطأ أثناء التحديث'),
    })
  }

  return (
    <Modal open={Boolean(patient)} onClose={onClose} title="تعديل بيانات المريض" subtitle="تحديث بيانات التواصل والمعلومات الصحية">
      <div className="field">
        <label className="field-label" htmlFor="edit-name">الاسم</label>
        <input id="edit-name" className={`inp${errors.name ? ' inp--error' : ''}`} value={form.name} onChange={(e) => update('name', e.target.value)} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="edit-phone">الجوال</label>
          <PhoneInput id="edit-phone" value={form.phone} onChange={v => update('phone', v)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="edit-email">البريد الإلكتروني</label>
          <input id="edit-email" className="inp" dir="ltr" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="edit-dob">تاريخ الميلاد</label>
          <input id="edit-dob" className="inp" type="date" value={form.date_of_birth} onChange={(e) => update('date_of_birth', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="edit-height">الطول (cm)</label>
          <input id="edit-height" className="inp num" dir="ltr" value={form.height} onChange={(e) => update('height', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="edit-weight">الوزن (kg)</label>
          <input id="edit-weight" className="inp num" dir="ltr" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
        </div>
      </div>
      <div className="patient-modal-actions">
        <button className="btn btn-q" onClick={onClose} disabled={updatePatient.isPending}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSave} disabled={updatePatient.isPending}>
          {updatePatient.isPending ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </Modal>
  )
}
