import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useUpdateSubSpecialization, useDeleteSubSpecialization } from '../../../hooks/queries/useSpecializations'
import { useValidation } from '../../../hooks/useValidation'

export default function ServiceEditModal({ open, onClose, service, onSave }) {
  const { showToast } = useToast()
  const [form, setForm] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const update = useUpdateSubSpecialization()
  const remove = useDeleteSubSpecialization()
  const { errors, validate, clearError, resetErrors } = useValidation()

  useEffect(() => {
    if (service) setForm({ ...service })
  }, [service])

  if (!service || !form) return null

  function set(field, val) { setForm(p => ({ ...p, [field]: val })); clearError(field) }

  async function handleSave() {
    const ok = validate(form, { name: 'اسم الخدمة مطلوب' })
    if (!ok) return
    try {
      await update.mutateAsync({
        id: service.id,
        data: {
          title: { ar: form.name, en: form.nameEn || form.name },
          description: { ar: form.description || form.name, en: form.nameEn || form.name },
        },
      })
      showToast('تم حفظ التغييرات', 'success')
      resetErrors()
      onSave(form)
      onClose()
    } catch (err) {
      showToast(err?.response?.data?.message || 'تعذر الحفظ', 'error')
    }
  }

  async function handleDelete() {
    if (!confirm(`هل تريد حذف "${service.name}"؟`)) return
    setDeleting(true)
    try {
      await remove.mutateAsync(service.id)
      showToast('تم حذف الخدمة')
      onSave(null)
      onClose()
    } catch (err) {
      const msg = err?.response?.data?.message || ''
      const arabicMsg = msg.toLowerCase().includes('doctors')
        ? 'لا يمكن الحذف لأن هناك أطباء مرتبطون بهذه الخدمة'
        : msg.toLowerCase().includes('appointments')
        ? 'لا يمكن الحذف لأن هناك مواعيد مرتبطة بهذه الخدمة'
        : 'تعذر حذف الخدمة'
      showToast(arabicMsg, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="تعديل الخدمة" subtitle={service.name}>
      <div className="field-row">
        <div className="field">
          <label className="field-label">اسم الخدمة (عربي)</label>
          <input
            className={`inp${errors.name ? ' inp--error' : ''}`}
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="field">
          <label className="field-label">اسم الخدمة (إنجليزي)</label>
          <input className="inp" dir="ltr" value={form.nameEn || ''} onChange={e => set('nameEn', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">الوصف (اختياري)</label>
        <textarea className="inp" rows={2} value={form.description || ''} onChange={e => set('description', e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginTop: 6 }}>
        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'جاري الحذف...' : 'حذف الخدمة'}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-q" onClick={onClose}>إلغاء</button>
          <button className="btn btn-p" onClick={handleSave} disabled={update.isPending}>
            {update.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
