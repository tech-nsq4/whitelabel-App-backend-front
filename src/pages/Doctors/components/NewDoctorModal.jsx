import { useState } from 'react'
import Modal from '../../../components/ui/Modal'

const INITIAL = {
  firstName:      '',
  lastName:       '',
  specialty:      'باطنة عامة',
  phone:          '',
  email:          '',
  branches:       { العليا: true, النخيل: false, الملقا: false },
  licenseNo:      '',
  licenseExpiry:  '',
  priceCash:      '',
  priceInsurance: '',
  bio:            '',
}

export default function NewDoctorModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleBranchToggle(branch) {
    setForm((prev) => ({
      ...prev,
      branches: { ...prev.branches, [branch]: !prev.branches[branch] },
    }))
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
    <Modal open={open} onClose={handleClose} title="طبيب جديد" subtitle="أضف طبيباً للمجمع">
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="doctor-first-name">الاسم الأول</label>
          <input id="doctor-first-name" className="inp" placeholder="الاسم الأول" value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="doctor-last-name">اسم العائلة</label>
          <input id="doctor-last-name" className="inp" placeholder="اسم العائلة" value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="doctor-specialty">التخصص</label>
          <select id="doctor-specialty" className="inp" value={form.specialty}
            onChange={(e) => handleChange('specialty', e.target.value)}>
            <option>باطنة عامة</option>
            <option>جلدية</option>
            <option>أسنان</option>
            <option>أطفال</option>
            <option>نساء وولادة</option>
            <option>عظام</option>
            <option>عيون</option>
            <option>أنف وأذن</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="doctor-phone">الجوال</label>
          <input id="doctor-phone" className="inp num" placeholder="+966 55 XXX XXXX" dir="ltr"
            value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="doctor-email">البريد الإلكتروني</label>
        <input id="doctor-email" className="inp" placeholder="doctor@shifa.sa" dir="ltr"
          value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
      </div>

      <div className="field">
        <label className="field-label">الفروع</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          {Object.keys(form.branches).map((branch) => (
            <label key={branch} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12.5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.branches[branch]}
                onChange={() => handleBranchToggle(branch)}
              />
              {branch}
            </label>
          ))}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="doctor-license-no">رقم الرخصة الطبية</label>
          <input id="doctor-license-no" className="inp num" placeholder="SCFHS-XXXXX" dir="ltr"
            value={form.licenseNo} onChange={(e) => handleChange('licenseNo', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="doctor-license-expiry">تاريخ انتهاء الرخصة</label>
          <input id="doctor-license-expiry" className="inp num" type="date"
            value={form.licenseExpiry} onChange={(e) => handleChange('licenseExpiry', e.target.value)} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="doctor-price-cash">سعر الكشف (نقد)</label>
          <input id="doctor-price-cash" className="inp num" placeholder="150" dir="ltr"
            value={form.priceCash} onChange={(e) => handleChange('priceCash', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="doctor-price-insurance">سعر الكشف (تأمين)</label>
          <input id="doctor-price-insurance" className="inp num" placeholder="200" dir="ltr"
            value={form.priceInsurance} onChange={(e) => handleChange('priceInsurance', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="doctor-bio">نبذة عن الطبيب</label>
        <textarea id="doctor-bio" className="inp" rows="2" placeholder="الخبرة والشهادات…"
          value={form.bio} onChange={(e) => handleChange('bio', e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit}>إضافة الطبيب</button>
      </div>
    </Modal>
  )
}
