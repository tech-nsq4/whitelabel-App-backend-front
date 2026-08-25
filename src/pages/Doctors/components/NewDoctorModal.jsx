import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import { createDoctorApi } from '../../../api/doctors.api'
import { getClinicsApi } from '../../../api/clinics.api'
import { getSpecializationsApi } from '../../../api/specializations.api'
import { useToast } from '../../../components/ui/Toast'

const INITIAL = {
  nameAr:          '',
  nameEn:          '',
  descAr:          '',
  descEn:          '',
  experience:      '',
  price:           '',
  clinic_id:       '',
  specialization_id: '',
}

export default function NewDoctorModal({ open, onClose, onSubmit }) {
  const { showToast } = useToast()
  const [form, setForm]           = useState(INITIAL)
  const [clinics, setClinics]     = useState([])
  const [specializations, setSpecializations] = useState([])
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    getClinicsApi().then(({ data }) => setClinics(data.data || [])).catch(() => {})
    getSpecializationsApi().then(({ data }) => setSpecializations(data.data || [])).catch(() => {})
  }, [])

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.nameAr.trim()) return showToast('من فضلك أدخل اسم الطبيب', 'error')
    setSaving(true)
    try {
      await createDoctorApi({
        name: { ar: form.nameAr, en: form.nameEn || form.nameAr },
        description: { ar: form.descAr || form.nameAr, en: form.descEn || form.nameEn || form.nameAr },
        experience: Number(form.experience) || 0,
        price: form.price || '0',
        clinic_id: form.clinic_id || clinics[0]?.id,
        specialization_ids: form.specialization_id ? [Number(form.specialization_id)] : [],
        sub_specialization_ids: [],
      })
      onSubmit()
      setForm(INITIAL)
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر إضافة الطبيب', 'error')
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setForm(INITIAL)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="طبيب جديد" subtitle="أضف طبيباً للمجمع">
      <div className="field-row">
        <div className="field">
          <label className="field-label">الاسم بالعربي</label>
          <input className="inp" placeholder="د. أحمد محمد" value={form.nameAr} onChange={(e) => handleChange('nameAr', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">الاسم بالإنجليزي</label>
          <input className="inp" dir="ltr" placeholder="Dr. Ahmed Mohamed" value={form.nameEn} onChange={(e) => handleChange('nameEn', e.target.value)} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">العيادة</label>
          <select className="inp" value={form.clinic_id} onChange={(e) => handleChange('clinic_id', e.target.value)}>
            <option value="">اختر العيادة</option>
            {clinics.map((c) => <option key={c.id} value={c.id}>{c.name?.ar || c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">التخصص</label>
          <select className="inp" value={form.specialization_id} onChange={(e) => handleChange('specialization_id', e.target.value)}>
            <option value="">اختر التخصص</option>
            {specializations.map((s) => <option key={s.id} value={s.id}>{s.title?.ar}</option>)}
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">سعر الكشف</label>
          <input className="inp num" placeholder="350" dir="ltr" value={form.price} onChange={(e) => handleChange('price', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">سنوات الخبرة</label>
          <input className="inp num" placeholder="10" dir="ltr" value={form.experience} onChange={(e) => handleChange('experience', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">الوصف (عربي)</label>
        <textarea className="inp" rows="2" placeholder="استشاري باطنة وقلب..." value={form.descAr} onChange={(e) => handleChange('descAr', e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit} disabled={saving}>إضافة الطبيب</button>
      </div>
    </Modal>
  )
}
