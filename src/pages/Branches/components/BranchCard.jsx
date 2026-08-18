import { useState } from 'react'
import { useToast } from '../../../components/ui/Toast'

const EDIT_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path d="M16.5 3.5l4 4L8 20l-4.5.5L4 16z"/>
  </svg>
)

const MORE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <circle cx="6" cy="12" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="18" cy="12" r="1.5"/>
  </svg>
)

const BRANCH_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path d="M4 21V6.5A1.5 1.5 0 015.5 5h13A1.5 1.5 0 0120 6.5V21"/>
    <path d="M9 21v-4h6v4M8 10h2m4 0h2M12 7v6m-3-3h6"/>
  </svg>
)

const STATS = [
  { key: 'clinics',  label: 'عيادة',    highlight: false },
  { key: 'doctors',  label: 'طبيب',     highlight: false },
  { key: 'patients', label: 'مريض',     highlight: false },
  { key: 'revenue',  label: 'إيرادات',  highlight: true  },
]

export default function BranchCard({ branch, onDetails, onEdit }) {
  const { showToast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const copyPhone = async () => {
    try { await navigator.clipboard?.writeText(branch.phone) } catch { /* Clipboard may be unavailable outside a secure context. */ }
    showToast('تم نسخ رقم هاتف الفرع')
  }

  return (
    <div className="tile branch-card">
      {/* Header */}
      <div className="branch-card-head">
        <div className="branch-card-title-wrap">
          <div className="branch-card-icon">
            {BRANCH_ICON}
          </div>
          <div>
            <div className="branch-card-title">
              {branch.name}
            </div>
            <div className="branch-card-city">
              {branch.city}
            </div>
          </div>
        </div>
        <span className="chip ok">نشط</span>
      </div>

      {/* Address */}
      <div className="branch-card-contact">
        <div className="branch-card-address">
          {branch.address}
        </div>
        <div className="branch-card-phone" dir="ltr">
          {branch.phone}
        </div>
      </div>

      {/* Stats grid */}
      <div className="branch-card-stats">
        {STATS.map(({ key, label, highlight }) => (
          <div key={key} className={`branch-stat${highlight ? ' highlight' : ''}`}>
            <div
              className="num"
              style={{ fontSize: key === 'revenue' ? 14 : 15 }}
            >
              {branch[key]}
            </div>
            <div className="branch-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="branch-card-actions">
        <button
          className="btn btn-q"
          style={{ flex: 1 }}
          onClick={() => onDetails(branch)}
        >
          التفاصيل
        </button>
        <button className="btn btn-g" aria-label="تعديل الفرع" onClick={() => onEdit(branch)}>
          {EDIT_ICON}
        </button>
        <div className="branch-more-menu">
          <button className="btn btn-g" aria-label="المزيد" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{MORE_ICON}</button>
          {menuOpen && <div className="branch-actions-dropdown"><button onClick={() => { onDetails(branch); setMenuOpen(false) }}>عرض التفاصيل</button><button onClick={() => { onEdit(branch); setMenuOpen(false) }}>تعديل الفرع</button><button onClick={() => { copyPhone(); setMenuOpen(false) }}>نسخ رقم الهاتف</button></div>}
        </div>
      </div>
    </div>
  )
}
