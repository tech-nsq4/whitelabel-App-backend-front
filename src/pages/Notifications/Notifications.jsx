import { useState } from 'react'
import { Bell, Send, Trash2, Users, Plus } from 'lucide-react'
import { usePushNotifications, useDeletePushNotification, useSendPushNotification } from '../../hooks/queries/usePushNotifications'
import { useToast } from '../../components/ui/Toast'
import { SkeletonList } from '../../components/ui/Skeleton'

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)    return 'الآن'
  if (diff < 3600)  return `قبل ${Math.floor(diff / 60)} دقيقة`
  if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} ساعة`
  return `قبل ${Math.floor(diff / 86400)} يوم`
}

const EMPTY_FORM = { titleAr: '', titleEn: '', descAr: '', descEn: '' }

export default function Notifications() {
  const { showToast } = useToast()
  const [form, setForm]       = useState(EMPTY_FORM)
  const [langTab, setLangTab] = useState('ar')
  const [saving, setSaving]   = useState(false)

  const { data: notifications = [], isLoading } = usePushNotifications()
  const deleteNotif = useDeletePushNotification()
  const sendNotif   = useSendPushNotification()

  function set(key, val) { setForm(p => ({ ...p, [key]: val })) }

  async function handleSend() {
    if (!form.titleAr.trim()) return showToast('العنوان بالعربي مطلوب', 'error')
    setSaving(true)
    try {
      await sendNotif.mutateAsync({
        title:       { ar: form.titleAr, en: form.titleEn || form.titleAr },
        description: { ar: form.descAr,  en: form.descEn  || form.descAr  },
      })
      showToast('تم إرسال الإشعار بنجاح')
      setForm(EMPTY_FORM)
    } catch {
      showToast('تعذر إرسال الإشعار', 'error')
    } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    try {
      await deleteNotif.mutateAsync(id)
      showToast('تم حذف الإشعار')
    } catch { showToast('تعذر الحذف', 'error') }
  }

  return (
    <div className="page-fade">
      {/* Header */}
      <div className="page-head">
        <div>
          <h1>الإشعارات</h1>
          <div className="sub">إرسال وإدارة إشعارات تطبيق المرضى</div>
        </div>
      </div>

      <div className="row c31" style={{ alignItems: 'flex-start' }}>

        {/* ── Left: list ── */}
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={15} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>الإشعارات المُرسَلة</span>
              {notifications.length > 0 && (
                <span style={{ background: 'var(--brand)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                  {notifications.length}
                </span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: 16 }}><SkeletonList rows={4} /></div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--ink-25)' }}>
                <Bell size={24} strokeWidth={1.3} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-70)', marginBottom: 4 }}>لا توجد إشعارات مرسلة</div>
              <div style={{ fontSize: 12, color: 'var(--ink-45)' }}>أرسل أول إشعار من النموذج على اليمين</div>
            </div>
          ) : notifications.map((n, i) => (
            <div key={n.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '14px 20px',
              borderBottom: i < notifications.length - 1 ? '1px solid var(--line)' : 'none',
              transition: 'background .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--paper)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(15,107,92,.1)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bell size={15} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                  {n.title?.ar || n.title || '—'}
                </div>
                {(n.description?.ar || n.description) && (
                  <div style={{ fontSize: 12, color: 'var(--ink-45)', marginBottom: 8, lineHeight: 1.5 }}>
                    {n.description?.ar || n.description}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--brand)', background: 'rgba(15,107,92,.07)', padding: '2px 8px', borderRadius: 99 }}>
                    <Users size={10} strokeWidth={2} />
                    {n.recipients_count ?? 0} مستلم
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--ink-45)' }}>{timeAgo(n.created_at)}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(n.id)} style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-25)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(179,64,47,.08)'; e.currentTarget.style.color = 'var(--danger)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--ink-25)' }}
                aria-label="حذف">
                <Trash2 size={13} strokeWidth={1.8} />
              </button>
            </div>
          ))}
        </div>

        {/* ── Right: compose ── */}
        <div className="panel" style={{ padding: 0, overflow: 'hidden', position: 'sticky', top: 16 }}>
          {/* Compose header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg, #f0faf6, #fff)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(15,107,92,.1)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus size={16} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>إشعار جديد</div>
              <div style={{ fontSize: 11, color: 'var(--ink-45)' }}>سيصل لجميع مستخدمي التطبيق</div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ margin: '16px 20px', padding: '12px 14px', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(15,107,92,.1)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bell size={14} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{form.titleAr || 'عنوان الإشعار'}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-45)' }}>{form.descAr || 'وصف الإشعار سيظهر هنا...'}</div>
              </div>
            </div>
          </div>

          {/* Lang tabs */}
          <div style={{ display: 'flex', gap: 4, padding: '0 20px 12px' }}>
            {['ar', 'en'].map(l => (
              <button key={l} onClick={() => setLangTab(l)} style={{
                padding: '5px 14px', borderRadius: 8, fontSize: 12.5,
                border: 'none', cursor: 'pointer', transition: 'all .15s',
                background: langTab === l ? 'rgba(15,107,92,.08)' : 'none',
                color: langTab === l ? 'var(--brand-d)' : 'var(--ink-45)',
                fontWeight: langTab === l ? 600 : 400,
              }}>
                {l === 'ar' ? 'العربية' : 'English'}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ padding: '0 20px 20px' }}>
            {langTab === 'ar' ? (
              <>
                <div className="field">
                  <label className="field-label">العنوان <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input className="inp" value={form.titleAr} onChange={e => set('titleAr', e.target.value)} placeholder="مثال: عرض العيادة" />
                </div>
                <div className="field">
                  <label className="field-label">الوصف</label>
                  <textarea className="inp" rows={4} value={form.descAr} onChange={e => set('descAr', e.target.value)} placeholder="تفاصيل الإشعار..." style={{ resize: 'vertical' }} />
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label className="field-label">Title</label>
                  <input className="inp" dir="ltr" value={form.titleEn} onChange={e => set('titleEn', e.target.value)} placeholder="e.g. Clinic Offer" />
                </div>
                <div className="field">
                  <label className="field-label">Description</label>
                  <textarea className="inp" dir="ltr" rows={4} value={form.descEn} onChange={e => set('descEn', e.target.value)} placeholder="Notification details..." style={{ resize: 'vertical' }} />
                </div>
              </>
            )}

            <button className="btn btn-p" style={{ width: '100%', justifyContent: 'center', gap: 8 }}
              onClick={handleSend} disabled={saving || !form.titleAr.trim()}>
              <Send size={14} strokeWidth={2} />
              {saving ? 'جارٍ الإرسال...' : 'إرسال الإشعار'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
