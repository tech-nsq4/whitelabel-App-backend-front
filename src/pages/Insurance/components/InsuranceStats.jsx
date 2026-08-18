import { insuranceStats } from '../insurance.data'
import KpiCard from '../../../components/ui/KpiCard'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

const ICONS = {
  shield: <svg width="18" height="18" viewBox="0 0 24 24" {...S}><path d="M12 3l8 3v6c0 4.5-3 8-8 9-5-1-8-4.5-8-9V6l8-3z"/></svg>,
  card:   <svg width="18" height="18" viewBox="0 0 24 24" {...S}><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>,
  check:  <svg width="18" height="18" viewBox="0 0 24 24" {...S}><path d="M5 12.5l4.5 4.5L19 7"/></svg>,
  x:      <svg width="18" height="18" viewBox="0 0 24 24" {...S}><path d="M6 6l12 12M18 6L6 18"/></svg>,
}

const TINTS = {
  claims:   { cardBg: '#f0faf7', border: '#c8e8e1', iconBg: 'rgba(15,107,92,0.12)',  iconColor: '#0F6B5C' },
  value:    { cardBg: '#eff5fd', border: '#c5d9f5', iconBg: 'rgba(44,109,170,0.12)', iconColor: '#2C6DAA' },
  approved: { cardBg: '#edfaf5', border: '#b8e8d4', iconBg: 'rgba(5,150,105,0.12)',  iconColor: '#059669', valueColor: 'var(--ok)' },
  rejected: { cardBg: '#fdf2f0', border: '#f5cdc8', iconBg: 'rgba(179,64,47,0.12)',  iconColor: '#B3402F', valueColor: 'var(--danger)' },
}

export default function InsuranceStats() {
  return (
    <div className="kpi-grid">
      {insuranceStats.map((stat) => (
        <KpiCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          note={stat.note}
          delta={stat.delta?.value}
          deltaType={stat.delta?.dir}
          icon={ICONS[stat.icon]}
          tint={TINTS[stat.id] || TINTS.claims}
        />
      ))}
    </div>
  )
}
