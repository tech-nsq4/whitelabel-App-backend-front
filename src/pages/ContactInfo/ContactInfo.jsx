import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useToast } from '../../components/ui/Toast'
import { SkeletonBox } from '../../components/ui/Skeleton'
import { useContactInfo, useUpdateContactInfo } from '../../hooks/queries/useContactInfo'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

export default function ContactInfo() {
  const { showToast } = useToast()
  const { data, isLoading, isError } = useContactInfo()
  const updateContactInfo = useUpdateContactInfo()

  const [form, setForm] = useState({ phone: '', whatsapp_number: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // نملأ الـ form مرة واحدة فقط عند أول ما تيجي البيانات
  useEffect(() => {
    if (data && !initialized) {
      setForm({
        phone:           data.phone           || '',
        whatsapp_number: data.whatsapp_number || '',
        email:           data.email           || '',
      })
      setInitialized(true)
    }
  }, [data, initialized])

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  async function handleSave() {
    setSaving(true)
    try {
      await updateContactInfo.mutateAsync({
        phone:           form.phone,
        whatsapp_number: form.whatsapp_number,
        email:           form.email,
      })
      showToast('تم حفظ بيانات التواصل بنجاح', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحفظ', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>بيانات التواصل</h1>
          <div className="sub">تحديث معلومات التواصل الظاهرة للمستخدمين</div>
        </div>
        <button className="btn btn-p" onClick={handleSave} disabled={saving || isLoading}>
          {saving
            ? <><Loader2 size={15} className="login-spinner-icon" /> جاري الحفظ...</>
            : <>
                <svg width="14" height="14" viewBox="0 0 24 24" {...S}>
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                  <path d="M17 21v-8H7v8M7 3v5h8"/>
                </svg>
                حفظ البيانات
              </>
          }
        </button>
      </div>

      {isError && (
        <div className="panel" style={{ padding: '20px 24px', color: 'var(--danger)', fontSize: 13 }}>
          تعذر تحميل بيانات التواصل. يرجى تحديث الصفحة.
        </div>
      )}

      <div style={{ maxWidth: 560 }}>
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">معلومات التواصل</div>
              <div className="panel-sub">رقم الهاتف والواتساب والبريد الإلكتروني</div>
            </div>
          </div>

          <div className="panel-body">
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <SkeletonBox height={40} style={{ borderRadius: 10 }} />
                <SkeletonBox height={40} style={{ borderRadius: 10 }} />
                <SkeletonBox height={40} style={{ borderRadius: 10 }} />
              </div>
            ) : (
              <>
                <div className="field">
                  <label className="field-label">رقم الهاتف</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" {...S} style={{ color: 'var(--ink-45)' }}>
                        <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.9.3 1.9.6 2.9.7a2 2 0 011.7 2z"/>
                      </svg>
                    </span>
                    <input
                      className="inp"
                      dir="ltr"
                      type="tel"
                      style={{ paddingRight: 38 }}
                      placeholder="+966 5X XXX XXXX"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">رقم الواتساب</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink-45)" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                      </svg>
                    </span>
                    <input
                      className="inp"
                      dir="ltr"
                      type="tel"
                      style={{ paddingRight: 38 }}
                      placeholder="+966 5X XXX XXXX"
                      value={form.whatsapp_number}
                      onChange={e => set('whatsapp_number', e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">البريد الإلكتروني</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" {...S} style={{ color: 'var(--ink-45)' }}>
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <path d="M22 6l-10 7L2 6"/>
                      </svg>
                    </span>
                    <input
                      className="inp"
                      dir="ltr"
                      type="email"
                      style={{ paddingRight: 38 }}
                      placeholder="contact@example.com"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
