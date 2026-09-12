import { useState, useEffect, useRef } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useValidation } from '../../../hooks/useValidation'
import { useCreateSplash, useUpdateSplash, useSplash } from '../../../hooks/queries/useSplashes'
import '../Splashes.css'

const INITIAL = { titleAr: '', titleEn: '', descAr: '', descEn: '', type: 'user', image: null }

function buildPayload(form, isUpdate = false) {
  const fd = new FormData()
  if (isUpdate) fd.append('_method', 'PUT')
  fd.append('title[ar]', form.titleAr)
  fd.append('title[en]', form.titleEn || form.titleAr)
  fd.append('description[ar]', form.descAr)
  fd.append('description[en]', form.descEn || form.descAr)
  fd.append('type', form.type)
  if (form.image instanceof File) fd.append('image', form.image)
  return fd
}

function splashToForm(s) {
  return {
    titleAr: s.title?.ar || '',
    titleEn: s.title?.en || '',
    descAr:  s.description?.ar || '',
    descEn:  s.description?.en || '',
    type:    s.type || 'user',
    image:   null,
  }
}

export default function SplashFormModal({ open, onClose, splash }) {
  const isEdit = !!splash
  const { showToast } = useToast()
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)
  const { errors, validate, clearError, resetErrors } = useValidation()

  const createSplash = useCreateSplash()
  const updateSplash = useUpdateSplash()
  const { data: freshSplash } = useSplash(isEdit && open ? splash.id : null)

  useEffect(() => {
    if (open) {
      const src = freshSplash || splash
      if (src) setForm(splashToForm(src))
      else setForm(INITIAL)
      resetErrors()
    }
  }, [open, freshSplash, splash])

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); clearError(k) }

  async function handleSave() {
    const ok = validate(form, { titleAr: 'عنوان الشاشة (عربي) مطلوب' })
    if (!ok) return
    setSaving(true)
    try {
      if (isEdit) {
        await updateSplash.mutateAsync({ id: splash.id, data: buildPayload(form, true) })
        showToast('تم تحديث الشاشة بنجاح', 'success')
      } else {
        await createSplash.mutateAsync(buildPayload(form))
        showToast('تم إضافة الشاشة بنجاح', 'success')
      }
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'حدث خطأ', 'error')
    } finally {
      setSaving(false)
    }
  }

  const imagePreview = form.image instanceof File
    ? URL.createObjectURL(form.image)
    : (isEdit && splash?.image ? splash.image : null)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'تعديل شاشة البداية' : 'إضافة شاشة بداية'}
      subtitle={isEdit ? splash.title?.ar : 'أضف شاشة جديدة لتطبيق الموبايل'}
    >
      <div className="splash-form">

        {/* النوع */}
        <div className="field">
          <label className="field-label">النوع</label>
          <div className="splash-type-group">
            <button
              type="button"
              className={`splash-type-btn${form.type === 'user' ? ' active' : ''}`}
              onClick={() => set('type', 'user')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              مستخدم
            </button>
            <button
              type="button"
              className={`splash-type-btn${form.type === 'provider' ? ' active' : ''}`}
              onClick={() => set('type', 'provider')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              مزود خدمة
            </button>
          </div>
        </div>

        {/* العنوان */}
        <div className="field-row">
          <div className="field">
            <label className="field-label">العنوان (عربي) *</label>
            <input
              className={`inp${errors.titleAr ? ' inp--error' : ''}`}
              placeholder="مثال: مرحباً بك"
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
              placeholder="Welcome"
              value={form.titleEn}
              onChange={e => set('titleEn', e.target.value)}
            />
          </div>
        </div>

        {/* الوصف */}
        <div className="field-row">
          <div className="field">
            <label className="field-label">الوصف (عربي)</label>
            <textarea
              className="inp"
              rows={3}
              placeholder="وصف قصير..."
              value={form.descAr}
              onChange={e => set('descAr', e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label">الوصف (إنجليزي)</label>
            <textarea
              className="inp"
              dir="ltr"
              rows={3}
              placeholder="Short description..."
              value={form.descEn}
              onChange={e => set('descEn', e.target.value)}
            />
          </div>
        </div>

        {/* الصورة */}
        <div className="field">
          <label className="field-label">صورة الشاشة</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => set('image', e.target.files[0] || null)}
          />
          {imagePreview ? (
            <div className="splash-preview-wrap">
              <div className="splash-preview-phone">
                <img src={imagePreview} alt="preview" />
              </div>
              <div className="splash-preview-actions">
                <button type="button" className="btn btn-q" onClick={() => fileRef.current?.click()}>
                  تغيير الصورة
                </button>
                {form.image instanceof File && (
                  <button type="button" className="btn btn-q" style={{ color: 'var(--danger)' }} onClick={() => set('image', null)}>
                    إزالة
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="splash-upload-area" onClick={() => fileRef.current?.click()}>
              <div className="splash-upload-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="splash-upload-text">اضغط لرفع صورة الشاشة</div>
              <div className="splash-upload-hint">PNG, JPG — يُفضَّل نسبة 9:16</div>
            </div>
          )}
        </div>

      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-q" style={{ minWidth: 80 }} onClick={onClose}>إلغاء</button>
        <button className="btn btn-p" style={{ minWidth: 120 }} onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : isEdit ? 'حفظ التغييرات' : 'إضافة الشاشة'}
        </button>
      </div>
    </Modal>
  )
}
