import { useState } from 'react'
import Modal from '../../../components/ui/Modal'

const INITIAL = {
  patient:  '',
  service:  'كشف باطنة عام — 150 ر.س',
  doctor:   'د. خالد العتيبي',
  branch:   'العليا',
  amount:   '150',
  discount: '0',
  method:   'نقدي',
  notes:    '',
}

export default function NewInvoiceModal({ open, onClose, onSubmit }) {
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
    <Modal open={open} onClose={handleClose} title="فاتورة جديدة" subtitle="إنشاء فاتورة يدوية">
      <div className="field">
        <label className="field-label" htmlFor="inv-patient">المريض</label>
        <input
          id="inv-patient"
          className="inp"
          placeholder="ابحث بالاسم أو رقم الملف…"
          value={form.patient}
          onChange={(e) => handleChange('patient', e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="inv-service">الخدمة</label>
        <select id="inv-service" className="inp" value={form.service} onChange={(e) => handleChange('service', e.target.value)}>
          <option>كشف باطنة عام — 150 ر.س</option>
          <option>كشف جلدية — 180 ر.س</option>
          <option>كشف أسنان — 100 ر.س</option>
          <option>تحليل CBC — 45 ر.س</option>
          <option>أشعة صدر — 120 ر.س</option>
          <option>تنظيف أسنان — 250 ر.س</option>
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="inv-doctor">الطبيب</label>
          <select id="inv-doctor" className="inp" value={form.doctor} onChange={(e) => handleChange('doctor', e.target.value)}>
            <option>د. خالد العتيبي</option>
            <option>د. سارة الحربي</option>
            <option>د. عبدالله السالم</option>
            <option>د. رهف العنزي</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="inv-branch">الفرع</label>
          <select id="inv-branch" className="inp" value={form.branch} onChange={(e) => handleChange('branch', e.target.value)}>
            <option>العليا</option>
            <option>النخيل</option>
            <option>الملقا</option>
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="inv-amount">المبلغ (ر.س)</label>
          <input
            id="inv-amount"
            className="inp num"
            dir="ltr"
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="inv-discount">الخصم (ر.س)</label>
          <input
            id="inv-discount"
            className="inp num"
            dir="ltr"
            value={form.discount}
            onChange={(e) => handleChange('discount', e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="inv-method">طريقة الدفع</label>
        <select id="inv-method" className="inp" value={form.method} onChange={(e) => handleChange('method', e.target.value)}>
          <option>نقدي</option>
          <option>مدى</option>
          <option>Apple Pay</option>
          <option>تأمين</option>
          <option>محفظة</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="inv-notes">ملاحظات</label>
        <textarea
          id="inv-notes"
          className="inp"
          rows="2"
          placeholder="ملاحظات إضافية…"
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit}>إنشاء الفاتورة</button>
      </div>
    </Modal>
  )
}
