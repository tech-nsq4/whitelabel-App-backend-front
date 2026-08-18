import { useState } from 'react'
import Modal from '../../../components/ui/Modal'

const INITIAL = {
  firstName: '',
  lastName:  '',
  idNo:      '',
  phone:     '',
  gender:    'ذكر',
  birthDate: '',
  insurance: 'بدون تأمين',
}

export default function NewPatientModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit() {
    onSubmit(form)
    setForm(INITIAL)
  }

  function handleClose() {
    setForm(INITIAL)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="تسجيل مريض جديد">
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="patient-first-name">الاسم الأول</label>
          <input
            id="patient-first-name"
            className="inp"
            placeholder="الاسم الأول"
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="patient-last-name">اسم العائلة</label>
          <input
            id="patient-last-name"
            className="inp"
            placeholder="اسم العائلة"
            value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="patient-id-no">رقم الهوية</label>
          <input
            id="patient-id-no"
            className="inp num"
            placeholder="10 أرقام"
            dir="ltr"
            value={form.idNo}
            onChange={(e) => handleChange('idNo', e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="patient-phone">الجوال</label>
          <input
            id="patient-phone"
            className="inp num"
            placeholder="+966 5X XXX XXXX"
            dir="ltr"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="patient-gender">الجنس</label>
          <select id="patient-gender" className="inp" value={form.gender} onChange={(e) => handleChange('gender', e.target.value)}>
            <option>ذكر</option>
            <option>أنثى</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="patient-birth-date">تاريخ الميلاد</label>
          <input
            id="patient-birth-date"
            className="inp num"
            type="date"
            value={form.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="patient-insurance">شركة التأمين (اختياري)</label>
        <select id="patient-insurance" className="inp" value={form.insurance} onChange={(e) => handleChange('insurance', e.target.value)}>
          <option>بدون تأمين</option>
          <option>بوبا العربية</option>
          <option>التعاونية</option>
          <option>ميدغلف</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit}>تسجيل المريض</button>
      </div>
    </Modal>
  )
}
