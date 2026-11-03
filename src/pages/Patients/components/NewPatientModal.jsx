import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import { useValidation } from '../../../hooks/useValidation'
import PhoneInput from '../../../components/ui/PhoneInput'
import { useClinics } from '../../../hooks/queries/useClinics'

const INITIAL = {
  name:                  '',
  phone:                 '',
  email:                 '',
  date_of_birth:         '',
  height:                '',
  weight:                '',
  clinic_ids:            [],
  password:              'password',
  password_confirmation: 'password',
  app_lang:              'ar',
}

export default function NewPatientModal({ open, onClose, onSubmit, isLoading }) {
  const [form, setForm] = useState(INITIAL)
  const [apiErrors, setApiErrors] = useState({})
  const { errors, validate, clearError, resetErrors } = useValidation()
  const { data: clinics = [] } = useClinics()

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    clearError(field)
    setApiErrors((e) => { const n = { ...e }; delete n[field]; return n })
  }

  function toggleClinic(id) {
    setForm((f) => {
      const ids = f.clinic_ids.includes(id)
        ? f.clinic_ids.filter((c) => c !== id)
        : [...f.clinic_ids, id]
      return { ...f, clinic_ids: ids }
    })
    setApiErrors((e) => { const n = { ...e }; delete n.clinic_ids; return n })
  }

  function handleSubmit() {
    const ok = validate(form, { phone: 'رقم الجوال مطلوب' })
    if (!ok) return
    if (form.clinic_ids.length === 0) {
      setApiErrors((e) => ({ ...e, clinic_ids: 'يجب اختيار عيادة واحدة على الأقل' }))
      return
    }
    if (form.date_of_birth) {
      const dob = new Date(form.date_of_birth)
      const yesterday = new Date(Date.now() - 86400000)
      if (dob >= yesterday) {
        setApiErrors((e) => ({ ...e, date_of_birth: 'تاريخ الميلاد يجب أن يكون في الماضي' }))
        return
      }
    }
    setApiErrors({})
    onSubmit(form, setApiErrors)
  }

  function handleClose() { setForm(INITIAL); resetErrors(); setApiErrors({}); onClose() }

  return (
    <Modal open={open} onClose={handleClose} title="تسجيل مريض جديد">
      <div className="field">
        <label className="field-label" htmlFor="new-name">الاسم</label>
        <input id="new-name" className="inp" placeholder="اسم المريض" value={form.name} onChange={(e) => update('name', e.target.value)} />
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="new-phone">الجوال *</label>
          <PhoneInput
            id="new-phone"
            value={form.phone}
            onChange={v => update('phone', v)}
            hasError={!!errors.phone || !!apiErrors.phone}
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
          {apiErrors.phone && <span className="field-error">{apiErrors.phone}</span>}
        </div>
        <div className="field">
          <label className="field-label" htmlFor="new-email">البريد الإلكتروني</label>
          <input id="new-email" className={`inp${apiErrors.email ? ' inp--error' : ''}`} dir="ltr" placeholder="example@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
          {apiErrors.email && <span className="field-error">{apiErrors.email}</span>}
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="new-dob">تاريخ الميلاد</label>
          <input id="new-dob" className={`inp${apiErrors.date_of_birth ? ' inp--error' : ''}`} type="date" 
            max={new Date(Date.now() - 86400000).toISOString().split('T')[0]}
            value={form.date_of_birth} onChange={(e) => update('date_of_birth', e.target.value)} />
          {apiErrors.date_of_birth && <span className="field-error">{apiErrors.date_of_birth}</span>}
        </div>
        <div className="field">
          <label className="field-label" htmlFor="new-height">الطول (cm)</label>
          <input id="new-height" className="inp num" dir="ltr" placeholder="170" value={form.height} onChange={(e) => update('height', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="new-weight">الوزن (kg)</label>
          <input id="new-weight" className="inp num" dir="ltr" placeholder="70" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
        </div>
      </div>

      {/* Clinic selector */}
      <div className="field">
        <label className="field-label">العيادة *</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {clinics.map((clinic) => {
            const selected = form.clinic_ids.includes(clinic.id)
            return (
              <button
                key={clinic.id}
                type="button"
                onClick={() => toggleClinic(clinic.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: `1.5px solid ${selected ? 'var(--primary, #0F6B5C)' : '#d1d5db'}`,
                  background: selected ? 'var(--primary, #0F6B5C)' : '#fff',
                  color: selected ? '#fff' : 'var(--ink-70, #444)',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {clinic.name?.ar || clinic.name || `عيادة ${clinic.id}`}
              </button>
            )
          })}
        </div>
        {apiErrors.clinic_ids && <span className="field-error">{apiErrors.clinic_ids}</span>}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose} disabled={isLoading}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'جارٍ التسجيل...' : 'تسجيل المريض'}
        </button>
      </div>
    </Modal>
  )
}
