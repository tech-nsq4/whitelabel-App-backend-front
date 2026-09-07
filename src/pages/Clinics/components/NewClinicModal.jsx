import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import { useValidation } from "../../../hooks/useValidation";

const INITIAL = {
  nameAr: "",
  nameEn: "",
  descAr: "",
  descEn: "",
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
