import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useCreatePromoCode } from '../../../hooks/queries/usePromoCodes'
import PromoCodeForm, { PROMO_INITIAL, buildPromoPayload } from './PromoCodeForm'

export default function NewPromoCodeModal({ open, onClose }) {
  const { showToast } = useToast()
  const [form, setForm] = useState(PROMO_INITIAL)
  const [saving, setSaving] = useState(false)
  const create = useCreatePromoCode()

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  async function handleSubmit() {
    if (!form.code.trim()) return showToast('أدخل كود الخصم', 'error')
    if (!form.discount_value) return showToast('أدخل قيمة الخصم', 'error')
    setSaving(true)
    try {
      await create.mutateAsync(buildPromoPayload(form))
      showToast('تم إضافة الكود بنجاح', 'success')
      setForm(PROMO_INITIAL)
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر إضافة الكود', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={() => { setForm(PROMO_INITIAL); onClose() }} title="كود جديد" subtitle="إضافة كود خصم جديد">
      <PromoCodeForm form={form} set={set} />
      <div className="modal-footer">
        <button className="btn btn-q" onClick={() => { setForm(PROMO_INITIAL); onClose() }}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'إضافة الكود'}
        </button>
      </div>
    </Modal>
  )
}
