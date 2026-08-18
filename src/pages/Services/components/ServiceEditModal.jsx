import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'

export default function ServiceEditModal({ open, onClose, service, onSave }) {
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (service) setForm({ ...service })
  }, [service])

  if (!service || !form) return null

  function set(field, val) { setForm(p => ({ ...p, [field]: val })) }

  return (
    <Modal open={open} onClose={onClose} title="تعديل الخدمة" subtitle={form.name}>
      <div className="field">
        <label className="field-label">اسم الخدمة</label>
        <input className="inp" value={form.name} onChange={e => set('name', e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label className="field-label">سعر النقد (ر.س)</label>
          <input className="inp num" type="number" value={form.priceCash} onChange={e => set('priceCash', +e.target.value)} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label className="field-label">سعر التأمين (ر.س)</label>
          <input className="inp num" type="number" value={form.priceInsurance} onChange={e => set('priceInsurance', +e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">الحالة</label>
        <select className="inp" value={form.status} onChange={e => set('status', e.target.value)}>
          <option value="active">نشطة</option>
          <option value="inactive">متوقفة</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={onClose}>إلغاء</button>
        <button className="btn btn-p" onClick={() => { onSave(form); onClose() }}>حفظ التغييرات</button>
      </div>
    </Modal>
  )
}
