import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useCreatePackage } from '../../../hooks/queries/usePackages'
import { useValidation } from '../../../hooks/useValidation'
import PackageForm, { PACKAGE_INITIAL, buildPackagePayload } from './PackageForm'

export default function NewPackageModal({ open, onClose }) {
  const { showToast } = useToast()
  const create        = useCreatePackage()
  const { errors, validate, clearError, resetErrors } = useValidation()
  const [form, setForm]   = useState({ ...PACKAGE_INITIAL })
  const [saving, setSaving] = useState(false)

  function set(k, v) {
    setForm(p => ({ ...p, [k]: v }))
    clearError(k)
  }

  function handleClose() {
    resetErrors()
    setForm({ ...PACKAGE_INITIAL })
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
      await create.mutateAsync(buildPackagePayload(form))
      showToast('تم إضافة الباقة بنجاح', 'success')
      handleClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الإضافة', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="باقة جديدة" subtitle="New Package">
      <PackageForm form={form} set={set} errors={errors} />
      <div className="modal-footer">
        <button className="btn btn-q" onClick={handleClose} disabled={saving}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الإضافة...' : 'إضافة الباقة'}
        </button>
      </div>
    </Modal>
  )
}
