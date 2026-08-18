import { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";

const BRANCH_KEYS = [
  { key: "العليا", label: "العليا" },
  { key: "النخيل", label: "النخيل" },
  { key: "الملقا", label: "الملقا" },
];

export default function ClinicEditModal({ open, onClose, specialty, onSave }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (specialty) {
      setForm({
        nameAr: specialty.nameAr,
        nameEn: specialty.nameEn,
        doctors: specialty.doctors,
        visitsPerDay: specialty.visitsPerDay,
        revenueMonth: specialty.revenueMonth,
        branches: specialty.branches,
      });
    }
  }, [specialty]);

  if (!specialty || !form) return null;

  function toggle(branchKey) {
    setForm((prev) => ({
      ...prev,
      branches: prev.branches.includes(branchKey)
        ? prev.branches.filter((b) => b !== branchKey)
        : [...prev.branches, branchKey],
    }));
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="تعديل التخصص"
      subtitle={`${form.nameAr} — ${form.nameEn}`}
    >
      <div className="field-row">
        <div className="field">
          <label className="field-label">اسم التخصص (عربي)</label>
          <input
            className="inp"
            value={form.nameAr}
            onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))}
          />
        </div>
        <div className="field">
          <label className="field-label">اسم التخصص (إنجليزي)</label>
          <input
            className="inp"
            dir="ltr"
            value={form.nameEn}
            onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">عدد الأطباء</label>
          <input
            className="inp num"
            type="number"
            min="0"
            value={form.doctors}
            onChange={(e) =>
              setForm((p) => ({ ...p, doctors: +e.target.value }))
            }
          />
        </div>
        <div className="field">
          <label className="field-label">الزيارات اليومية</label>
          <input
            className="inp num"
            type="number"
            min="0"
            value={form.visitsPerDay}
            onChange={(e) =>
              setForm((p) => ({ ...p, visitsPerDay: +e.target.value }))
            }
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">الفروع المتاحة</label>
        <div
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}
        >
          {BRANCH_KEYS.map(({ key, label }) => (
            <label
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form.branches.includes(key)}
                onChange={() => toggle(key)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          marginTop: 6,
        }}
      >
        <button className="btn btn-q" onClick={onClose}>
          إلغاء
        </button>
        <button
          className="btn btn-p"
          onClick={() => {
            onSave(form);
            onClose();
          }}
        >
          حفظ التغييرات
        </button>
      </div>
    </Modal>
  );
}
