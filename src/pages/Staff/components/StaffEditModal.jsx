import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'

export default function StaffEditModal({ open, onClose, member, onSave }) {
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (member) setForm({ ...member })
  }, [member])

  if (!member || !form) return null

  function set(field, val) { setForm(p => ({ ...p, [field]: val })) }

  return (
    <Modal open={open} onClose={onClose} title="تعديل المستخدم" subtitle={form.name}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="field">
          <label className="field-label">الاسم</label>
          <input className="inp" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">البريد الإلكتروني</label>
          <input className="inp" dir="ltr" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="field">
          <label className="field-label">الدور</label>
          <select className="inp" value={form.role} onChange={e => {
            const labels = { admin: 'مدير النظام', branch_manager: 'مدير فرع', clinic_manager: 'مدير عيادة', reception: 'استقبال' }
            const chips  = { admin: 'info', branch_manager: 'ok', clinic_manager: 'warn', reception: 'mut' }
            set('role', e.target.value)
            set('roleLabel', labels[e.target.value])
            set('roleChip', chips[e.target.value])
          }}>
            <option value="admin">مدير النظام</option>
            <option value="branch_manager">مدير فرع</option>
            <option value="clinic_manager">مدير عيادة</option>
            <option value="reception">استقبال</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">الفرع</label>
          <select className="inp" value={form.branch} onChange={e => set('branch', e.target.value)}>
            <option>كل الفروع</option>
            <option>العليا</option>
            <option>النخيل</option>
            <option>الملقا</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label">الحالة</label>
        <select className="inp" value={form.status} onChange={e => set('status', e.target.value)}>
          <option value="active">نشط</option>
          <option value="disabled">معطّل</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={onClose}>إلغاء</button>
        <button className="btn btn-p" onClick={() => { onSave(form); onClose() }}>حفظ التغييرات</button>
      </div>
    </Modal>
  )
}
