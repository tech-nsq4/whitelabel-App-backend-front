import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import { useValidation } from "../../../hooks/useValidation";

const INITIAL = {
  nameAr: "",
  nameEn: "",
  descAr: "",
  descEn: "",
  online: false,
};

export default function NewClinicModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL);
  const { errors, validate, clearError, resetErrors } = useValidation();

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  }

  function handleBranchToggle(key) {
    setForm((prev) => ({
      ...prev,
      branches: { ...prev.branches, [key]: !prev.branches[key] },
    }));
  }

  function handleSubmit() {
    const ok = validate(form, { nameAr: 'اسم التخصص (عربي) مطلوب' });
    if (!ok) return;
    onSubmit(form);
    setForm(INITIAL);
    resetErrors();
  }

  function handleClose() {
    setForm(INITIAL);
    resetErrors();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="تخصص جديد"
      subtitle="أضف تخصصاً طبياً جديداً"
    >
      <div className="field">
        <label className="field-label" htmlFor="clinic-name-ar">
          اسم التخصص (عربي)
        </label>
        <input
          id="clinic-name-ar"
          className={`inp${errors.nameAr ? ' inp--error' : ''}`}
          placeholder="مثال: جراحة عامة"
          value={form.nameAr}
          onChange={(e) => handleChange("nameAr", e.target.value)}
        />
        {errors.nameAr && <span className="field-error">{errors.nameAr}</span>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="clinic-name-en">
          اسم التخصص (إنجليزي)
        </label>
        <input
          id="clinic-name-en"
          className="inp"
          placeholder="General Surgery"
          dir="ltr"
          value={form.nameEn}
          onChange={(e) => handleChange("nameEn", e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field-label">الوصف (عربي)</label>
        <input
          className="inp"
          placeholder="وصف مختصر للتخصص"
          value={form.descAr}
          onChange={(e) => handleChange("descAr", e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field-label">الوصف (إنجليزي)</label>
        <input
          className="inp"
          dir="ltr"
          placeholder="Brief description"
          value={form.descEn}
          onChange={(e) => handleChange("descEn", e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field-label" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
          <div
            role="switch"
            aria-checked={form.online}
            onClick={() => setForm((prev) => ({ ...prev, online: !prev.online }))}
            style={{
              width: 42,
              height: 24,
              borderRadius: 12,
              background: form.online ? "var(--primary, #0F6B5C)" : "#d1d5db",
              position: "relative",
              cursor: "pointer",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: form.online ? 21 : 3,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </div>
          يقبل حجوزات أونلاين
        </label>
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
        <button className="btn btn-p" onClick={handleSubmit}>
          إضافة التخصص
        </button>
      </div>
    </Modal>
  );
}
