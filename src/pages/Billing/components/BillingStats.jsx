import { billingStats } from '../billing.data'
import KpiCard from '../../../components/ui/KpiCard'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

const ICONS = {
  card:   <svg width="18" height="18" viewBox="0 0 24 24" {...S}><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>,
  clock:  <svg width="18" height="18" viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/></svg>,
  cash:   <svg width="18" height="18" viewBox="0 0 24 24" {...S}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4M14 15h3"/></svg>,
  refund: <svg width="18" height="18" viewBox="0 0 24 24" {...S}><path d="M3 9l4-4 4 4M7 5v8a4 4 0 004 4h6"/></svg>,
}

const TINTS = {
  revenue: { cardBg: '#f0faf7', border: '#c8e8e1', iconBg: 'rgba(15,107,92,0.12)',  iconColor: '#0F6B5C' },
  pending: { cardBg: '#fdf8ec', border: '#f0e0b0', iconBg: 'rgba(201,162,39,0.12)', iconColor: '#C9A227', valueColor: 'var(--warn)' },
  cash:    { cardBg: '#eff5fd', border: '#c5d9f5', iconBg: 'rgba(44,109,170,0.12)', iconColor: '#2C6DAA' },
  refunds: { cardBg: '#fdf2f0', border: '#f5cdc8', iconBg: 'rgba(179,64,47,0.12)',  iconColor: '#B3402F', valueColor: 'var(--danger)' },
}

export default function BillingStats() {
  return (
    <div className="kpi-grid">
      {billingStats.map((stat) => (
        <KpiCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          note={stat.note}
          delta={stat.delta?.value}
          deltaType={stat.delta?.dir}
          icon={ICONS[stat.icon]}
          tint={TINTS[stat.id] || TINTS.revenue}
        />
      ))}
    </div>
  )
}
