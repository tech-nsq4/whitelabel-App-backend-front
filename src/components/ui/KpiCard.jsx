import { TrendingUp, TrendingDown } from 'lucide-react'

export default function KpiCard({ label, value, unit, note, delta, deltaType, icon, tint }) {
  return (
    <div
      className="kpi-card"
      style={{
        background: tint.cardBg,
        border: 'none',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(10,31,27,.09)' }}
      onMouseLeave={(e)  => { e.currentTarget.style.transform = 'none';             e.currentTarget.style.boxShadow = 'var(--shadow-xs)' }}
    >
      {/* Top accent line */}
      <div className="kpi-card-accent" style={{ background: tint.iconColor }} />

      {/* Header */}
      <div className="kpi-card-head">
        <span className="kpi-card-label">{label}</span>
        <div className="kpi-card-icon" style={{ background: tint.iconBg, color: tint.iconColor }}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="kpi-card-value">
        {value}
        {unit && <span className="kpi-card-unit">{unit}</span>}
      </div>

      {/* Footer */}
      <div className="kpi-card-foot">
        {delta && (
          <span className={`kpi-card-delta ${deltaType}`}>
            {deltaType === 'up'
              ? <TrendingUp  size={11} strokeWidth={2.2} />
              : <TrendingDown size={11} strokeWidth={2.2} />
            }
            {delta}
          </span>
        )}
        {note && <span className="kpi-card-note">{note}</span>}
      </div>
    </div>
  )
}
