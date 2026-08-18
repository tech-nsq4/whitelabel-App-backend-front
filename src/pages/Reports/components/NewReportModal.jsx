import { useState } from 'react'
import Modal from '../../../components/ui/Modal'

const INITIAL = {
  type:     'إيرادات مفصّلة',
  dateFrom: '2026-07-01',
  dateTo:   '2026-07-31',
  branch:   'كل الفروع',
  specialty:'كل التخصصات',
  format:   'PDF',
}

export default function NewReportModal({ open, onClose, onSubmit }) {
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
    <Modal open={open} onClose={handleClose} title="تقرير مخصص" subtitle="أنشئ تقريراً حسب احتياجك">
      <div className="field">
        <label className="field-label">نوع التقرير</label>
        <select className="inp" value={form.type} onChange={(e) => handleChange('type', e.target.value)}>
          <option>إيرادات مفصّلة</option>
          <option>مصروفات</option>
          <option>مطالبات تأمين</option>
          <option>زيارات وحجوزات</option>
          <option>أداء الأطباء</option>
          <option>مقارنة الفروع</option>
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">من تاريخ</label>
          <input className="inp num" type="date"
            value={form.dateFrom} onChange={(e) => handleChange('dateFrom', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">إلى تاريخ</label>
          <input className="inp num" type="date"
            value={form.dateTo} onChange={(e) => handleChange('dateTo', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">الفرع</label>
        <select className="inp" value={form.branch} onChange={(e) => handleChange('branch', e.target.value)}>
          <option>كل الفروع</option>
          <option>العليا</option>
          <option>النخيل</option>
          <option>الملقا</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label">التخصص</label>
        <select className="inp" value={form.specialty} onChange={(e) => handleChange('specialty', e.target.value)}>
          <option>كل التخصصات</option>
          <option>باطنة</option>
          <option>جلدية</option>
          <option>أسنان</option>
          <option>أطفال</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label">صيغة التصدير</label>
        <select className="inp" value={form.format} onChange={(e) => handleChange('format', e.target.value)}>
          <option>PDF</option>
          <option>Excel</option>
          <option>CSV</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit}>إنشاء التقرير</button>
      </div>
    </Modal>
  )
}
