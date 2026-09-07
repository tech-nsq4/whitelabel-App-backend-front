import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useCreateOffer } from '../../../hooks/queries/useOffers'
import OfferForm, { OFFER_INITIAL, buildOfferPayload } from './OfferForm'
import { useValidation } from '../../../hooks/useValidation'

export default function NewOfferModal({ open, onClose }) {
  const { showToast } = useToast()
  const [form, setForm] = useState(OFFER_INITIAL)
  const [saving, setSaving] = useState(false)
  const createOffer = useCreateOffer()
  const { errors, validate, clearError, resetErrors } = useValidation()

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); clearError(k) }

  async function handleSubmit() {
    const ok = validate(form, {
      nameAr: 'اسم العرض مطلوب',
      discount_value: 'قيمة الخصم مطلوبة',
    })
    if (!ok) return
    setSaving(true)
    try {
      await createOffer.mutateAsync(buildOfferPayload(form))
      showToast('تم إضافة العرض بنجاح', 'success')
      setForm(OFFER_INITIAL)
      resetErrors()
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر إضافة العرض', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={() => { setForm(OFFER_INITIAL); resetErrors(); onClose() }} title="عرض جديد" subtitle="إضافة عرض أو خصم جديد">
      <OfferForm form={form} set={set} errors={errors} />
      <div className="offer-modal-footer">
        <button className="btn btn-q" onClick={() => { setForm(OFFER_INITIAL); resetErrors(); onClose() }}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'إضافة العرض'}
        </button>
      </div>
    </Modal>
  )
}
