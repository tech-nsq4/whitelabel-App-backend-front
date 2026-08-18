import { useState, useRef, useEffect } from 'react'
import { defaultSettings } from './settings.data'
import { useToast } from '../../components/ui/Toast'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

const CHEVRON = (
  <svg width="14" height="14" viewBox="0 0 24 24" {...S}>
    <path d="M6 9l6 6 6-6"/>
  </svg>
)

function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current  && !btnRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  function handleOpen() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.left, width: r.width })
    }
    setOpen(v => !v)
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        style={{
          width: '100%', minHeight: 40, padding: '9px 12px',
          borderRadius: 'var(--radius-md)', border: `1.5px solid ${open ? 'var(--brand)' : 'var(--line)'}`,
          background: 'var(--card)', color: 'var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', fontSize: 13, transition: 'border-color 0.15s',
          boxShadow: open ? '0 0 0 3px var(--focus-ring)' : 'none',
          textAlign: 'right',
        }}
      >
        <span>{value}</span>
        <span style={{ color: 'var(--ink-45)', transition: 'transform 0.2s', display: 'flex', transform: open ? 'rotate(180deg)' : 'none' }}>
          {CHEVRON}
        </span>
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999,
            background: 'var(--card)', border: '1px solid var(--line)',
            borderRadius: 10, boxShadow: '0 8px 24px rgba(10,31,27,0.12)',
            overflow: 'hidden',
          }}
        >
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              style={{
                width: '100%', textAlign: 'right', padding: '10px 14px',
                fontSize: 13, background: opt === value ? 'var(--sand)' : 'none',
                border: 'none', cursor: 'pointer', color: opt === value ? 'var(--brand)' : 'var(--ink)',
                fontWeight: opt === value ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = 'var(--paper)' }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = 'none' }}
            >
              {opt}
              {opt === value && (
                <svg width="14" height="14" viewBox="0 0 24 24" stroke="var(--brand)" fill="none" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12.5l4.5 4.5L19 7"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--ink-45)', marginBottom: 7, letterSpacing: 0.2 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function SectionHeader({ icon, title, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--sand)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "'Readex Pro'", fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--ink-45)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  )
}

export default function Settings() {
  const { showToast } = useToast()
  const [form, setForm] = useState(defaultSettings)
  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-head">
        <div>
          <h1>الإعدادات العامة</h1>
          <div className="sub">إعدادات النظام والتشغيل</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-p" onClick={() => showToast('تم حفظ التغييرات')}>
            <svg width="14" height="14" viewBox="0 0 24 24" {...S}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
            حفظ التغييرات
          </button>
        </div>
      </div>

      <div className="row c22">
        {/* بيانات المجمع */}
        <div className="panel">
          <SectionHeader
            icon={<svg width="18" height="18" viewBox="0 0 24 24" {...S}><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 8h.01M15 8h.01M9 13h.01M15 13h.01M9 18h6"/></svg>}
            title="بيانات المجمع"
            sub="المعلومات الرسمية للمجمع الطبي"
          />
          <div style={{ padding: '20px 20px 4px' }}>
            <Field label="اسم المجمع">
              <input className="inp" value={form.clinicName} onChange={e => set('clinicName', e.target.value)} />
            </Field>
            <div className="field-row">
              <Field label="رقم السجل التجاري">
                <input className="inp num" dir="ltr" value={form.crNumber} onChange={e => set('crNumber', e.target.value)} />
              </Field>
              <Field label="الرقم الضريبي">
                <input className="inp num" dir="ltr" value={form.taxNumber} onChange={e => set('taxNumber', e.target.value)} />
              </Field>
            </div>
            <div className="field-row">
              <Field label="البريد الإلكتروني">
                <input className="inp" dir="ltr" value={form.email} onChange={e => set('email', e.target.value)} />
              </Field>
              <Field label="الهاتف">
                <input className="inp num" dir="ltr" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </Field>
            </div>
            <Field label="العنوان">
              <input className="inp" value={form.address} onChange={e => set('address', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* إعدادات التشغيل */}
        <div className="panel">
          <SectionHeader
            icon={<svg width="18" height="18" viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>}
            title="إعدادات التشغيل"
            sub="تهيئة النظام والسلوك الافتراضي"
          />
          <div style={{ padding: '20px 20px 4px' }}>
            <Field label="المنطقة الزمنية">
              <CustomSelect value={form.timezone} onChange={v => set('timezone', v)}
                options={['Asia/Riyadh (UTC+3)', 'Asia/Dubai (UTC+4)', 'Africa/Cairo (UTC+2)']} />
            </Field>
            <Field label="لغة النظام">
              <CustomSelect value={form.language} onChange={v => set('language', v)}
                options={['العربية', 'English']} />
            </Field>
            <Field label="عملة التسعير">
              <CustomSelect value={form.currency} onChange={v => set('currency', v)}
                options={['ريال سعودي (SAR)', 'درهم إماراتي (AED)', 'جنيه مصري (EGP)']} />
            </Field>
            <Field label="مدة الكشف الافتراضية">
              <CustomSelect value={form.visitDuration} onChange={v => set('visitDuration', v)}
                options={['15 دقيقة', '30 دقيقة', '45 دقيقة', '60 دقيقة']} />
            </Field>
            <Field label="سياسة الإلغاء">
              <CustomSelect value={form.cancelPolicy} onChange={v => set('cancelPolicy', v)}
                options={['مجاني قبل 24 ساعة', 'مجاني قبل 12 ساعة', 'غير قابل للإلغاء']} />
            </Field>
          </div>
        </div>
      </div>
    </div>
  )
}
