import { useState } from 'react'
import Modal from '../../../components/ui/Modal'

const INITIAL = {
  firstName: '',
  lastName:  '',
  email:     '',
  phone:     '',
  password:  '',
  role:      'استقبال',
  branch:    'كل الفروع (مدير النظام)',
  clinic:    '—',
}

export default function NewStaffModal({ open, onClose, onSubmit }) {
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
    <Modal open={open} onClose={handleClose} title="مستخدم جديد" subtitle="أضف حساباً جديداً للنظام">
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="staff-first-name">الاسم الأول</label>
          <input id="staff-first-name" className="inp" placeholder="الاسم الأول"
            value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="staff-last-name">اسم العائلة</label>
          <input id="staff-last-name" className="inp" placeholder="اسم العائلة"
            value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="staff-email">البريد الإلكتروني</label>
        <input id="staff-email" className="inp" placeholder="user@shifa.sa" dir="ltr"
          value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="staff-phone">الجوال</label>
          <input id="staff-phone" className="inp num" placeholder="+966 5X XXX XXXX" dir="ltr"
            value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="staff-password">كلمة المرور الأولية</label>
          <input id="staff-password" className="inp" type="password" placeholder="••••••••"
            value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="staff-role">الدور</label>
        <select id="staff-role" className="inp" value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
          <option>استقبال</option>
          <option>مدير عيادة</option>
          <option>مدير فرع</option>
          <option>مدير النظام</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="staff-branch">الفرع</label>
        <select id="staff-branch" className="inp" value={form.branch} onChange={(e) => handleChange('branch', e.target.value)}>
          <option>كل الفروع (مدير النظام)</option>
          <option>العليا</option>
          <option>النخيل</option>
          <option>الملقا</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="staff-clinic">العيادة (لمدير العيادة فقط)</label>
        <select id="staff-clinic" className="inp" value={form.clinic} onChange={(e) => handleChange('clinic', e.target.value)}>
          <option>—</option>
          <option>باطنة</option>
          <option>جلدية</option>
          <option>أسنان</option>
          <option>أطفال</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit}>إضافة المستخدم</button>
      </div>
    </Modal>
  )
}
