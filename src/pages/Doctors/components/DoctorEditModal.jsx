import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'

const BRANCHES = ['العليا', 'النخيل', 'الملقا']

export default function DoctorEditModal({ open, onClose, doctor, onSave }) {
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (doctor) setForm({ ...doctor })
  }, [doctor])

  if (!doctor || !form) return null

  function set(field, val) { setForm(p => ({ ...p, [field]: val })) }

  function toggleBranch(b) {
    const current = form.branch.split(' · ')
    const next = current.includes(b) ? current.filter(x => x !== b) : [...current, b]
    set('branch', next.join(' · '))
  }

  return (
    <Modal open={open} onClose={onClose} title="تعديل بيانات الطبيب" subtitle={form.name}>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="field">
          <label className="field-label">الاسم</label>
          <input className="inp" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">التخصص</label>
          <select className="inp" value={form.specialty} onChange={e => set('specialty', e.target.value)}>
            {['باطنة عامة','جلدية','أسنان','أطفال','نساء وولادة','عظام','عيون','أنف وأذن'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="field">
          <label className="field-label">الجوال</label>
          <input className="inp num" dir="ltr" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">تاريخ انتهاء الرخصة</label>
          <input className="inp num" value={form.license} onChange={e => set('license', e.target.value)} />
        </div>
      </div>

      <div className="field mb-4">
        <label className="field-label">الفروع</label>
        <div className="flex gap-3 mt-1">
          {BRANCHES.map(b => (
            <label key={b} className="flex items-center gap-1.5 text-[12.5px] cursor-pointer">
              <input type="checkbox" checked={form.branch.includes(b)} onChange={() => toggleBranch(b)} />
              {b}
            </label>
          ))}
        </div>
      </div>

      <div className="field mb-4">
        <label className="field-label">الحالة</label>
        <select className="inp" value={form.status} onChange={e => set('status', e.target.value)}>
          <option value="active">نشط</option>
          <option value="leave">إجازة</option>
          <option value="inactive">غير نشط</option>
        </select>
      </div>

      <div className="flex gap-2 justify-end mt-2">
        <button className="btn btn-q" onClick={onClose}>إلغاء</button>
        <button className="btn btn-p" onClick={() => { onSave(form); onClose() }}>حفظ التغييرات</button>
      </div>
    </Modal>
  )
}
