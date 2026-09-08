import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useUpdateOffer } from '../../../hooks/queries/useOffers'
import OfferForm, { buildOfferPayload, offerToForm } from './OfferForm'
import { useValidation } from '../../../hooks/useValidation'
import './OfferModal.css'

export default function OfferEditModal({ open, offer, onClose }) {
  const { showToast } = useToast()
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const updateOffer = useUpdateOffer()
  const { errors, validate, clearError, resetErrors } = useValidation()

  useEffect(() => {
    if (offer) setForm(offerToForm(offer))
  }, [offer])

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); clearError(k) }

  async function handleSave() {
    const ok = validate(form, {
      nameAr: 'اسم العرض مطلوب',
      discount_value: 'قيمة الخصم مطلوبة',
    })
    if (!ok) return
    setSaving(true)
    try {
      await updateOffer.mutateAsync({ id: offer.id, data: buildOfferPayload(form, true) })
      showToast('تم حفظ التغييرات', 'success')
      resetErrors()
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحفظ', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!offer) return null

  return (
    <Modal open={open} onClose={() => { resetErrors(); onClose() }} title="تعديل العرض" subtitle={offer.name?.ar}>
      <OfferForm form={form} set={set} errors={errors} />
      <div className="offer-modal-footer">
        <button className="btn btn-q" onClick={() => { resetErrors(); onClose() }}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </Modal>
  )
}
