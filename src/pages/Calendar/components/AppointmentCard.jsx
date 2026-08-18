export default function AppointmentCard({ patientName, doctorShortName, color, onClick }) {
  return (
    <div
      className="appointment-card"
      style={{ '--appointment-color': color, '--appointment-soft': `${color}15` }}
      onClick={onClick}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
        {patientName}
      </div>
      <div style={{ fontSize: 9.5, color: 'var(--ink-45)', marginTop: 1 }}>
        {doctorShortName}
      </div>
    </div>
  )
}
