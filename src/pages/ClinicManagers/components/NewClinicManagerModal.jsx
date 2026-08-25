import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useClinics } from '../../../hooks/queries/useClinics'
import { useLocations } from '../../../hooks/queries/useLocations'
import { useCreateClinicManager } from '../../../hooks/queries/useClinicManagers'

const INITIAL = { name: '', email: '', phone: '', password: '', management_scope: 'clinic', clinic_id: '', location_id: '', app_lang: 'ar' }

export default function NewClinicManagerModal({ open, onClose }) {
  const { showToast } = useToast()
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)

  const { data: clinics   = [] } = useClinics()
  const { data: locations = [] } = useLocations()
  const createManager = useCreateClinicManager()

  function set(field, value) { setForm(p => ({ ...p, [field]: value })) }

  async function handleSubmit() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return showToast('اكمل الحقول المطلوبة', 'error')
    }
    setSaving(true)
    try {
      await createManager.mutateAsync({
        name:              form.name,
        email:             form.email,
        phone:             form.phone,
        password:          form.password,
        management_scope:  form.management_scope,
        clinic_id:         form.management_scope === 'clinic'   ? form.clinic_id   || null : null,
        location_id:       form.management_scope === 'location' ? form.location_id || null : null,
        app_lang:          form.app_lang,
      })
      showToast('تم إضافة المدير بنجاح')
      setForm(INITIAL)
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الإضافة', 'error')
    } finally { setSaving(false) }
  }

  function handleClose() { setForm(INITIAL); onClose() }

  return (
    <Modal open={open} onClose={handleClose} title="مدير جديد" subtitle="إضافة مدير عيادة">
      <div className="field-row">
        <div className="field">
          <label className="field-label">الاسم</label>
          <input className="inp" value={form.name} onChange={e => set('name', e.target.value)} placeholder="الاسم الكامل" />
        </div>
        <div className="field">
          <label className="field-label">رقم الهاتف</label>
          <input className="inp" dir="ltr" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="01XXXXXXXXX" />
        </div>
      </div>

      <div className="field">
        <label className="field-label">البريد الإلكتروني</label>
        <input className="inp" dir="ltr" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
      </div>

      <div className="field">
        <label className="field-label">كلمة المرور</label>
        <input className="inp" type="password" dir="ltr" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">نطاق الصلاحية</label>
          <select className="inp" value={form.management_scope} onChange={e => set('management_scope', e.target.value)}>
            <option value="all">كل العيادات</option>
            <option value="location">موقع محدد</option>
            <option value="clinic">عيادة محددة</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">لغة التطبيق</label>
          <select className="inp" value={form.app_lang} onChange={e => set('app_lang', e.target.value)}>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {form.management_scope === 'clinic' && (
        <div className="field">
          <label className="field-label">العيادة</label>
          <select className="inp" value={form.clinic_id} onChange={e => set('clinic_id', e.target.value)}>
            <option value="">اختر العيادة</option>
            {clinics.map(c => <option key={c.id} value={c.id}>{c.name?.ar || c.name}</option>)}
          </select>
        </div>
      )}

      {form.management_scope === 'location' && (
        <div className="field">
          <label className="field-label">الموقع</label>
          <select className="inp" value={form.location_id} onChange={e => set('location_id', e.target.value)}>
            <option value="">اختر الموقع</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name?.ar || l.name}</option>)}
          </select>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn btn-q" onClick={handleClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit} disabled={saving}>
          {saving ? 'جارٍ الحفظ…' : 'إضافة'}
        </button>
      </div>
    </Modal>
  )
}
