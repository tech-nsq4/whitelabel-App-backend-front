import { useState } from 'react'
import Modal from '../../../components/ui/Modal'

const INITIAL = {
  patient:   '',
  branch:    'العليا',
  specialty: 'باطنة',
  doctor:    'د. خالد العتيبي',
  date:      '2026-08-05',
  time:      '10:00 ص',
  visitType: 'كشف عيادة',
}

export default function BookingModal({ open, onClose, onSubmit }) {
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
    <Modal open={open} onClose={handleClose} title="حجز جديد" subtitle="حجز موعد لمريض">
      <div className="field">
        <label className="field-label" htmlFor="booking-patient">المريض</label>
        <input
          id="booking-patient"
          className="inp"
          placeholder="ابحث بالاسم أو رقم الملف…"
          value={form.patient}
          onChange={(e) => handleChange('patient', e.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="booking-branch">الفرع</label>
          <select id="booking-branch" className="inp" value={form.branch} onChange={(e) => handleChange('branch', e.target.value)}>
            <option>العليا</option>
            <option>النخيل</option>
            <option>الملقا</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="booking-specialty">التخصص</label>
          <select id="booking-specialty" className="inp" value={form.specialty} onChange={(e) => handleChange('specialty', e.target.value)}>
            <option>باطنة</option>
            <option>جلدية</option>
            <option>أسنان</option>
            <option>أطفال</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="booking-doctor">الطبيب</label>
        <select id="booking-doctor" className="inp" value={form.doctor} onChange={(e) => handleChange('doctor', e.target.value)}>
          <option>د. خالد العتيبي</option>
          <option>د. سارة الحربي</option>
          <option>د. عبدالله السالم</option>
          <option>د. رهف العنزي</option>
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="booking-date">التاريخ</label>
          <input
            id="booking-date"
            className="inp num"
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="booking-time">الوقت</label>
          <select id="booking-time" className="inp" value={form.time} onChange={(e) => handleChange('time', e.target.value)}>
            <option>10:00 ص</option>
            <option>10:30 ص</option>
            <option>11:00 ص</option>
            <option>11:30 ص</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="booking-visit-type">نوع الزيارة</label>
        <select id="booking-visit-type" className="inp" value={form.visitType} onChange={(e) => handleChange('visitType', e.target.value)}>
          <option>كشف عيادة</option>
          <option>استشارة عن بعد</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit}>تأكيد الحجز</button>
      </div>
    </Modal>
  )
}
