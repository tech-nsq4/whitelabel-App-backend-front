import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import { getLocationsApi } from '../../../api/locations.api'

const INITIAL = { name: '', location_id: '', address: '' }

export default function NewBranchModal({ open, onClose, onSubmit }) {
  const [form, setForm]           = useState(INITIAL)
  const [locations, setLocations] = useState([])

  useEffect(() => {
    getLocationsApi()
      .then(({ data }) => {
        const list = data.data || []
        setLocations(list)
        if (list.length) setForm((prev) => ({ ...prev, location_id: list[0].id }))
      })
      .catch(() => {})
  }, [])

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
    <Modal open={open} onClose={handleClose} title="عيادة جديدة" subtitle="أضف عيادة جديدة">
      <div className="field">
        <label className="field-label" htmlFor="branch-name">اسم العيادة</label>
        <input id="branch-name" className="inp" placeholder="مثال: عيادة الشفاء" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="branch-location">الموقع</label>
        <select id="branch-location" className="inp" value={form.location_id} onChange={(e) => handleChange('location_id', Number(e.target.value))}>
          {locations.map((l) => <option key={l.id} value={l.id}>{l.name?.ar || l.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label className="field-label" htmlFor="branch-address">العنوان التفصيلي</label>
        <input id="branch-address" className="inp" placeholder="الحي، الشارع، رقم المبنى" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit}>إضافة العيادة</button>
      </div>
    </Modal>
  )
}
