import Modal from "../../../components/ui/Modal";

const AVATAR_COLORS = [
  "linear-gradient(135deg, #0F6B5C, #0A4F44)",
  "linear-gradient(135deg, #2C6DAA, #1e4f7e)",
  "linear-gradient(135deg, #7C3AED, #5B21B6)",
  "linear-gradient(135deg, #D97706, #b45309)",
  "linear-gradient(135deg, #DB2777, #9d174d)",
  "linear-gradient(135deg, #0891B2, #0e7490)",
  "linear-gradient(135deg, #059669, #047857)",
  "linear-gradient(135deg, #9333EA, #7e22ce)",
];

const STATUS_CONFIG = {
  active: { label: "نشط", color: "var(--ok)", bg: "rgba(15,107,92,0.1)" },
  leave: { label: "إجازة", color: "var(--warn)", bg: "rgba(169,118,18,0.1)" },
  inactive: { label: "غير نشط", color: "var(--ink-45)", bg: "var(--paper)" },
};

function Row({ label, value, mono }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <span style={{ fontSize: 12, color: "var(--ink-45)" }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--ink)",
          fontFamily: mono ? "'Readex Pro'" : "inherit",
        }}
        dir={mono ? "ltr" : undefined}
      >
        {value}
      </span>
    </div>
  );
}

export default function DoctorFileModal({ open, onClose, doctor, index = 0 }) {
  if (!doctor) return null;
  const avatarBg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const nameAr = doctor.name?.ar || doctor.name || "";
  const specialty = doctor.specializations?.[0]?.title?.ar || "—";
  const clinicName = doctor.clinic?.name?.ar || "—";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="ملف الطبيب"
      subtitle={specialty}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
          padding: "14px 18px",
          background: "var(--paper)",
          borderRadius: 12,
          border: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: avatarBg,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Readex Pro'",
            fontSize: 18,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {nameAr.charAt(3) || nameAr.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Readex Pro'",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            {nameAr}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-45)", marginTop: 3 }}>
            {specialty} · {clinicName}
          </div>
        </div>
        <span className="chip ok">نشط</span>
      </div>

      <Row label="العيادة" value={clinicName} />
      <Row label="التخصص" value={specialty} />
      <Row label="سعر الكشف" value={`${doctor.price} ر.س`} mono />
      <Row label="سنوات الخبرة" value={`${doctor.experience} سنة`} mono />
      <Row label="الوصف" value={doctor.description?.ar || "—"} />

      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}
      >
        <button className="btn btn-q" onClick={onClose}>
          إغلاق
        </button>
      </div>
    </Modal>
  );
}
