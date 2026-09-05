import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useCreateOffer } from '../../../hooks/queries/useOffers'
import OfferForm, { OFFER_INITIAL, buildOfferPayload } from './OfferForm'

export default function NewOfferModal({ open, onClose }) {
  const { showToast } = useToast()
  const [form, setForm] = useState(OFFER_INITIAL)
  const [saving, setSaving] = useState(false)
  const createOffer = useCreateOffer()

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  async function handleSubmit() {
    if (!form.nameAr.trim()) return showToast('أدخل اسم العرض', 'error')
    if (!form.discount_value) return showToast('أدخل قيمة الخصم', 'error')
    setSaving(true)
    try {
      await createOffer.mutateAsync(buildOfferPayload(form))
      showToast('تم إضافة العرض بنجاح', 'success')
      setForm(OFFER_INITIAL)
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر إضافة العرض', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={() => { setForm(OFFER_INITIAL); onClose() }} title="عرض جديد" subtitle="إضافة عرض أو خصم جديد">
      <OfferForm form={form} set={set} />
      <div className="offer-modal-footer">
        <button className="btn btn-q" onClick={() => { setForm(OFFER_INITIAL); onClose() }}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'إضافة العرض'}
        </button>
      </div>
    </Modal>
  )
}
