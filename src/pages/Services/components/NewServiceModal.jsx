import { useState } from 'react'
import Modal from '../../../components/ui/Modal'

const INITIAL = {
  code:           '',
  specialty:      'باطنة',
  nameAr:         '',
  nameEn:         '',
  priceCash:      '',
  priceInsurance: '',
  type:           'كشف أول',
  status:         'نشطة',
}

export default function NewServiceModal({ open, onClose, onSubmit }) {
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
    <Modal open={open} onClose={handleClose} title="خدمة جديدة" subtitle="أضف خدمة طبية جديدة للكتالوج">
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="svc-code">رمز الخدمة</label>
          <input
            id="svc-code"
            className="inp num"
            placeholder="SVC-XXX"
            dir="ltr"
            value={form.code}
            onChange={(e) => handleChange('code', e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="svc-specialty">التخصص</label>
          <select id="svc-specialty" className="inp" value={form.specialty} onChange={(e) => handleChange('specialty', e.target.value)}>
            <option>باطنة</option>
            <option>جلدية</option>
            <option>أسنان</option>
            <option>أطفال</option>
            <option>نساء وولادة</option>
            <option>عظام</option>
            <option>عيون</option>
            <option>أنف وأذن</option>
            <option>عام (كل التخصصات)</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="svc-name-ar">اسم الخدمة (عربي)</label>
        <input
          id="svc-name-ar"
          className="inp"
          placeholder="مثال: كشف عام"
          value={form.nameAr}
          onChange={(e) => handleChange('nameAr', e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="svc-name-en">اسم الخدمة (إنجليزي)</label>
        <input
          id="svc-name-en"
          className="inp"
          placeholder="General Checkup"
          dir="ltr"
          value={form.nameEn}
          onChange={(e) => handleChange('nameEn', e.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="svc-price-cash">سعر النقد (ر.س)</label>
          <input
            id="svc-price-cash"
            className="inp num"
            placeholder="150"
            dir="ltr"
            value={form.priceCash}
            onChange={(e) => handleChange('priceCash', e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="svc-price-insurance">سعر التأمين (ر.س)</label>
          <input
            id="svc-price-insurance"
            className="inp num"
            placeholder="200"
            dir="ltr"
            value={form.priceInsurance}
            onChange={(e) => handleChange('priceInsurance', e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="svc-type">نوع الخدمة</label>
        <select id="svc-type" className="inp" value={form.type} onChange={(e) => handleChange('type', e.target.value)}>
          <option>كشف أول</option>
          <option>إعادة كشف</option>
          <option>استشارة</option>
          <option>إجراء علاجي</option>
          <option>تحليل</option>
          <option>أشعة</option>
          <option>عملية</option>
        </select>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="svc-status">الحالة</label>
        <select id="svc-status" className="inp" value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
          <option>نشطة</option>
          <option>متوقفة</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit}>إضافة الخدمة</button>
      </div>
    </Modal>
  )
}
