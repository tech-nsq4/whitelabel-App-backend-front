import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useCreateAdmin } from '../../../hooks/queries/useAdmins'
import { useClinics } from '../../../hooks/queries/useClinics'
import { useRoles } from '../../../hooks/queries/useRoles'
import './StaffModal.css'

const INITIAL = {
  name: '', email: '', phone: '', password: '', password_confirmation: '',
  role_ids: [], manages_all_clinics: true, clinic_ids: [],
}

export default function NewStaffModal({ open, onClose }) {
  const { showToast } = useToast()
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)

  const createAdmin            = useCreateAdmin()
  const { data: clinics = [] } = useClinics()
  const { data: roles = [] }   = useRoles()

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  function toggleClinic(id) {
    setForm(p => ({
      ...p,
      clinic_ids: p.clinic_ids.includes(id)
        ? p.clinic_ids.filter(x => x !== id)
        : [...p.clinic_ids, id],
    }))
  }

  function toggleRole(id) {
    setForm(p => ({
      ...p,
      role_ids: p.role_ids.includes(id)
        ? p.role_ids.filter(x => x !== id)
        : [...p.role_ids, id],
    }))
  }

  async function handleSubmit() {
    if (!form.name.trim())  return showToast('أدخل الاسم', 'error')
    if (!form.email.trim()) return showToast('أدخل البريد الإلكتروني', 'error')
    if (!form.password)     return showToast('أدخل كلمة المرور', 'error')
    if (form.password !== form.password_confirmation) return showToast('كلمة المرور غير متطابقة', 'error')
    setSaving(true)
    try {
      await createAdmin.mutateAsync({
        name:                 form.name,
        email:                form.email,
        phone:                form.phone || undefined,
        password:             form.password,
        password_confirmation: form.password_confirmation,
        role_ids:             form.role_ids,
        manages_all_clinics:  form.manages_all_clinics,
        clinic_ids:           form.manages_all_clinics ? [] : form.clinic_ids,
      })
      showToast('تم إضافة المستخدم بنجاح', 'success')
      setForm(INITIAL)
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر إضافة المستخدم', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={() => { setForm(INITIAL); onClose() }} title="مستخدم جديد" subtitle="إضافة حساب جديد للنظام">
      <div className="field-row">
        <div className="field">
          <label className="field-label">الاسم</label>
          <input className="inp" placeholder="الاسم الكامل" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">الجوال</label>
          <input className="inp num" dir="ltr" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">البريد الإلكتروني</label>
        <input className="inp" dir="ltr" value={form.email} onChange={e => set('email', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">كلمة المرور</label>
          <input className="inp" type="password" dir="ltr" value={form.password} onChange={e => set('password', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">تأكيد كلمة المرور</label>
          <input className="inp" type="password" dir="ltr" value={form.password_confirmation} onChange={e => set('password_confirmation', e.target.value)} />
        </div>
      </div>

      {roles.length > 0 && (
        <div className="field">
          <label className="field-label">الأدوار</label>
          <div className="toggle-btn-group">
            {roles.map(r => (
              <button key={r.id} type="button" className={`toggle-btn${form.role_ids.includes(r.id) ? ' active' : ''}`} onClick={() => toggleRole(r.id)}>
                {r.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="field">
        <label className="field-label">نطاق الصلاحية</label>
        <div className="toggle-btn-group">
          {[{ v: true, l: 'كل العيادات' }, { v: false, l: 'عيادات محددة' }].map(o => (
            <button key={String(o.v)} type="button" className={`scope-btn${form.manages_all_clinics === o.v ? ' active' : ''}`} onClick={() => set('manages_all_clinics', o.v)}>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {!form.manages_all_clinics && (
        <div className="field">
          <label className="field-label">العيادات</label>
          <div className="toggle-btn-group">
            {clinics.map(c => (
              <button key={c.id} type="button" className={`toggle-btn${form.clinic_ids.includes(c.id) ? ' active' : ''}`} onClick={() => toggleClinic(c.id)}>
                {c.name?.ar || c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="modal-footer">
        <button className="btn btn-q" onClick={() => { setForm(INITIAL); onClose() }}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit} disabled={saving}>
          {saving ? 'جاري الإضافة...' : 'إضافة المستخدم'}
        </button>
      </div>
    </Modal>
  )
}
