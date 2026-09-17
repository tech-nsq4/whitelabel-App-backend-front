import { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import PhoneInput from "../../../components/ui/PhoneInput";
import SpecSelect from "../../../components/ui/SpecSelect";
import { useValidation } from "../../../hooks/useValidation";
import { useCities } from "../../../hooks/queries/useCities";
import { useClinicManagers } from "../../../hooks/queries/useClinicManagers";
import { getLocationsApi } from "../../../api/locations.api";

const INITIAL = {
  name: "",
  city_id: "",
  location_id: "",
  address: "",
  phone: "",
  manager_id: "",
  work_start: "08:00",
  work_end: "22:00",
  status: "active",
};

export default function NewBranchModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL);
  const [locations, setLocations] = useState([]);
  const { errors, validate, clearError, resetErrors } = useValidation();

  const { data: cities = [] } = useCities();
  const { data: managers = [] } = useClinicManagers();

  // When city changes, load its locations/areas
  useEffect(() => {
    if (!form.city_id) {
      setLocations([]);
      return;
    }
    getLocationsApi()
      .then(({ data }) => {
        const all = data.data || [];
        // filter locations that belong to selected city
        const filtered = all.filter(
          (l) => String(l.city_id || l.city?.id) === String(form.city_id)
        );
        setLocations(filtered.length ? filtered : all);
      })
      .catch(() => {});
  }, [form.city_id]);

  // Pre-select first city on load
  useEffect(() => {
    if (cities.length && !form.city_id) {
      setForm((prev) => ({ ...prev, city_id: String(cities[0].id) }));
    }
  }, [cities]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  }

  function handleSubmit() {
    const ok = validate(form, { name: "اسم الفرع مطلوب" });
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
      title="فرع جديد"
      subtitle="أضف فرعاً جديداً للمجمع"
    >
      {/* Branch Name */}
      <div className="field">
        <label className="field-label" htmlFor="nb-name">
          اسم الفرع
        </label>
        <input
          id="nb-name"
          className={`inp${errors.name ? " inp--error" : ""}`}
          placeholder="مثال: فرع حي الياسمين"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      {/* City + Phone - two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="field" style={{ margin: 0 }}>
          <label className="field-label" htmlFor="nb-city">
            المدينة
          </label>
          <SpecSelect
            value={String(form.city_id)}
            onChange={(v) => {
              handleChange("city_id", v);
              handleChange("location_id", ""); // reset area on city change
            }}
            options={cities.map((c) => ({
              id: c.id,
              label: c.name?.ar || c.name || "",
            }))}
            placeholder="اختر المدينة"
          />
        </div>

        <div className="field" style={{ margin: 0 }}>
          <label className="field-label" htmlFor="nb-phone">
            هاتف الفرع
          </label>
          <PhoneInput
            id="nb-phone"
            value={form.phone}
            onChange={(v) => handleChange("phone", v)}
          />
        </div>
      </div>

      {/* Area/Location */}
      <div className="field">
        <label className="field-label" htmlFor="nb-location">
          الحي
        </label>
        <SpecSelect
          value={String(form.location_id)}
          onChange={(v) => handleChange("location_id", Number(v))}
          options={locations.map((l) => ({
            id: l.id,
            label: l.name?.ar || l.area?.name?.ar || l.name || "",
          }))}
          placeholder={form.city_id ? "اختر الحي" : "اختر المدينة أولاً"}
        />
      </div>

      {/* Detailed Address */}
      <div className="field">
        <label className="field-label" htmlFor="nb-address">
          العنوان التفصيلي
        </label>
        <input
          id="nb-address"
          className="inp"
          placeholder="الحي، الشارع، رقم المبنى"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      {/* Manager + Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="field" style={{ margin: 0 }}>
          <label className="field-label" htmlFor="nb-manager">
            مدير الفرع
          </label>
          <SpecSelect
            value={String(form.manager_id)}
            onChange={(v) => handleChange("manager_id", v)}
            options={[
              { id: "", label: "بدون مدير" },
              ...managers.map((m) => ({
                id: m.id,
                label:
                  m.name ||
                  m.full_name ||
                  `${m.first_name || ""} ${m.last_name || ""}`.trim() ||
                  `مدير #${m.id}`,
              })),
            ]}
            placeholder="اختر مديراً..."
          />
        </div>

        <div className="field" style={{ margin: 0 }}>
          <label className="field-label" htmlFor="nb-status">
            الحالة
          </label>
          <SpecSelect
            value={form.status}
            onChange={(v) => handleChange("status", v)}
            options={[
              { id: "active", label: "نشط" },
              { id: "inactive", label: "غير نشط" },
            ]}
          />
        </div>
      </div>

      {/* Working Hours */}
      <div className="field">
        <label className="field-label">ساعات العمل</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label
              style={{ fontSize: 11.5, color: "var(--ink-45)", marginBottom: 4, display: "block" }}
              htmlFor="nb-work-start"
            >
              من
            </label>
            <input
              id="nb-work-start"
              type="time"
              className="inp"
              value={form.work_start}
              onChange={(e) => handleChange("work_start", e.target.value)}
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
          </div>
          <div>
            <label
              style={{ fontSize: 11.5, color: "var(--ink-45)", marginBottom: 4, display: "block" }}
              htmlFor="nb-work-end"
            >
              إلى
            </label>
            <input
              id="nb-work-end"
              type="time"
              className="inp"
              value={form.work_end}
              onChange={(e) => handleChange("work_end", e.target.value)}
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
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
          إضافة الفرع
        </button>
      </div>
    </Modal>
  );
}
