import '../styles/appointment-card.css'

export default function AppointmentCard({
  patientName,
  doctorShortName,
  color,
  onClick,
  isSlot,
}) {
  if (isSlot) {
    return (
      <div
        className="appt-slot"
        style={{
          background: `${color}10`,
          border: `1px dashed ${color}40`,
        }}
      >
        <div
          className="appt-slot-dot"
          style={{ background: `${color}60` }}
        />
        <span className="appt-slot-time" style={{ color }}>
          {patientName}
        </span>
        <span className="appt-slot-label">متاح</span>
      </div>
    )
  }

  return (
    <div
      className="appointment-card"
      style={{
        '--appointment-color': color,
        '--appointment-soft': `${color}15`,
      }}
      onClick={onClick}
    >
      <div className="appt-card-name">{patientName}</div>
      <div className="appt-card-doctor">{doctorShortName}</div>
    </div>
  )
}
