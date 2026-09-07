import { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import { getLocationsApi } from "../../../api/locations.api";
import { useValidation } from "../../../hooks/useValidation";
import SpecSelect from "../../../components/ui/SpecSelect";

const INITIAL = { name: "", location_id: "", address: "" };

export default function NewBranchModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL);
  const [locations, setLocations] = useState([]);
  const { errors, validate, clearError, resetErrors } = useValidation();

  useEffect(() => {
    getLocationsApi()
      .then(({ data }) => {
        const list = data.data || [];
        setLocations(list);
        if (list.length)
          setForm((prev) => ({ ...prev, location_id: list[0].id }));
      })
      .catch(() => {});
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  }

  function handleSubmit() {
    const ok = validate(form, { name: 'اسم العيادة مطلوب' });
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
      title="عيادة جديدة"
      subtitle="أضف عيادة جديدة"
    >
      <div className="field">
        <label className="field-label" htmlFor="branch-name">
          اسم العيادة
        </label>
        <input
          id="branch-name"
          className={`inp${errors.name ? ' inp--error' : ''}`}
          placeholder="مثال: عيادة الشفاء"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>
      <div className="field">
        <label className="field-label" htmlFor="branch-location">
          الموقع
        </label>
        <SpecSelect
          value={String(form.location_id)}
          onChange={(v) => handleChange("location_id", Number(v))}
          options={locations.map(l => ({ id: l.id, label: l.name?.ar || l.name }))}
          placeholder="اختر الموقع"
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="branch-address">
          العنوان التفصيلي
        </label>
        <input
          id="branch-address"
          className="inp"
          placeholder="الحي، الشارع، رقم المبنى"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
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
          إضافة العيادة
        </button>
      </div>
    </Modal>
  );
}
