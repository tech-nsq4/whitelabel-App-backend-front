import { patientStats } from '../patients.data'

const ICONS = {
  group: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="10" r="2.5"/>
      <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/>
      <path d="M17 14.5c2.5 0 4.5 1.8 4.5 4"/>
    </svg>
  ),
  person: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.6"/>
      <path d="M4.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5"/>
    </svg>
  ),
  star: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
      <circle cx="12" cy="12" r="3.5"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M12 5.5v13M5.5 12h13"/>
    </svg>
  ),
}

const UP_ICON = (
  <svg width="12" height="12" viewBox="0 0 24 24">
    <path d="M4 17l6-6 4 4 6-8"/><path d="M14 7h6v6"/>
  </svg>
)

export default function PatientStats() {
  return (
    <div className="kpi-grid patients-kpi-grid">
      {patientStats.map((stat) => (
        <div key={stat.id} className={`kpi patients-kpi patients-kpi-${stat.id}`}>
          <div className="kpi-head">
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-icon">{ICONS[stat.icon]}</div>
          </div>
          <div className="kpi-value num">{stat.value}</div>
          <div>
            {stat.delta && (
              <span className={`kpi-delta ${stat.deltaType}`}>
                {stat.deltaType === 'up' && UP_ICON}
                {stat.delta}
              </span>
            )}
            <span className="kpi-note">{stat.note}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
