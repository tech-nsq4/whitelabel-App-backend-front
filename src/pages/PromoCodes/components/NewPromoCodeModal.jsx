import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useCreatePromoCode } from '../../../hooks/queries/usePromoCodes'
import PromoCodeForm, { PROMO_INITIAL, buildPromoPayload } from './PromoCodeForm'
import { useValidation } from '../../../hooks/useValidation'

export default function NewPromoCodeModal({ open, onClose }) {
  const { showToast } = useToast()
  const [form, setForm] = useState(PROMO_INITIAL)
  const [saving, setSaving] = useState(false)
  const create = useCreatePromoCode()
  const { errors, validate, clearError, resetErrors } = useValidation()

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); clearError(k) }

  async function handleSubmit() {
    const ok = validate(form, {
      code: 'كود الخصم مطلوب',
      discount_value: 'قيمة الخصم مطلوبة',
    })
    if (!ok) return
    setSaving(true)
    try {
      await create.mutateAsync(buildPromoPayload(form))
      showToast('تم إضافة الكود بنجاح', 'success')
      setForm(PROMO_INITIAL)
      resetErrors()
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر إضافة الكود', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={() => { setForm(PROMO_INITIAL); resetErrors(); onClose() }} title="كود جديد" subtitle="إضافة كود خصم جديد">
      <PromoCodeForm form={form} set={set} errors={errors} />
      <div className="modal-footer">
        <button className="btn btn-q" onClick={() => { setForm(PROMO_INITIAL); resetErrors(); onClose() }}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'إضافة الكود'}
        </button>
      </div>
    </Modal>
  )
}
