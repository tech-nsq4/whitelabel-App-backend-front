import { useState } from 'react'
import { X, Send, Bell, Globe } from 'lucide-react'
import { useSendPushNotification } from '../../hooks/queries/usePushNotifications'
import { useToast } from '../ui/Toast'
import './SendNotificationModal.css'

const EMPTY = { titleAr: '', titleEn: '', descAr: '', descEn: '' }

export default function SendNotificationModal({ open, onClose }) {
  const { showToast } = useToast()
  const send = useSendPushNotification()
  const [form, setForm] = useState(EMPTY)
  const [tab, setTab] = useState('ar') // 'ar' | 'en'

  function set(key, val) { setForm(p => ({ ...p, [key]: val })) }

  async function handleSubmit() {
    if (!form.titleAr.trim()) return showToast('العنوان بالعربي مطلوب', 'error')
    try {
      await send.mutateAsync({
        title:       { ar: form.titleAr, en: form.titleEn || form.titleAr },
        description: { ar: form.descAr,  en: form.descEn  || form.descAr  },
      })
      showToast('تم إرسال الإشعار بنجاح ✓')
      setForm(EMPTY)
      onClose()
    } catch {
      showToast('تعذر إرسال الإشعار', 'error')
    }
  }

  return (
    <>
      {open && <div className="snm-backdrop" onClick={onClose} />}
      <div className={`snm-panel${open ? ' snm-open' : ''}`}>

        {/* Header */}
        <div className="snm-header">
          <div className="snm-header-title">
            <div className="snm-header-icon">
              <Send size={15} strokeWidth={2} />
            </div>
            <div>
              <div className="snm-title">إشعار جديد</div>
              <div className="snm-sub">سيصل لجميع مستخدمي التطبيق</div>
            </div>
          </div>
          <button className="snm-close" onClick={onClose}><X size={16} strokeWidth={2} /></button>
        </div>

        {/* Preview pill */}
        <div className="snm-preview">
          <div className="snm-preview-icon"><Bell size={16} strokeWidth={1.8} /></div>
          <div className="snm-preview-body">
            <div className="snm-preview-title">{form.titleAr || 'عنوان الإشعار'}</div>
            <div className="snm-preview-desc">{form.descAr || 'وصف الإشعار سيظهر هنا...'}</div>
          </div>
        </div>

        {/* Lang tabs */}
        <div className="snm-lang-tabs">
          <button className={`snm-lang-tab${tab === 'ar' ? ' active' : ''}`} onClick={() => setTab('ar')}>
            العربية
          </button>
          <button className={`snm-lang-tab${tab === 'en' ? ' active' : ''}`} onClick={() => setTab('en')}>
            <Globe size={12} strokeWidth={2} /> English
          </button>
        </div>

        {/* Form body */}
        <div className="snm-body">
          {tab === 'ar' ? (
            <>
              <div className="snm-field">
                <label className="snm-label">العنوان <span className="snm-required">*</span></label>
                <input className="inp" value={form.titleAr}
                  onChange={e => set('titleAr', e.target.value)}
                  placeholder="مثال: عرض العيادة" />
              </div>
              <div className="snm-field">
                <label className="snm-label">الوصف</label>
                <textarea className="inp" rows={4} value={form.descAr}
                  onChange={e => set('descAr', e.target.value)}
                  placeholder="تفاصيل الإشعار بالعربي..." style={{ resize: 'vertical' }} />
              </div>
            </>
          ) : (
            <>
              <div className="snm-field">
                <label className="snm-label">Title</label>
                <input className="inp" dir="ltr" value={form.titleEn}
                  onChange={e => set('titleEn', e.target.value)}
                  placeholder="e.g. Clinic Offer" />
              </div>
              <div className="snm-field">
                <label className="snm-label">Description</label>
                <textarea className="inp" dir="ltr" rows={4} value={form.descEn}
                  onChange={e => set('descEn', e.target.value)}
                  placeholder="Notification details in English..." style={{ resize: 'vertical' }} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="snm-footer">
          <button className="btn btn-q" onClick={onClose}>إلغاء</button>
          <button className="btn btn-p snm-send-btn"
            onClick={handleSubmit} disabled={send.isPending || !form.titleAr.trim()}>
            <Send size={14} strokeWidth={2} />
            {send.isPending ? 'جارٍ الإرسال...' : 'إرسال الإشعار'}
          </button>
        </div>
      </div>
    </>
  )
}
