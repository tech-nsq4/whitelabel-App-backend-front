import KpiCard from '../../../components/ui/KpiCard'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

function InvoiceIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" {...S}><path d="M13.5 3H6.5A1.5 1.5 0 005 4.5v15A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V8.5z"/><path d="M13.5 3v5.5H19"/><path d="M8 13h8M8 17h5"/></svg> }
function RevenueIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" {...S}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4M14 15h3"/></svg> }
function OriginalIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/></svg> }
function DiscountIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" {...S}><path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg> }

const TINTS = {
  invoices: { cardBg: '#eff5fd', border: '#c5d9f5', iconBg: 'rgba(44,109,170,0.12)', iconColor: '#2C6DAA' },
  revenue:  { cardBg: '#f0faf7', border: '#c8e8e1', iconBg: 'rgba(15,107,92,0.12)',  iconColor: '#0F6B5C' },
  original: { cardBg: '#fdf8ec', border: '#f0e0b0', iconBg: 'rgba(201,162,39,0.12)', iconColor: '#C9A227' },
  discount: { cardBg: '#fdf2f0', border: '#f5cdc8', iconBg: 'rgba(179,64,47,0.12)',  iconColor: '#B3402F' },
}

export default function FinanceStats({ summary }) {
  if (!summary) return null

  const stats = [
    { id: 'invoices', label: 'عدد الفواتير',     value: summary.invoices_count, icon: <InvoiceIcon /> },
    { id: 'revenue',  label: 'إجمالي الإيرادات', value: summary.total_revenue,  unit: 'ر.س', icon: <RevenueIcon /> },
    { id: 'original', label: 'السعر الأصلي',      value: summary.total_original, unit: 'ر.س', icon: <OriginalIcon /> },
    { id: 'discount', label: 'إجمالي الخصومات',  value: summary.total_discount, unit: 'ر.س', icon: <DiscountIcon /> },
  ]

  return (
    <div className="kpi-grid">
      {stats.map((s) => (
        <KpiCard
          key={s.id}
          label={s.label}
          value={s.value}
          unit={s.unit}
          icon={s.icon}
          tint={TINTS[s.id]}
        />
      ))}
    </div>
  )
}
