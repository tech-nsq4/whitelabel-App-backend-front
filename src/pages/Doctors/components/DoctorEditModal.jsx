import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import { updateDoctorApi } from '../../../api/doctors.api'
import { useToast } from '../../../components/ui/Toast'

export default function DoctorEditModal({ open, onClose, doctor, onSave }) {
  const { showToast } = useToast()
  const [form, setForm]   = useState({ nameAr: '', nameEn: '', descAr: '', experience: '', price: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (doctor) setForm({
      nameAr:     doctor.name?.ar || '',
      nameEn:     doctor.name?.en || '',
      descAr:     doctor.description?.ar || '',
      experience: doctor.experience || '',
      price:      doctor.price || '',
    })
  }, [doctor])

  if (!doctor) return null

  async function handleSave() {
    setSaving(true)
    try {
      await updateDoctorApi(doctor.id, {
        name: { ar: form.nameAr, en: form.nameEn || form.nameAr },
        description: { ar: form.descAr, en: form.descAr },
        experience: Number(form.experience) || 0,
        price: form.price,
        clinic_id: doctor.clinic_id,
        specialization_ids: doctor.specializations?.map((s) => s.id) || [],
        sub_specialization_ids: [],
      })
      showToast('تم حفظ التغييرات')
      onSave && onSave()
      onClose()
    } catch {
      showToast('تعذر حفظ التغييرات', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="تعديل بيانات الطبيب" subtitle={form.nameAr}>
      <div className="field-row">
        <div className="field">
          <label className="field-label">الاسم بالعربي</label>
          <input className="inp" value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} />
        </div>
        <div className="field">
          <label className="field-label">الاسم بالإنجليزي</label>
          <input className="inp" dir="ltr" value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field-label">سعر الكشف</label>
          <input className="inp num" dir="ltr" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
        </div>
        <div className="field">
          <label className="field-label">سنوات الخبرة</label>
          <input className="inp num" dir="ltr" value={form.experience} onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))} />
        </div>
      </div>
      <div className="field">
        <label className="field-label">الوصف</label>
        <textarea className="inp" rows="2" value={form.descAr} onChange={(e) => setForm((p) => ({ ...p, descAr: e.target.value }))} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={onClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSave} disabled={saving}>حفظ التغييرات</button>
      </div>
    </Modal>
  )
}
