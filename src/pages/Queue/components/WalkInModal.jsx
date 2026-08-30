import { useState, useMemo, useRef, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import { useClinics } from "../../../hooks/queries/useClinics";
import { useDoctors } from "../../../hooks/queries/useDoctors";
import { ChevronDown, Check } from "lucide-react";

// ── Custom Select ──────────────────────────────
function CustomSelect({ label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function h(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <div className="field" ref={ref} style={{ position: "relative" }}>
      <label className="field-label">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          minHeight: 42,
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--card)",
          border: `1.5px solid ${open ? "var(--brand)" : "var(--line)"}`,
          borderRadius: 10,
          cursor: "pointer",
          fontSize: 13,
          color: selected ? "var(--ink)" : "var(--ink-45)",
          boxShadow: open ? "0 0 0 3px var(--focus-ring)" : "none",
          transition: "border-color .15s, box-shadow .15s",
          textAlign: "right",
        }}
      >
        <span style={{ flex: 1, textAlign: "right" }}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          style={{
            color: "var(--ink-45)",
            transition: "transform .2s",
            transform: open ? "rotate(180deg)" : "none",
            flexShrink: 0,
            marginRight: 4,
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            left: 0,
            zIndex: 300,
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            boxShadow: "0 12px 32px rgba(10,31,27,.12)",
            overflow: "hidden",
            maxHeight: 220,
            overflowY: "auto",
            animation: "fadeIn .12s ease",
          }}
        >
          {options.map((o) => {
            const active = String(o.value) === String(value);
            return (
              <div
                key={o.value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  fontSize: 13,
                  cursor: "pointer",
                  background: active ? "rgba(15,107,92,.06)" : "none",
                  color: active ? "var(--brand-d)" : "var(--ink)",
                  fontWeight: active ? 600 : 400,
                  borderBottom: "1px solid var(--line)",
                  transition: "background .1s",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    e.currentTarget.style.background = "var(--paper)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "none";
                }}
              >
                <span>{o.label}</span>
                {active && (
                  <Check
                    size={13}
                    strokeWidth={2.5}
                    style={{ color: "var(--brand)", flexShrink: 0 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Modal ──────────────────────────────────
const INITIAL = {
  name: "",
  clinicId: "",
  doctorId: "",
  visitType: "كشف عام",
  notes: "",
};
const VISIT_TYPES = ["كشف عام", "إعادة كشف", "استشارة سريعة"];

export default function WalkInModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL);

  const { data: clinics = [] } = useClinics();
  const { data: doctors = [] } = useDoctors();

  const filteredDoctors = useMemo(() => {
    if (!form.clinicId) return doctors;
    return doctors.filter((d) => String(d.clinic_id) === String(form.clinicId));
  }, [doctors, form.clinicId]);

  const clinicOptions = clinics.map((c) => ({
    value: c.id,
    label: c.name?.ar || c.name,
  }));
  const doctorOptions = filteredDoctors.map((d) => ({
    value: d.id,
    label: d.name?.ar || d.name,
  }));
  const visitOptions = VISIT_TYPES.map((v) => ({ value: v, label: v }));

  function set(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "clinicId") next.doctorId = "";
      return next;
    });
  }

  function handleSubmit() {
    if (!form.name.trim()) return;
    const doctor = doctors.find((d) => String(d.id) === String(form.doctorId));
    const clinic = clinics.find((c) => String(c.id) === String(form.clinicId));
    onSubmit({
      ...form,
      doctorName: doctor?.name?.ar || "",
      clinicName: clinic?.name?.ar || "",
    });
    setForm(INITIAL);
  }

  function handleClose() {
    setForm(INITIAL);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="تسجيل حضور"
      subtitle="أضف مريضاً للطابور مباشرة"
    >
      <div className="field">
        <label className="field-label">المريض</label>
        <input
          className="inp"
          placeholder="ابحث بالاسم أو رقم الملف…"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </div>

      <div className="field-row">
        <CustomSelect
          label="العيادة"
          value={form.clinicId}
          onChange={(v) => set("clinicId", v)}
          options={clinicOptions}
          placeholder="اختر العيادة"
        />
        <CustomSelect
          label="الطبيب"
          value={form.doctorId}
          onChange={(v) => set("doctorId", v)}
          options={doctorOptions}
          placeholder="اختر الطبيب"
        />
      </div>

      <CustomSelect
        label="نوع الزيارة"
        value={form.visitType}
        onChange={(v) => set("visitType", v)}
        options={visitOptions}
        placeholder="نوع الزيارة"
      />

      <div className="field">
        <label className="field-label">ملاحظات</label>
        <textarea
          className="inp"
          rows={2}
          placeholder="أي ملاحظات…"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          marginTop: 6,
        }}
      >
        <button className="btn btn-q" onClick={handleClose}>
          إلغاء
        </button>
        <button
          className="btn btn-p"
          onClick={handleSubmit}
          disabled={!form.name.trim()}
        >
          تسجيل في الطابور
        </button>
      </div>
    </Modal>
  );
}
