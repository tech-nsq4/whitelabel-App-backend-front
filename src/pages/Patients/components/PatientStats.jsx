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
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="17" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M12 5.5v13M5.5 12h13"/>
    </svg>
  ),
}

export default function PatientStats({ patients = [], isLoading }) {
  const verified   = patients.filter((p) => p.phone_verified_at).length
  const withAppts  = patients.filter((p) => (p.appointments_count ?? 0) > 0).length
  const today      = patients.filter((p) => {
    const d = new Date(p.created_at)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() &&
           d.getMonth()    === now.getMonth()    &&
           d.getDate()     === now.getDate()
  }).length

  const stats = [
    { id: 'total',    label: 'إجمالي المرضى',      value: patients.length, note: 'مريض مسجل',          icon: 'group'    },
    { id: 'verified', label: 'موثقو الجوال',        value: verified,        note: 'رقم جوال موثق',      icon: 'person'   },
    { id: 'active',   label: 'لديهم مواعيد',        value: withAppts,       note: 'مريض له موعد',       icon: 'calendar' },
    { id: 'today',    label: 'التسجيلات اليوم',     value: today,           note: 'مريض جديد اليوم',    icon: 'plus'     },
  ]

  return (
    <div className="kpi-grid patients-kpi-grid">
      {stats.map((stat) => (
        <div key={stat.id} className={`kpi patients-kpi patients-kpi-${stat.id}`}>
          <div className="kpi-head">
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-icon">{ICONS[stat.icon]}</div>
          </div>
          <div className="kpi-value num">
            {isLoading ? '—' : stat.value.toLocaleString('ar-SA')}
          </div>
          <div><span className="kpi-note">{stat.note}</span></div>
        </div>
      ))}
    </div>
  )
}
