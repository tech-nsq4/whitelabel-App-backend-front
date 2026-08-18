import { queueStats } from '../queue.data'

const ICONS = {
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/>
    </svg>
  ),
  person: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.6"/>
      <path d="M4.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M5 12.5l4.5 4.5L19 7"/>
    </svg>
  ),
  timer: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/>
    </svg>
  ),
}

export default function QueueStats() {
  return (
    <div className="kpi-grid queue-kpi-grid">
      {queueStats.map((stat) => (
        <div key={stat.id} className={`kpi queue-kpi queue-kpi-${stat.id}`}>
          <div className="kpi-head">
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-icon">{ICONS[stat.icon]}</div>
          </div>
          <div className="kpi-value num">
            {stat.value}
            {stat.unit && <span className="unit">{stat.unit}</span>}
          </div>
          <div className="kpi-note">{stat.note}</div>
        </div>
      ))}
    </div>
  )
}
