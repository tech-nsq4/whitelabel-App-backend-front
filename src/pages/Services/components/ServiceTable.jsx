import { useState, useRef, useEffect } from 'react'
import { useToast } from '../../../components/ui/Toast'
import { SkeletonTable } from '../../../components/ui/Skeleton'
import ServiceEditModal from './ServiceEditModal'

const EDIT_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 3.5l4 4L8 20l-4.5.5L4 16z"/>
  </svg>
)
const MORE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <circle cx="5"  cy="12" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
  </svg>
)
const STATUS_CONFIG = {
  active:   { label: 'نشطة',   cls: 'chip ok'  },
  inactive: { label: 'متوقفة', cls: 'chip mut' },
}
const SPECIALTY_COLORS = {
  'باطنة': 'linear-gradient(135deg,#0F6B5C,#0A4F44)',
  'جلدية': 'linear-gradient(135deg,#2C6DAA,#1e4f7e)',
  'أسنان': 'linear-gradient(135deg,#7C3AED,#5B21B6)',
  'أطفال': 'linear-gradient(135deg,#D97706,#b45309)',
  'عظام':  'linear-gradient(135deg,#0891B2,#0e7490)',
  'عام':   'linear-gradient(135deg,#059669,#047857)',
}

function RowMenu({ onEdit, onDeactivate }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (!open) return
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  function handleOpen() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.left })
    }
    setOpen(v => !v)
  }

  const items = [
    { label: 'تعديل السعر',   action: () => { onEdit();                   setOpen(false) } },
    { label: 'نسخ الخدمة',    action: () => { showToast('تم نسخ الخدمة'); setOpen(false) } },
    { label: 'إيقاف الخدمة', action: () => { onDeactivate();              setOpen(false) }, danger: true },
  ]

  return (
    <>
      <button ref={btnRef} className="icon-btn" style={{ width: 32, height: 32 }} onClick={handleOpen} aria-label="المزيد">
        {MORE_ICON}
      </button>
      {open && (
        <div ref={menuRef} style={{
          position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999,
          background: 'var(--card)', border: '1px solid var(--line)',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(10,31,27,0.12)',
          minWidth: 155, overflow: 'hidden',
        }}>
          {items.map((item) => (
            <button key={item.label} onClick={item.action}
              style={{ width: '100%', textAlign: 'right', padding: '10px 14px', fontSize: 12.5, background: 'none', border: 'none', cursor: 'pointer', color: item.danger ? 'var(--danger)' : 'var(--ink)', display: 'block' }}
              onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'rgba(179,64,47,0.06)' : 'var(--paper)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default function ServiceTable({ services, loading = false }) {
  const { showToast } = useToast()
  const [editModal, setEditModal] = useState({ open: false, service: null })
  const [local, setLocal] = useState(services)

  useEffect(() => { setLocal(services) }, [services])

  function handleSave(updated) {
    setLocal(prev => prev.map(s => s.id === updated.id ? { ...s, ...updated } : s))
    showToast('تم حفظ التغييرات')
  }

  if (loading) return <SkeletonTable rows={6} cols={6} />

  if (local.length === 0) {
    return (
      <div className="panel" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--ink-45)', fontSize: 13 }}>
        لا توجد خدمات مطابقة للبحث
      </div>
    )
  }

  return (
    <>
      <div className="panel">
        <table className="data">
          <thead>
            <tr>
              <th>الرمز</th><th>الخدمة</th><th>سعر النقد</th><th>سعر التأمين</th><th>الأطباء</th><th>الحالة</th><th/>
            </tr>
          </thead>
          <tbody>
            {local.map((svc) => {
              const st  = STATUS_CONFIG[svc.status] || STATUS_CONFIG.active
              const bg  = SPECIALTY_COLORS[svc.specialty] || SPECIALTY_COLORS['عام']
              return (
                <tr key={svc.id}>
                  <td>
                    <span className="num" style={{ fontSize: 11.5, color: 'var(--ink-45)', background: 'var(--paper)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--line)' }}>
                      {svc.code}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {svc.specialty.charAt(0)}
                      </div>
                      <div>
                        <div className="td-name">{svc.name}</div>
                        <div className="td-sub">{svc.specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="num" style={{ fontWeight: 700, fontSize: 13 }}>{svc.priceCash}</span>
                    <span style={{ color: 'var(--ink-45)', fontSize: 11, marginRight: 3 }}>ر.س</span>
                  </td>
                  <td>
                    <span className="num" style={{ fontSize: 13 }}>{svc.priceInsurance}</span>
                    <span style={{ color: 'var(--ink-45)', fontSize: 11, marginRight: 3 }}>ر.س</span>
                  </td>
                  <td>
                    <span className="num" style={{ fontWeight: 600 }}>{svc.doctors}</span>
                    <span style={{ color: 'var(--ink-45)', fontSize: 11, marginRight: 3 }}>طبيب</span>
                  </td>
                  <td><span className={st.cls}>{st.label}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setEditModal({ open: true, service: svc })} aria-label="تعديل">
                        {EDIT_ICON}
                      </button>
                      <RowMenu
                        onEdit={() => setEditModal({ open: true, service: svc })}
                        onDeactivate={() => {
                          showToast(`تم إيقاف ${svc.name}`)
                          setLocal(prev => prev.map(s => s.id === svc.id ? { ...s, status: 'inactive' } : s))
                        }}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ServiceEditModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, service: null })}
        service={editModal.service}
        onSave={handleSave}
      />
    </>
  )
}
