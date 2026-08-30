import { useState } from 'react'
import Modal from '../../../components/ui/Modal'

const INITIAL = {
  name:          '',
  phone:         '',
  email:         '',
  date_of_birth: '',
  height:        '',
  weight:        '',
}

export default function NewPatientModal({ open, onClose, onSubmit, isLoading }) {
  const [form, setForm] = useState(INITIAL)

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  function handleSubmit() { onSubmit(form) }

  function handleClose() { setForm(INITIAL); onClose() }

  return (
    <Modal open={open} onClose={handleClose} title="تسجيل مريض جديد">
      <div className="field">
        <label className="field-label" htmlFor="new-name">الاسم</label>
        <input id="new-name" className="inp" placeholder="اسم المريض" value={form.name} onChange={(e) => update('name', e.target.value)} />
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="new-phone">الجوال *</label>
          <input id="new-phone" className="inp num" dir="ltr" placeholder="+966 5X XXX XXXX" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="new-email">البريد الإلكتروني</label>
          <input id="new-email" className="inp" dir="ltr" placeholder="example@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="new-dob">تاريخ الميلاد</label>
          <input id="new-dob" className="inp" type="date" max={new Date().toISOString().split('T')[0]} value={form.date_of_birth} onChange={(e) => update('date_of_birth', e.target.value)} />
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
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose} disabled={isLoading}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit} disabled={isLoading || !form.phone}>
          {isLoading ? 'جارٍ التسجيل...' : 'تسجيل المريض'}
        </button>
      </div>
    </Modal>
  )
}
