import Modal from "../../../components/ui/Modal";

const ROW = ({ label, value, highlight }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
    <span style={{ fontSize: 12.5, color: "var(--ink-45)" }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 600, color: highlight ? "var(--brand)" : "var(--ink)" }}>
      {value}
    </span>
  </div>
)

export default function ClinicDetailsModal({ open, onClose, specialty }) {
  if (!specialty) return null

  const nameAr = specialty.title?.ar || specialty.nameAr || ''
  const nameEn = specialty.title?.en || specialty.nameEn || ''
  const subs   = specialty.sub_specializations || []

  return (
    <Modal open={open} onClose={onClose} title={nameAr} subtitle={nameEn}>
      <div style={{ marginBottom: 6 }}>
        {specialty.description?.ar && (
          <div style={{ fontSize: 13, color: 'var(--ink-45)', marginBottom: 16, lineHeight: 1.6 }}>
            {specialty.description.ar}
          </div>
        )}
        <ROW label="عدد الأطباء" value={`${specialty.doctors_count ?? specialty.doctors ?? 0} طبيب`} />
        <ROW label="التخصصات الفرعية" value={`${specialty.sub_specializations_count ?? subs.length} تخصص`} />
        {subs.length > 0 && (
          <ROW label="التخصصات الفرعية" value={subs.map((s) => s.title?.ar || s.title).join('، ')} />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}
