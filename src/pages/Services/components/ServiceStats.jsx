import { serviceStats } from '../services.data'
import KpiCard from '../../../components/ui/KpiCard'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

const ICONS = {
  bag:   <svg width="18" height="18" viewBox="0 0 24 24" {...S}><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M12 11v6M9 14h6"/></svg>,
  grid:  <svg width="18" height="18" viewBox="0 0 24 24" {...S}><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>,
  trend: <svg width="18" height="18" viewBox="0 0 24 24" {...S}><path d="M4 17l6-6 4 4 6-8"/><path d="M14 7h6v6"/></svg>,
  card:  <svg width="18" height="18" viewBox="0 0 24 24" {...S}><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>,
}

const TINTS = {
  total:       { cardBg: '#f0faf7', border: '#c8e8e1', iconBg: 'rgba(15,107,92,0.12)',  iconColor: '#0F6B5C' },
  specialties: { cardBg: '#eff5fd', border: '#c5d9f5', iconBg: 'rgba(44,109,170,0.12)', iconColor: '#2C6DAA' },
  top:         { cardBg: '#fdf8ec', border: '#f0e0b0', iconBg: 'rgba(201,162,39,0.12)', iconColor: '#C9A227' },
  avg:         { cardBg: '#f4f0fe', border: '#d9ccfa', iconBg: 'rgba(124,58,237,0.12)', iconColor: '#7C3AED' },
}

export default function ServiceStats() {
  return (
    <div className="kpi-grid">
      {serviceStats.map((stat) => (
        <KpiCard
          key={stat.id}
          label={stat.label}
          value={stat.id === 'top' ? stat.valueText : stat.value}
          unit={stat.unit}
          note={stat.note}
          icon={ICONS[stat.icon]}
          tint={TINTS[stat.id] || TINTS.total}
        />
      ))}
    </div>
  )
}
