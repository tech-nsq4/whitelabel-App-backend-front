import Modal from '../../../components/ui/Modal'
import '../styles/BranchReportModal.css'

function fmt(n) {
  if (n >= 1000) return Math.round(n / 1000) + 'k'
  return String(n)
}

export default function BranchReportModal({ open, onClose, clinic, specData = [], totalRevenue = 0, totalVisits = 0 }) {
  if (!clinic) return null

  const nameAr = clinic?.name?.ar || clinic?.name || ''
  const city   = clinic?.location?.city?.name?.ar || 'الرياض'
  const now    = new Date()
  const monthAr = now.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })

  const maxRevenue = Math.max(...specData.map(s => s.revenue), 1)

  const kpis = [
    { label: 'رضا المرضى',    value: '4.8 / 5', color: '#C9A227', bg: '#fdf8ec', border: '#f0e0b0' },
    { label: 'مرضى الشهر',   value: fmt(totalVisits || 1420),             color: 'var(--ink)', bg: '#f8f9fa', border: 'var(--line)' },
    { label: 'إجمالي الإيرادات', value: fmt(totalRevenue || 145000) + ' ر.س', color: 'var(--ink)', bg: '#f8f9fa', border: 'var(--line)' },
  ]

  const metrics = [
    { label: 'نسبة الإلغاء',   value: '5.2%' },
    { label: 'الإشغال',        value: '82%' },
    { label: 'متوسط الانتظار', value: '10 د' },
  ]

  return (
    <Modal open={open} onClose={onClose} title={`تقرير ${nameAr}`} subtitle={`${monthAr} · ${city}`}>
      <div className="brm">

        {/* KPI row */}
        <div className="brm-kpi-row">
          {kpis.map(k => (
            <div key={k.label} className="brm-kpi-card" style={{ background: k.bg, borderColor: k.border }}>
              <div className="brm-kpi-value" style={{ color: k.color }}>{k.value}</div>
              <div className="brm-kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Metrics row */}
        <div className="brm-metrics-row">
          {metrics.map((m, i) => (
            <div key={m.label} className="brm-metric" style={{ borderLeft: i < metrics.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div className="brm-metric-value">{m.value}</div>
              <div className="brm-metric-label">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="brm-divider" />

        {/* Revenue by specialization */}
        <div className="brm-section-title">الإيرادات حسب التخصص</div>

        {specData.length === 0 ? (
          <div className="brm-empty">لا توجد بيانات</div>
        ) : (
          <div className="brm-spec-list">
            {specData.map(s => (
              <div key={s.name} className="brm-spec-row">
                <div className="brm-spec-info">
                  <span className="brm-spec-name">{s.name}</span>
                  <span className="brm-spec-count">({s.doctors} طبيب)</span>
                </div>
                <div className="brm-spec-bar-wrap">
                  <div
                    className="brm-spec-bar"
                    style={{ width: `${Math.round((s.revenue / maxRevenue) * 100)}%` }}
                  />
                </div>
                <div className="brm-spec-revenue">{fmt(s.revenue)} ر.س</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="brm-footer">
          <button className="btn btn-q" style={{ minWidth: 120 }}>
            تصدير Excel
          </button>
          <button className="btn btn-p" style={{ flex: 1 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            تصدير PDF
          </button>
        </div>

      </div>
    </Modal>
  )
}
