import { useState } from 'react'
import Modal from '../../../components/ui/Modal'

const INITIAL = { name: '', branch: 'العليا', clinic: 'باطنة', doctor: 'د. خالد العتيبي', visitType: 'كشف عام', notes: '' }

export default function WalkInModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit() {
    if (!form.name.trim()) return
    onSubmit(form)
    setForm(INITIAL)
  }

  function handleClose() {
    setForm(INITIAL)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="تسجيل حضور" subtitle="أضف مريضاً للطابور مباشرة">
      <div className="field">
        <label className="field-label" htmlFor="walkin-patient">المريض</label>
        <input
          id="walkin-patient"
          className="inp"
          placeholder="ابحث بالاسم أو رقم الملف…"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="walkin-branch">الفرع</label>
          <select id="walkin-branch" className="inp" value={form.branch} onChange={(e) => handleChange('branch', e.target.value)}>
            <option>العليا</option>
            <option>النخيل</option>
            <option>الملقا</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="walkin-clinic">العيادة</label>
          <select id="walkin-clinic" className="inp" value={form.clinic} onChange={(e) => handleChange('clinic', e.target.value)}>
            <option>باطنة</option>
            <option>جلدية</option>
            <option>أسنان</option>
            <option>أطفال</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="walkin-doctor">الطبيب</label>
        <select id="walkin-doctor" className="inp" value={form.doctor} onChange={(e) => handleChange('doctor', e.target.value)}>
          <option>د. خالد العتيبي</option>
          <option>د. سارة الحربي</option>
          <option>د. عبدالله السالم</option>
          <option>د. رهف العنزي</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="walkin-visit-type">نوع الزيارة</label>
        <select id="walkin-visit-type" className="inp" value={form.visitType} onChange={(e) => handleChange('visitType', e.target.value)}>
          <option>كشف عام</option>
          <option>إعادة كشف</option>
          <option>استشارة سريعة</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="walkin-notes">ملاحظات</label>
        <textarea
          id="walkin-notes"
          className="inp"
          rows={2}
          placeholder="أي ملاحظات…"
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit}>تسجيل في الطابور</button>
      </div>
    </Modal>
  )
}
