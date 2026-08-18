import { useState, useRef, useEffect } from 'react'
import { useToast } from '../../../components/ui/Toast'
import StaffEditModal from './StaffEditModal'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

const EDIT_ICON = <svg width="13" height="13" viewBox="0 0 24 24" {...S}><path d="M16.5 3.5l4 4L8 20l-4.5.5L4 16z"/></svg>
const MORE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <circle cx="5"  cy="12" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
  </svg>
)

const STATUS_CONFIG = {
  active:   { label: 'نشط',    cls: 'chip ok'  },
  disabled: { label: 'معطّل', cls: 'chip mut' },
}

const AVATAR_COLORS = [
  'linear-gradient(135deg, #0F6B5C, #0A4F44)',
  'linear-gradient(135deg, #B3402F, #8c2d20)',
  'linear-gradient(135deg, #2C6DAA, #1e4f7e)',
  'linear-gradient(135deg, #7C3AED, #5B21B6)',
  'linear-gradient(135deg, #D97706, #b45309)',
  'linear-gradient(135deg, #DB2777, #9d174d)',
  'linear-gradient(135deg, #0891B2, #0e7490)',
  'linear-gradient(135deg, #059669, #047857)',
  'linear-gradient(135deg, #9333EA, #7e22ce)',
]

function RowMenu({ member, onEdit, onToggle }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, left: 0 })
  const btnRef  = useRef(null)
  const menuRef = useRef(null)
  const { showToast } = useToast()

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
      setPos({ top: r.bottom + 4, left: r.left })
    }
    setOpen(v => !v)
  }

  const items = [
    { label: 'تعديل البيانات',  action: () => { onEdit();                                     setOpen(false) } },
    { label: 'إعادة تعيين كلمة المرور', action: () => { showToast('تم إرسال رابط الإعادة'); setOpen(false) } },
    { label: member.status === 'active' ? 'تعطيل الحساب' : 'تفعيل الحساب',
      action: () => { onToggle(); setOpen(false) },
      danger: member.status === 'active' },
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
          minWidth: 180, overflow: 'hidden',
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

export default function StaffTable({ members: initialMembers }) {
  const { showToast } = useToast()
  const [members,   setMembers]   = useState(initialMembers)
  const [editModal, setEditModal] = useState({ open: false, member: null })

  function handleSave(updated) {
    setMembers(prev => prev.map(m => m.id === updated.id ? { ...m, ...updated } : m))
    showToast('تم حفظ التغييرات')
  }

  function handleToggle(id) {
    setMembers(prev => prev.map(m => {
      if (m.id !== id) return m
      const next = m.status === 'active' ? 'disabled' : 'active'
      showToast(next === 'active' ? `تم تفعيل ${m.name}` : `تم تعطيل ${m.name}`)
      return { ...m, status: next }
    }))
  }

  return (
    <>
      <div className="panel">
        <table className="data">
          <thead>
            <tr>
              <th>المستخدم</th>
              <th>الدور</th>
              <th>الفرع</th>
              <th>آخر دخول</th>
              <th>الحالة</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {members.map((m, idx) => {
              const st       = STATUS_CONFIG[m.status] || STATUS_CONFIG.active
              const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
              return (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Readex Pro'", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {m.initial}
                      </div>
                      <div>
                        <div className="td-name">{m.name}</div>
                        <div className="td-sub" dir="ltr" style={{ textAlign: 'right' }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`chip ${m.roleChip}`}>{m.roleLabel}</span></td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-70)' }}>{m.branch}</td>
                  <td className="num" style={{ fontSize: 12.5 }}>{m.lastLogin}</td>
                  <td><span className={st.cls}>{st.label}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setEditModal({ open: true, member: m })} aria-label="تعديل">
                        {EDIT_ICON}
                      </button>
                      <RowMenu
                        member={m}
                        onEdit={() => setEditModal({ open: true, member: m })}
                        onToggle={() => handleToggle(m.id)}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <StaffEditModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, member: null })}
        member={editModal.member}
        onSave={handleSave}
      />
    </>
  )
}
