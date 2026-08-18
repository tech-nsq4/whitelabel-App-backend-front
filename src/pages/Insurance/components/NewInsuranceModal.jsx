import { useState } from 'react'
import Modal from '../../../components/ui/Modal'

const INITIAL = {
  name:       '',
  contractNo: '',
  expiry:     '',
  coverage:   '80%',
  contact:    '',
  phone:      '',
}

export default function NewInsuranceModal({ open, onClose, onSubmit }) {
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
    <Modal open={open} onClose={handleClose} title="شركة تأمين جديدة" subtitle="إضافة شركة تأمين متعاقدة">
      <div className="field">
        <label className="field-label">اسم الشركة</label>
        <input className="inp" placeholder="مثال: بوبا العربية"
          value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">رقم العقد</label>
          <input className="inp num" placeholder="INS-XXXXX" dir="ltr"
            value={form.contractNo} onChange={(e) => handleChange('contractNo', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">تاريخ انتهاء العقد</label>
          <input className="inp num" type="date"
            value={form.expiry} onChange={(e) => handleChange('expiry', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">نسبة التغطية الافتراضية</label>
        <select className="inp" value={form.coverage} onChange={(e) => handleChange('coverage', e.target.value)}>
          <option>80%</option>
          <option>90%</option>
          <option>100%</option>
          <option>70%</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label">جهة الاتصال</label>
        <input className="inp" placeholder="اسم المسؤول"
          value={form.contact} onChange={(e) => handleChange('contact', e.target.value)} />
      </div>

      <div className="field">
        <label className="field-label">هاتف التواصل</label>
        <input className="inp num" placeholder="+966 XX XXX XXXX" dir="ltr"
          value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit}>إضافة الشركة</button>
      </div>
    </Modal>
  )
}
