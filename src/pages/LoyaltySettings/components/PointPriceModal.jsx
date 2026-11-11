import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { usePointPrice, useUpdatePointPrice } from '../../../hooks/queries/useLoyaltySettings'
import { Coins } from 'lucide-react'

export default function PointPriceModal({ open, onClose }) {
  const { showToast }          = useToast()
  const { data: pointPrice }   = usePointPrice()
  const update                 = useUpdatePointPrice()
  const [value, setValue]      = useState('')
  const [saving, setSaving]    = useState(false)

  useEffect(() => {
    if (pointPrice) setValue(String(pointPrice.value ?? ''))
  }, [pointPrice])

  async function handleSave() {
    if (value === '' || isNaN(Number(value))) {
      showToast('أدخل قيمة صحيحة للنقطة', 'error')
      return
    }
    setSaving(true)
    try {
      await update.mutateAsync({ value: Number(value) })
      showToast('تم تحديث سعر النقطة', 'success')
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحفظ', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="سعر النقطة" subtitle="Point Price">
      {/* current value display */}
      <div className="point-price-display">
        <Coins size={32} strokeWidth={1.4} color="var(--brand)" />
        <span className="point-price-current">{pointPrice?.value ?? '—'}</span>
        <span className="point-price-label">القيمة الحالية للنقطة</span>
      </div>

      <div className="field">
        <label className="field-label">القيمة الجديدة للنقطة</label>
        <input
          className="inp num"
          dir="ltr"
          type="number"
          min={0}
          step="0.01"
          placeholder="0.00"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>

      <div className="modal-footer">
        <button className="btn btn-q" onClick={onClose} disabled={saving}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ السعر'}
        </button>
      </div>
    </Modal>
  )
}
