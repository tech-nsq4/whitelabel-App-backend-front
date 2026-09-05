import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useUpdateAdmin } from '../../../hooks/queries/useAdmins'
import { useClinics } from '../../../hooks/queries/useClinics'
import { useRoles } from '../../../hooks/queries/useRoles'
import './StaffModal.css'

export default function StaffEditModal({ open, admin, onClose }) {
  const { showToast } = useToast()
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const updateAdmin            = useUpdateAdmin()
  const { data: clinics = [] } = useClinics()
  const { data: roles = [] }   = useRoles()

  useEffect(() => {
    if (admin) setForm({
      name:               admin.name || '',
      email:              admin.email || '',
      phone:              admin.phone || '',
      manages_all_clinics: admin.manages_all_clinics ?? true,
      clinic_ids:         admin.clinics?.map(c => c.id) || [],
      role_ids:           admin.roles?.map(r => r.id) || [],
      is_active:          admin.is_active ?? true,
    })
  }, [admin])

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

  async function handleSave() {
    setSaving(true)
    try {
      await updateAdmin.mutateAsync({
        id: admin.id,
        data: {
          name:               form.name,
          email:              form.email,
          phone:              form.phone || undefined,
          role_ids:           form.role_ids,
          manages_all_clinics: form.manages_all_clinics,
          clinic_ids:         form.manages_all_clinics ? [] : form.clinic_ids,
          is_active:          form.is_active,
        }
      })
      showToast('تم حفظ التغييرات', 'success')
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحفظ', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!admin) return null

  return (
    <Modal open={open} onClose={onClose} title="تعديل المستخدم" subtitle={admin.name || admin.email}>
      <div className="field-row">
        <div className="field">
          <label className="field-label">الاسم</label>
          <input className="inp" value={form.name || ''} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">الجوال</label>
          <input className="inp num" dir="ltr" value={form.phone || ''} onChange={e => set('phone', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">البريد الإلكتروني</label>
        <input className="inp" dir="ltr" value={form.email || ''} onChange={e => set('email', e.target.value)} />
      </div>

      {roles.length > 0 && (
        <div className="field">
          <label className="field-label">الأدوار</label>
          <div className="toggle-btn-group">
            {roles.map(r => (
              <button key={r.id} type="button" className={`toggle-btn${(form.role_ids || []).includes(r.id) ? ' active' : ''}`} onClick={() => toggleRole(r.id)}>
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
              <button key={c.id} type="button" className={`toggle-btn${(form.clinic_ids || []).includes(c.id) ? ' active' : ''}`} onClick={() => toggleClinic(c.id)}>
                {c.name?.ar || c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="field">
        <label className="field-label">الحالة</label>
        <select className="inp" value={form.is_active ? 'active' : 'inactive'} onChange={e => set('is_active', e.target.value === 'active')}>
          <option value="active">نشط</option>
          <option value="inactive">معطّل</option>
        </select>
      </div>

      <div className="modal-footer">
        <button className="btn btn-q" onClick={onClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </Modal>
  )
}
