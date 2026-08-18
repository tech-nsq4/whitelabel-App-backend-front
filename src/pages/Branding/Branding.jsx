import { useState, useRef } from 'react'
import { colorPalettes, defaultBranding } from './branding.data'
import { useToast } from '../../components/ui/Toast'
import { saveBranding } from '../../hooks/useBranding'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

const CHECK_ICON  = <svg width="12" height="12" viewBox="0 0 24 24" {...S}><path d="M5 12.5l4.5 4.5L19 7"/></svg>
const UPLOAD_ICON = <svg width="22" height="22" viewBox="0 0 24 24" {...S}><path d="M12 15V4M12 4l-4 4M12 4l4 4"/><path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17"/></svg>

export default function Branding() {
  const { showToast } = useToast()
  const [nameAr,  setNameAr]  = useState(defaultBranding.nameAr)
  const [nameEn,  setNameEn]  = useState(defaultBranding.nameEn)
  const [palette, setPalette] = useState(
    localStorage.getItem('brandingPalette') || defaultBranding.palette
  )
  const [logo, setLogo] = useState(() => localStorage.getItem('brandingLogo') || null)
  const fileInputRef = useRef(null)

  function handleLogoFile(file) {
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { showToast('الحجم أكبر من 2MB'); return }
    const reader = new FileReader()
    reader.onload = (e) => {
      setLogo(e.target.result)
      saveBranding({ logo: e.target.result })
    }
    reader.readAsDataURL(file)
  }

  const activePalette = colorPalettes.find(p => p.id === palette)

  function applyPalette(p) {
    setPalette(p.id)
    Object.entries(p.vars).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val)
    })
    // persist selection
    localStorage.setItem('brandingPalette', p.id)
    showToast(`تم تطبيق لوحة ${p.label}`)
  }

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-head">
        <div>
          <h1>الهوية البصرية</h1>
          <div className="sub">تخصيص مظهر تطبيق المرضى</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-p" onClick={() => {
            saveBranding({ nameAr, nameEn, logo })
            showToast('تم حفظ التغييرات')
          }}>
            حفظ التغييرات
          </button>
        </div>
      </div>

      <div className="row c22">
        {/* Color Palettes */}
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">لوحة الألوان</div>
              <div className="panel-sub">اختر اللون الرئيسي لتطبيق المرضى</div>
            </div>
            {activePalette && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: activePalette.gradient }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-70)' }}>{activePalette.label}</span>
              </div>
            )}
          </div>
          <div className="panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {colorPalettes.map((p) => {
                const isActive = palette === p.id
                return (
                  <div
                    key={p.id}
                    onClick={() => applyPalette(p)}
                    style={{
                      borderRadius: 12, padding: '10px 10px 8px', cursor: 'pointer',
                      border: isActive ? '2px solid var(--brand)' : '1.5px solid var(--line)',
                      background: isActive ? 'var(--sand)' : 'var(--card)',
                      boxShadow: isActive ? '0 0 0 3px rgba(15,107,92,.1)' : 'none',
                      transition: 'all 0.15s', position: 'relative',
                    }}
                  >
                    {isActive && (
                      <div style={{
                        position: 'absolute', top: 6, left: 6,
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--brand)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {CHECK_ICON}
                      </div>
                    )}
                    <div style={{ height: 42, borderRadius: 8, background: p.gradient, marginBottom: 8 }} />
                    <div style={{ fontSize: 11.5, fontWeight: 600, textAlign: 'center', color: isActive ? 'var(--brand)' : 'var(--ink-70)' }}>
                      {p.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Logo & Name */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">الشعار واسم المجمع</div>
          </div>
          <div className="panel-body">
            <div className="field">
              <label className="field-label">اسم المجمع (عربي)</label>
              <input className="inp" placeholder="اسم المجمع (عربي)" value={nameAr} onChange={e => setNameAr(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">اسم المجمع (إنجليزي)</label>
              <input className="inp" dir="ltr" placeholder="Clinic Name" value={nameEn} onChange={e => setNameEn(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">شعار المجمع</label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/jpeg"
                style={{ display: 'none' }}
                onChange={e => handleLogoFile(e.target.files[0])}
              />

              {logo ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={logo}
                    alt="شعار المجمع"
                    style={{ maxHeight: 100, maxWidth: '100%', borderRadius: 12, border: '1px solid var(--line)', padding: 8, background: 'var(--surface-subtle)', display: 'block' }}
                  />
                  <button
                    onClick={() => { setLogo(null); saveBranding({ logo: null }) }}
                    style={{ position: 'absolute', top: -8, left: -8, width: 24, height: 24, borderRadius: '50%', background: 'var(--danger)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}
                    aria-label="حذف الشعار"
                  >
                    ×
                  </button>
                  <button
                    className="btn btn-q"
                    style={{ marginTop: 8, fontSize: 12, display: 'block', width: '100%', justifyContent: 'center' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    تغيير الشعار
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--brand)' }}
                  onDragLeave={e => { e.currentTarget.style.borderColor = 'var(--line)' }}
                  onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--line)'; handleLogoFile(e.dataTransfer.files[0]) }}
                  style={{
                    border: '2px dashed var(--line)', borderRadius: 12,
                    padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
                    background: 'var(--surface-subtle)', transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--sand)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    {UPLOAD_ICON}
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>اسحب الشعار هنا أو انقر للاختيار</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-45)', marginTop: 4 }}>PNG أو SVG · حد أقصى 2MB</div>
                </div>
              )}
            </div>

            {/* Preview */}
            {activePalette && (
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-45)', marginBottom: 8 }}>معاينة</div>
                <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ background: activePalette.gradient, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {logo
                        ? <img src={logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <svg width="16" height="16" viewBox="0 0 24 24" stroke="#fff" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      }
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: "'Readex Pro'" }}>{nameAr || 'اسم المجمع'}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{nameEn || 'Clinic Name'}</div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 18px', background: 'var(--card)', display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, height: 32, borderRadius: 8, background: activePalette.gradient, opacity: 0.15 }} />
                    <div style={{ flex: 2, height: 32, borderRadius: 8, background: 'var(--paper)' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
