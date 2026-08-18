import Modal from "../../../components/ui/Modal";

const ROW = ({ label, value, highlight }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "11px 0",
      borderBottom: "1px solid var(--line)",
    }}
  >
    <span style={{ fontSize: 12.5, color: "var(--ink-45)" }}>{label}</span>
    <span
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: highlight ? "var(--brand)" : "var(--ink)",
        fontFamily: highlight ? "'Readex Pro'" : "inherit",
      }}
    >
      {value}
    </span>
  </div>
);

export default function ClinicDetailsModal({ open, onClose, specialty }) {
  if (!specialty) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={specialty.nameAr}
      subtitle={specialty.nameEn}
    >
      <div style={{ marginBottom: 6 }}>
        <ROW label="عدد الأطباء" value={`${specialty.doctors} طبيب`} />
        <ROW
          label="الزيارات اليومية"
          value={`${specialty.visitsPerDay} زيارة/يوم`}
        />
        <ROW
          label="إيرادات الشهر"
          value={`${specialty.revenueMonth} ر.س`}
          highlight
        />
        <ROW label="الفروع المتاحة" value={specialty.branches.join("، ")} />
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
      >
        <button className="btn btn-q" onClick={onClose}>
          إغلاق
        </button>
      </div>
    </Modal>
  );
}
