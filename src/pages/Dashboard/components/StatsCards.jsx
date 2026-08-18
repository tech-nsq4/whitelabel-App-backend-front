import { Banknote, CalendarCheck, Users, Clock } from 'lucide-react'
import { kpiDataByPeriod } from '../dashboard.data'
import KpiCard from '../../../components/ui/KpiCard'

const ICONS = {
  revenue:   <Banknote     size={18} strokeWidth={1.7} />,
  calendar:  <CalendarCheck size={18} strokeWidth={1.7} />,
  patients:  <Users        size={18} strokeWidth={1.7} />,
  occupancy: <Clock        size={18} strokeWidth={1.7} />,
}

const TINTS = {
  revenue:      { cardBg: '#f0faf7', border: '#c8e8e1', iconBg: 'rgba(15,107,92,.12)',  iconColor: '#0F6B5C' },
  appointments: { cardBg: '#eff5fd', border: '#c5d9f5', iconBg: 'rgba(44,109,170,.12)', iconColor: '#2C6DAA' },
  patients:     { cardBg: '#f4f0fe', border: '#d9ccfa', iconBg: 'rgba(124,58,237,.12)', iconColor: '#7C3AED' },
  occupancy:    { cardBg: '#fdf8ec', border: '#f0e0b0', iconBg: 'rgba(201,162,39,.12)', iconColor: '#C9A227' },
}

export default function StatsCards({ period }) {
  const kpiData = kpiDataByPeriod[period] || kpiDataByPeriod['اليوم']

  return (
    <div className="kpi-grid dashboard-kpi-grid">
      {kpiData.map((kpi) => (
        <KpiCard
          key={kpi.id}
          label={kpi.label}
          value={kpi.value}
          unit={kpi.unit}
          note={kpi.note}
          delta={kpi.delta}
          deltaType={kpi.deltaType}
          icon={ICONS[kpi.icon]}
          tint={TINTS[kpi.id] || TINTS.revenue}
        />
      ))}
    </div>
  )
}
