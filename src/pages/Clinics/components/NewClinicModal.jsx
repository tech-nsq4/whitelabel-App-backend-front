import { useState } from "react";
import Modal from "../../../components/ui/Modal";

const INITIAL = {
  nameAr: "",
  nameEn: "",
  branches: { olaya: true, nakheel: true, malqa: false },
  priceCashFirst: "",
  priceInsFirst: "",
  priceCashRepeat: "",
  priceInsRepeat: "",
  duration: "30 دقيقة",
};

export default function NewClinicModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBranchToggle(key) {
    setForm((prev) => ({
      ...prev,
      branches: { ...prev.branches, [key]: !prev.branches[key] },
    }));
  }

  function handleSubmit() {
    onSubmit(form);
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
      title="تخصص جديد"
      subtitle="أضف تخصصاً طبياً جديداً"
    >
      <div className="field">
        <label className="field-label" htmlFor="clinic-name-ar">
          اسم التخصص (عربي)
        </label>
        <input
          id="clinic-name-ar"
          className="inp"
          placeholder="مثال: جراحة عامة"
          value={form.nameAr}
          onChange={(e) => handleChange("nameAr", e.target.value)}
        />
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
        <label className="field-label">الفروع المتاحة</label>
        <div
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}
        >
          {[
            { key: "olaya", label: "العليا" },
            { key: "nakheel", label: "النخيل" },
            { key: "malqa", label: "الملقا" },
          ].map(({ key, label }) => (
            <label
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "12.5px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form.branches[key]}
                onChange={() => handleBranchToggle(key)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="clinic-price-cash-first">
            سعر الكشف الأول (نقد)
          </label>
          <input
            id="clinic-price-cash-first"
            className="inp num"
            placeholder="150"
            dir="ltr"
            value={form.priceCashFirst}
            onChange={(e) => handleChange("priceCashFirst", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="clinic-price-ins-first">
            سعر الكشف الأول (تأمين)
          </label>
          <input
            id="clinic-price-ins-first"
            className="inp num"
            placeholder="200"
            dir="ltr"
            value={form.priceInsFirst}
            onChange={(e) => handleChange("priceInsFirst", e.target.value)}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="clinic-price-cash-repeat">
            سعر إعادة الكشف (نقد)
          </label>
          <input
            id="clinic-price-cash-repeat"
            className="inp num"
            placeholder="80"
            dir="ltr"
            value={form.priceCashRepeat}
            onChange={(e) => handleChange("priceCashRepeat", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="clinic-price-ins-repeat">
            سعر إعادة الكشف (تأمين)
          </label>
          <input
            id="clinic-price-ins-repeat"
            className="inp num"
            placeholder="120"
            dir="ltr"
            value={form.priceInsRepeat}
            onChange={(e) => handleChange("priceInsRepeat", e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="clinic-duration">
          مدة الكشف الافتراضية
        </label>
        <select
          id="clinic-duration"
          className="inp"
          value={form.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
        >
          <option>15 دقيقة</option>
          <option>30 دقيقة</option>
          <option>45 دقيقة</option>
          <option>60 دقيقة</option>
        </select>
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
