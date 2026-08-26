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
        style={{
          padding: "5px 10px",
          borderRadius: 7,
          background: `${color}10`,
          border: `1px dashed ${color}40`,
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "default",
        }}
      >
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: `${color}60`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color,
            fontFamily: "monospace",
          }}
        >
          {patientName}
        </span>
        <span
          style={{ fontSize: 10, color: "var(--ink-45)", marginRight: "auto" }}
        >
          متاح
        </span>
      </div>
    );
  }

  return (
    <div
      className="appointment-card"
      style={{
        "--appointment-color": color,
        "--appointment-soft": `${color}15`,
      }}
      onClick={onClick}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--ink)",
          lineHeight: 1.3,
        }}
      >
        {patientName}
      </div>
      <div style={{ fontSize: 9.5, color: "var(--ink-45)", marginTop: 1 }}>
        {doctorShortName}
      </div>
    </div>
  );
}
