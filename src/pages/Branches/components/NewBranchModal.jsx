import { useState } from 'react'
import Modal from '../../../components/ui/Modal'

const INITIAL = {
  name:      '',
  city:      'الرياض',
  phone:     '',
  address:   '',
  manager:   'اختر مديراً…',
  status:    'نشط',
  openTime:  '08:00',
  closeTime: '22:00',
}

export default function NewBranchModal({ open, onClose, onSubmit }) {
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
    <Modal open={open} onClose={handleClose} title="فرع جديد" subtitle="أضف فرعاً جديداً للمجمع">
      <div className="field">
        <label className="field-label" htmlFor="branch-name">اسم الفرع</label>
        <input
          id="branch-name"
          className="inp"
          placeholder="مثال: فرع حي الياسمين"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="branch-city">المدينة</label>
          <select id="branch-city" className="inp" value={form.city} onChange={(e) => handleChange('city', e.target.value)}>
            <option>الرياض</option>
            <option>جدة</option>
            <option>الدمام</option>
            <option>مكة</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="branch-phone">هاتف الفرع</label>
          <input
            id="branch-phone"
            className="inp num"
            placeholder="+966 11 XXX XXXX"
            dir="ltr"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="branch-address">العنوان التفصيلي</label>
        <input
          id="branch-address"
          className="inp"
          placeholder="الحي، الشارع، رقم المبنى"
          value={form.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="branch-manager">مدير الفرع</label>
          <select id="branch-manager" className="inp" value={form.manager} onChange={(e) => handleChange('manager', e.target.value)}>
            <option>اختر مديراً…</option>
            <option>تركي المالكي</option>
            <option>مها العنزي</option>
            <option>عادل السبيعي</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="branch-status">الحالة</label>
          <select id="branch-status" className="inp" value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
            <option>نشط</option>
            <option>متوقف مؤقتاً</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label">ساعات العمل</label>
        <div className="field-row">
          <input
            id="branch-open-time"
            className="inp num"
            type="time"
            value={form.openTime}
            onChange={(e) => handleChange('openTime', e.target.value)}
          />
          <input
            id="branch-close-time"
            className="inp num"
            type="time"
            value={form.closeTime}
            onChange={(e) => handleChange('closeTime', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit}>إضافة الفرع</button>
      </div>
    </Modal>
  )
}
