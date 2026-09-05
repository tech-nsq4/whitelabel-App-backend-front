import { useState } from 'react'
import NewReportModal from './components/NewReportModal'
import { reportCards } from './reports.data'
import { useToast } from '../../components/ui/Toast'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

const ICONS = {
  card: (
    <svg width="20" height="20" viewBox="0 0 24 24" {...S}>
      <rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  'trend-down': (
    <svg width="20" height="20" viewBox="0 0 24 24" {...S}>
      <path d="M4 7l6 6 4-4 6 8"/><path d="M14 17h6v-6"/>
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" {...S}>
      <path d="M12 3l8 3v6c0 4.5-3 8-8 9-5-1-8-4.5-8-9V6l8-3z"/>
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" {...S}>
      <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>
    </svg>
  ),
  bars: (
    <svg width="20" height="20" viewBox="0 0 24 24" {...S}>
      <rect x="4" y="12" width="3" height="8" rx="1"/><rect x="10" y="6" width="3" height="14" rx="1"/>
      <rect x="16" y="9" width="3" height="11" rx="1"/><path d="M3 20h18"/>
    </svg>
  ),
}

const EXPORT_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" {...S}>
    <path d="M12 15V4M12 15l-4-4M12 15l4-4"/>
    <path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17"/>
  </svg>
)

// gradient per card
const GRADIENTS = {
  revenue:  'linear-gradient(135deg, #0F6B5C, #0A4F44)',
  expenses: 'linear-gradient(135deg, #B3402F, #8c2d20)',
  insurance:'linear-gradient(135deg, #2C6DAA, #1e4f7e)',
  visits:   'linear-gradient(135deg, #C9A227, #a07d12)',
  doctors:  'linear-gradient(135deg, #7C3AED, #5B21B6)',
}

const ROW1 = ['revenue', 'expenses', 'insurance']
const ROW2 = ['visits', 'doctors']

export default function Reports() {
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)

  function renderCard(card) {
    const grad = GRADIENTS[card.id]
    return (
      <div key={card.id} className="tile" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
        {/* Colored header */}
        <div style={{ background: grad, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {ICONS[card.icon]}
          </div>
          <div>
            <div style={{ fontFamily: "'Readex Pro'", fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{card.title}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>{card.sub}</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 18px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 12.5, color: 'var(--ink-70)', lineHeight: 1.75 }}>
            {card.desc}
          </div>
          <button
            className="btn btn-q"
            style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
            onClick={(e) => { e.stopPropagation(); showToast(`جاري تصدير ${card.title}...`) }}
          >
            {EXPORT_ICON}
            تصدير التقرير
          </button>
        </div>
      </div>
    )
  }

  const row1Cards = reportCards.filter((c) => ROW1.includes(c.id))
  const row2Cards = reportCards.filter((c) => ROW2.includes(c.id))

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>التقارير الشاملة</h1>
          <div className="sub">بيانات شاملة ودقيقة عن أداء العيادات</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-p" onClick={() => setModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" {...S}>
              <path d="M12 5.5v13M5.5 12h13"/>
            </svg>
            تقرير جديد
          </button>
        </div>
      </div>

      <div className="row c3">{row1Cards.map(renderCard)}</div>
      <div className="row c22" style={{ marginTop: 0 }}>{row2Cards.map(renderCard)}</div>

      <NewReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => { showToast('جاري تصدير التقرير...'); setModalOpen(false) }}
      />
    </div>
  )
}