import { useState } from 'react'
import { Plus, Pencil, Trash2, Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { useRoles, usePermissions, useCreateRole, useUpdateRole, useDeleteRole } from '../../hooks/queries/useRoles'
import { useToast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import './Roles.css'

const GROUP_AR = {
  admins: 'المستخدمون', roles: 'الأدوار', permissions: 'الصلاحيات',
  cities: 'المدن', areas: 'المناطق', locations: 'المواقع',
  clinics: 'العيادات', 'clinic-managers': 'مديرو العيادات',
  doctors: 'الأطباء', specializations: 'التخصصات',
  'sub-specializations': 'التخصصات الفرعية', 'time-tables': 'الجداول',
  appointments: 'الحجوزات', 'push-notifications': 'الإشعارات',
  users: 'المرضى', splashes: 'شاشات البداية',
  'contact-messages': 'رسائل التواصل', pages: 'الصفحات',
}

const ACTION_AR = { view: 'عرض', create: 'إضافة', update: 'تعديل', delete: 'حذف' }

export default function Roles() {
  const { showToast } = useToast()
  const { data: roles = [], isLoading } = useRoles()
  const { data: allPermissions = [] } = usePermissions()
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const deleteRole = useDeleteRole()

  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', permission_ids: [] })
  const [expanded, setExpanded] = useState(null)
  const [deleting, setDeleting] = useState(null)

  // Group permissions by group key
  const grouped = allPermissions.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = []
    acc[p.group].push(p)
    return acc
  }, {})

  function openCreate() {
    setForm({ name: '', description: '', permission_ids: [] })
    setModal('create')
  }

  function openEdit(role) {
    setForm({ name: role.name, description: role.description || '', permission_ids: role.permissions.map(p => p.id) })
    setModal({ role })
  }

  function togglePermission(id) {
    setForm(p => ({
      ...p,
      permission_ids: p.permission_ids.includes(id)
        ? p.permission_ids.filter(x => x !== id)
        : [...p.permission_ids, id],
    }))
  }

  function toggleGroup(perms) {
    const ids = perms.map(p => p.id)
    const allOn = ids.every(id => form.permission_ids.includes(id))
    setForm(p => ({
      ...p,
      permission_ids: allOn
        ? p.permission_ids.filter(id => !ids.includes(id))
        : [...new Set([...p.permission_ids, ...ids])],
    }))
  }

  async function handleSave() {
    if (!form.name.trim()) return showToast('أدخل اسم الدور', 'error')
    try {
      if (modal === 'create') {
        await createRole.mutateAsync({ name: form.name, description: form.description, permission_ids: form.permission_ids })
        showToast('تم إنشاء الدور بنجاح', 'success')
      } else {
        await updateRole.mutateAsync({ id: modal.role.id, data: { name: form.name, description: form.description, permission_ids: form.permission_ids } })
        showToast('تم تحديث الدور بنجاح', 'success')
      }
      setModal(null)
    } catch (err) {
      showToast(err?.response?.data?.message || 'حدث خطأ', 'error')
    }
  }

  async function handleDelete(role) {
    if (!confirm(`حذف دور "${role.name}"؟`)) return
    setDeleting(role.id)
    try {
      await deleteRole.mutateAsync(role.id)
      showToast('تم الحذف', 'success')
    } catch (err) {
      showToast(err?.response?.data?.message || 'تعذر الحذف', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const isPending = createRole.isPending || updateRole.isPending

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>الأدوار والصلاحيات</h1>
          <div className="sub">{roles.length} دور</div>
        </div>
        <button className="btn btn-p" onClick={openCreate}>
          <Plus size={15} /> دور جديد
        </button>
      </div>

      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading && [1, 2, 3].map(n => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 12, borderBottom: '1px solid var(--line)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--line)', animation: 'pulse 1.2s ease infinite' }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: 120, height: 13, borderRadius: 6, background: 'var(--line)', animation: 'pulse 1.2s ease infinite', marginBottom: 6 }} />
              <div style={{ width: 180, height: 11, borderRadius: 6, background: 'var(--line)', animation: 'pulse 1.2s ease infinite' }} />
            </div>
          </div>
        ))}

        {!isLoading && roles.map((role, i) => (
          <div key={role.id} style={{ borderBottom: i < roles.length - 1 ? '1px solid var(--line)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 12, cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === role.id ? null : role.id)}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(var(--brand-rgb),.1)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={16} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {role.name}
                  {role.is_super_admin && <span className="chip ok" style={{ fontSize: 10 }}>Super Admin</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-45)', marginTop: 2 }}>{role.permissions_count} صلاحية · {role.admins_count} مستخدم</div>
              </div>
              <div style={{ color: 'var(--ink-45)' }}>
                {expanded === role.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </div>
              {!role.is_super_admin && <>
                <button className="btn btn-q" style={{ padding: '6px 10px' }} onClick={e => { e.stopPropagation(); openEdit(role) }}>
                  <Pencil size={13} />
                </button>
                <button className="btn" style={{ padding: '6px 10px', color: 'var(--danger)', background: 'rgba(179,64,47,.07)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); handleDelete(role) }} disabled={deleting === role.id}>
                  <Trash2 size={13} />
                </button>
              </>}
            </div>

            {expanded === role.id && (
              <div style={{ background: 'var(--paper)', borderTop: '1px solid var(--line)', padding: '12px 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {role.permissions.length === 0
                  ? <span style={{ fontSize: 13, color: 'var(--ink-45)' }}>لا توجد صلاحيات</span>
                  : role.permissions.map(p => (
                    <span key={p.id} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'var(--sand)', color: 'var(--brand)', fontWeight: 500 }}>
                      {GROUP_AR[p.group] || p.group} — {ACTION_AR[p.slug.split('.')[1]] || p.slug.split('.')[1]}
                    </span>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'دور جديد' : `تعديل: ${modal.role?.name}`} onClose={() => setModal(null)} size="lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label className="field-label">اسم الدور</label>
                <input className="inp" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: مدير الفرع" />
              </div>
              <div className="field">
                <label className="field-label">الوصف</label>
                <input className="inp" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="اختياري" />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-45)', marginBottom: 10 }}>
                الصلاحيات {allPermissions.length === 0 && '(جاري التحميل...)'}
              </div>
              <div className="roles-modal-perms">
                {Object.entries(grouped).map(([group, perms]) => {
                  const allOn = perms.every(p => form.permission_ids.includes(p.id))
                  const someOn = perms.some(p => form.permission_ids.includes(p.id))
                  const selected = perms.filter(p => form.permission_ids.includes(p.id)).length
                  return (
                    <div key={group} className="perm-group">
                      <div className="perm-group-head" onClick={() => toggleGroup(perms)}>
                        <div className={`perm-checkbox ${allOn ? 'all' : someOn ? 'some' : ''}`}>
                          {allOn && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>}
                        </div>
                        <span className="perm-group-name">{GROUP_AR[group] || group}</span>
                        <span className="perm-group-count">{selected}/{perms.length}</span>
                      </div>
                      <div className="perm-group-body">
                        {perms.map(p => {
                          const action = p.slug.split('.')[1]
                          const on = form.permission_ids.includes(p.id)
                          return (
                            <button key={p.id} type="button" className={`perm-btn${on ? ' on' : ''}`}
                              onClick={() => togglePermission(p.id)}>
                              {ACTION_AR[action] || action}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="roles-modal-footer">
              <span style={{ fontSize: 12, color: 'var(--ink-45)' }}>{form.permission_ids.length} صلاحية محددة</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-q" onClick={() => setModal(null)}>إلغاء</button>
                <button className="btn btn-p" onClick={handleSave} disabled={isPending}>
                  {isPending ? 'جاري الحفظ...' : modal === 'create' ? 'إنشاء' : 'حفظ'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
