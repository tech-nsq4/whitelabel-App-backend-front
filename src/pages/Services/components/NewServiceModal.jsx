import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { getSpecializationsApi } from '../../../api/specializations.api'
import { createSubSpecializationApi } from '../../../api/sub-specializations.api'
import { useValidation } from '../../../hooks/useValidation'
import SpecSelect from '../../../components/ui/SpecSelect'

const INITIAL = {
  specialization_id: '',
  nameAr:            '',
  nameEn:            '',
  descAr:            '',
}

export default function NewServiceModal({ open, onClose, onSubmit }) {
  const { showToast } = useToast()
  const [form, setForm]             = useState(INITIAL)
  const [specializations, setSpecs] = useState([])
  const [saving, setSaving]         = useState(false)
  const { errors, validate, clearError, resetErrors } = useValidation()

  useEffect(() => {
    getSpecializationsApi()
      .then(({ data }) => setSpecs(data.data || []))
      .catch(() => {})
  }, [])

  const specOptions = specializations.map(s => ({ id: s.id, label: s.title?.ar || s.title }))

  function set(field, value) {
    setForm(p => ({ ...p, [field]: value }))
    clearError(field)
  }

  async function handleSubmit() {
    const ok = validate(form, {
      specialization_id: 'اختر التخصص',
      nameAr:            'اسم الخدمة (عربي) مطلوب',
    })
    if (!ok) return
    setSaving(true)
    try {
      await createSubSpecializationApi({
        specialization_id: Number(form.specialization_id),
        title: { ar: form.nameAr, en: form.nameEn || form.nameAr },
        description: { ar: form.descAr || form.nameAr, en: form.nameEn || form.nameAr },
      })
      showToast('تم إضافة الخدمة بنجاح', 'success')
      setForm(INITIAL)
      resetErrors()
      onSubmit()
    } catch (err) {
      showToast(err?.response?.data?.message || 'تعذر إضافة الخدمة', 'error')
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setForm(INITIAL)
    resetErrors()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="خدمة جديدة" subtitle="أضف خدمة طبية جديدة للكتالوج">
      <div className="field">
        <label className="field-label">التخصص</label>
        <SpecSelect
          value={form.specialization_id}
          onChange={v => set('specialization_id', v)}
          options={specOptions}
          placeholder="اختر التخصص"
          hasError={!!errors.specialization_id}
        />
        {errors.specialization_id && <span className="field-error">{errors.specialization_id}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">اسم الخدمة (عربي)</label>
          <input
            className={`inp${errors.nameAr ? ' inp--error' : ''}`}
            placeholder="مثال: كشف عام"
            value={form.nameAr}
            onChange={e => set('nameAr', e.target.value)}
          />
          {errors.nameAr && <span className="field-error">{errors.nameAr}</span>}
        </div>
        <div className="field">
          <label className="field-label">اسم الخدمة (إنجليزي)</label>
          <input
            className="inp"
            placeholder="General Checkup"
            dir="ltr"
            value={form.nameEn}
            onChange={e => set('nameEn', e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">الوصف (اختياري)</label>
        <textarea
          className="inp"
          rows={2}
          placeholder="وصف مختصر للخدمة..."
          value={form.descAr}
          onChange={e => set('descAr', e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit} disabled={saving}>
          {saving ? 'جاري الإضافة...' : 'إضافة الخدمة'}
        </button>
      </div>
    </Modal>
  )
}
