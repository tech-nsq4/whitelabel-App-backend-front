import { useState } from 'react'

const BRANCH_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <path d="M9 22V12h6v10"/>
  </svg>
)

const MORE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
  </svg>
)

const EDIT_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round">
    <path d="M16.5 3.5l4 4L8 20l-4.5.5L4 16z"/>
  </svg>
)

export default function BranchCard({ group, onDetails, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState({})

  const totalDoctors = group.clinics.reduce((s, c) => s + (c.doctorsCount || 0), 0)

  function toggleMenu(id) { setMenuOpen(p => ({ ...p, [id]: !p[id] })) }
  function closeMenu(id)  { setMenuOpen(p => ({ ...p, [id]: false })) }

  return (
    <div className="tile branch-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* City header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-d) 100%)',
        color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {BRANCH_ICON}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{group.cityAr}</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>{group.clinics.length} عيادة · {totalDoctors} طبيب</div>
          </div>
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
          نشط
        </span>
      </div>

      {/* Clinics list */}
      <div style={{ padding: '8px 0' }}>
        {group.clinics.map((clinic, i) => {
          const nameAr   = clinic.name?.ar || clinic.name || ''
          const areaAr   = clinic.location?.area?.name?.ar || clinic.location?.name?.ar || ''
          const addrAr   = clinic.address?.ar || ''

          return (
            <div key={clinic.id} style={{
              padding: '10px 16px',
              borderBottom: i < group.clinics.length - 1 ? '1px solid var(--line)' : 'none',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {/* Area badge */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{nameAr}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {areaAr && (
                    <span style={{ fontSize: 10.5, fontWeight: 600, padding: '1px 7px', borderRadius: 99, background: 'rgba(15,107,92,0.08)', color: 'var(--brand)' }}>
                      {areaAr}
                    </span>
                  )}
                  {addrAr && (
                    <span style={{ fontSize: 10.5, color: 'var(--ink-45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                      {addrAr}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-45)', marginTop: 3 }}>
                  {clinic.doctorsCount} طبيب
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 4, flexShrink: 0, position: 'relative' }}>
                <button className="btn btn-q" style={{ padding: '5px 10px', fontSize: 11.5 }} onClick={() => onDetails(clinic)}>
                  التفاصيل
                </button>
                <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => onEdit(clinic)}>
                  {EDIT_ICON}
                </button>
                <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => toggleMenu(clinic.id)}>
                  {MORE_ICON}
                </button>
                {menuOpen[clinic.id] && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 99, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, boxShadow: '0 8px 24px rgba(10,31,27,.12)', minWidth: 140, overflow: 'hidden' }}>
                    <button style={{ width: '100%', textAlign: 'right', padding: '10px 14px', fontSize: 12.5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', display: 'block' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--paper)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      onClick={() => { onDetails(clinic); closeMenu(clinic.id) }}>
                      عرض التفاصيل
                    </button>
                    <button style={{ width: '100%', textAlign: 'right', padding: '10px 14px', fontSize: 12.5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', display: 'block' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--paper)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      onClick={() => { onEdit(clinic); closeMenu(clinic.id) }}>
                      تعديل العيادة
                    </button>
                    <button style={{ width: '100%', textAlign: 'right', padding: '10px 14px', fontSize: 12.5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', display: 'block' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(179,64,47,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      onClick={() => { onDelete && onDelete(clinic.id); closeMenu(clinic.id) }}>
                      حذف العيادة
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
