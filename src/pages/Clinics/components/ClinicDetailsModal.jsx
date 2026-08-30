import Modal from "../../../components/ui/Modal";
import "../styles/ClinicModals.css";

function Row({ label, value, highlight }) {
  return (
    <div className="cdm-row">
      <span className="cdm-row-label">{label}</span>
      <span className={`cdm-row-value${highlight ? " highlight" : ""}`}>{value}</span>
    </div>
  );
}

export default function ClinicDetailsModal({ open, onClose, specialty }) {
  if (!specialty) return null;

  const nameAr = specialty.title?.ar || specialty.nameAr || "";
  const nameEn = specialty.title?.en || specialty.nameEn || "";
  const subs   = specialty.sub_specializations || [];

  return (
    <Modal open={open} onClose={onClose} title={nameAr} subtitle={nameEn}>
      <div style={{ marginBottom: 6 }}>
        {specialty.description?.ar && (
          <div className="cdm-description">{specialty.description.ar}</div>
        )}
        <Row label="عدد الأطباء"        value={`${specialty.doctors_count ?? specialty.doctors ?? 0} طبيب`} />
        <Row label="التخصصات الفرعية"   value={`${specialty.sub_specializations_count ?? subs.length} تخصص`} />
        {subs.length > 0 && (
          <Row label="التخصصات الفرعية" value={subs.map((s) => s.title?.ar || s.title).join("، ")} />
        )}
      </div>
      <div className="cm-footer-end">
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  );
}
