import { useState, useEffect, useRef } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useValidation } from '../../../hooks/useValidation'
import { useOffers } from '../../../hooks/queries/useOffers'
import { useCreateBanner, useUpdateBanner, useBanner } from '../../../hooks/queries/useBanners'
import SpecSelect from '../../../components/ui/SpecSelect'

const INITIAL = {
  titleAr: '',
  titleEn: '',
  offer_id: '',
  image: null,
}

function buildPayload(form, isUpdate = false) {
  const fd = new FormData()
  if (isUpdate) fd.append('_method', 'PUT')
  fd.append('title[ar]', form.titleAr)
  fd.append('title[en]', form.titleEn || form.titleAr)
  // لو offer_id موجود نبعته، لو فاضي نبعت null صريح عشان السيرفر يحذف الربط
  if (form.offer_id) {
    fd.append('offer_id', form.offer_id)
  } else if (isUpdate) {
    fd.append('offer_id', '')
  }
  if (form.image instanceof File) fd.append('image', form.image)
  return fd
}

function bannerToForm(banner) {
  return {
    titleAr: banner.title?.ar || '',
    titleEn: banner.title?.en || '',
    // نجرب offer_id أو offer?.id كـ fallback
    offer_id: banner.offer_id ? String(banner.offer_id) : (banner.offer?.id ? String(banner.offer.id) : ''),
    image: null,
  }
}

export default function BannerFormModal({ open, onClose, banner }) {
  const isEdit = !!banner
  const { showToast } = useToast()
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)
  const { errors, validate, clearError, resetErrors } = useValidation()

  const createBanner = useCreateBanner()
  const updateBanner = useUpdateBanner()
  const { data: offers = [] } = useOffers()

  // نجيب بيانات البانر الـ fresh من السيرفر عند التعديل
  const { data: freshBanner } = useBanner(isEdit && open ? banner.id : null)

  useEffect(() => {
    if (open) {
      const src = freshBanner || banner
      if (src) setForm(bannerToForm(src))
      else setForm(INITIAL)
      resetErrors()
    }
  }, [open, freshBanner, banner])

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); clearError(k) }

  async function handleSave() {
    const ok = validate(form, { titleAr: 'عنوان البانر (عربي) مطلوب' })
    if (!ok) return
    setSaving(true)
    try {
      if (isEdit) {
        await updateBanner.mutateAsync({ id: banner.id, data: buildPayload(form, true) })
        showToast('تم تحديث البانر بنجاح', 'success')
      } else {
        await createBanner.mutateAsync(buildPayload(form))
        showToast('تم إضافة البانر بنجاح', 'success')
      }
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'حدث خطأ', 'error')
    } finally {
      setSaving(false)
    }
  }

  const offerOptions = [
    { id: '', label: 'بدون عرض' },
    ...offers.map(o => ({ id: String(o.id), label: o.name?.ar || `عرض #${o.id}` })),
  ]

  const imagePreview = form.image instanceof File
    ? URL.createObjectURL(form.image)
    : (isEdit && banner?.image ? banner.image : null)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'تعديل البانر' : 'إضافة بانر جديد'}
      subtitle={isEdit ? (banner.title?.ar) : 'أضف بانراً إعلانياً جديداً'}
    >
      {/* العنوان */}
      <div className="field-row">
        <div className="field">
          <label className="field-label">العنوان (عربي)</label>
          <input
            className={`inp${errors.titleAr ? ' inp--error' : ''}`}
            placeholder="مثال: عروض الصيف"
            value={form.titleAr}
            onChange={e => set('titleAr', e.target.value)}
          />
          {errors.titleAr && <span className="field-error">{errors.titleAr}</span>}
        </div>
        <div className="field">
          <label className="field-label">العنوان (إنجليزي)</label>
          <input
            className="inp"
            dir="ltr"
            placeholder="Summer Offers"
            value={form.titleEn}
            onChange={e => set('titleEn', e.target.value)}
          />
        </div>
      </div>

      {/* العرض المرتبط */}
      <div className="field">
        <label className="field-label">العرض المرتبط (اختياري)</label>
        <SpecSelect
          value={form.offer_id}
          onChange={v => set('offer_id', v)}
          options={offerOptions}
          placeholder="اختر عرضاً..."
        />
      </div>

      {/* الصورة */}
      <div className="field">
        <label className="field-label">صورة البانر</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => set('image', e.target.files[0] || null)}
        />
        {imagePreview ? (
          <div style={{ position: 'relative' }}>
            <img src={imagePreview} alt="banner" className="banner-img-preview" />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                type="button"
                className="btn btn-q"
                style={{ fontSize: 12 }}
                onClick={() => fileRef.current?.click()}
              >
                تغيير الصورة
              </button>
              {form.image instanceof File && (
                <button
                  type="button"
                  className="btn btn-q"
                  style={{ fontSize: 12, color: 'var(--danger)' }}
                  onClick={() => set('image', null)}
                >
                  إزالة
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className="banner-upload-area"
            onClick={() => fileRef.current?.click()}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink-45)" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 15V4M12 4l-4 4M12 4l4 4" />
              <path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17" />
            </svg>
            <div style={{ fontSize: 13, color: 'var(--ink-45)', marginTop: 6 }}>
              اضغط لاختيار صورة
            </div>
          </div>
        )}
      </div>

      <div className="banner-modal-footer">
        <button className="btn btn-q" onClick={onClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : isEdit ? 'حفظ التغييرات' : 'إضافة البانر'}
        </button>
      </div>
    </Modal>
  )
}
