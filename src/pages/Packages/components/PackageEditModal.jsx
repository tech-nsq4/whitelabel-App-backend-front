import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useUpdatePackage } from '../../../hooks/queries/usePackages'
import { useValidation } from '../../../hooks/useValidation'
import PackageForm, { buildPackagePayload, packageToForm } from './PackageForm'

export default function PackageEditModal({ open, pkg, onClose }) {
  const { showToast } = useToast()
  const update        = useUpdatePackage()
  const { errors, validate, clearError, resetErrors } = useValidation()
  const [form, setForm]   = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (pkg) setForm(packageToForm(pkg))
  }, [pkg])

  function set(k, v) {
    setForm(p => ({ ...p, [k]: v }))
    clearError(k)
  }

  function handleClose() {
    resetErrors()
    onClose()
  }

  async function handleSave() {
    const ok = validate(form, {
      name_ar: 'اسم الباقة بالعربي مطلوب',
      name_en: 'Package name in English is required',
      price:   'السعر مطلوب',
    })
    if (!ok) return
    setSaving(true)
    try {
      await update.mutateAsync({ id: pkg.id, data: buildPackagePayload(form) })
      showToast('تم حفظ التغييرات', 'success')
      handleClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحفظ', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!pkg) return null

  return (
    <Modal open={open} onClose={handleClose} title="تعديل الباقة" subtitle={pkg.name?.ar}>
      <PackageForm form={form} set={set} errors={errors} />
      <div className="modal-footer">
        <button className="btn btn-q" onClick={handleClose} disabled={saving}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </Modal>
  )
}
