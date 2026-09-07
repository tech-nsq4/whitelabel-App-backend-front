import { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import { useToast } from "../../../components/ui/Toast";
import { useClinics } from "../../../hooks/queries/useClinics";
import { useLocations } from "../../../hooks/queries/useLocations";
import { useUpdateClinicManager } from "../../../hooks/queries/useClinicManagers";
import { useValidation } from "../../../hooks/useValidation";
import PhoneInput, { normalizeSaudiPhone } from "../../../components/ui/PhoneInput";
import SpecSelect from "../../../components/ui/SpecSelect";

export default function EditClinicManagerModal({ manager, onClose }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const { errors, validate, clearError, resetErrors } = useValidation();

  const { data: clinics = [] } = useClinics();
  const { data: locations = [] } = useLocations();
  const updateManager = useUpdateClinicManager();

  useEffect(() => {
    if (manager)
      setForm({
        name:             manager.name || "",
        email:            manager.email || "",
        phone:            normalizeSaudiPhone(manager.phone || ""),
        management_scope: manager.management_scope || "clinic",
        clinic_id:        manager.clinic_id || "",
        location_id:      manager.location_id || "",
        app_lang:         manager.app_lang || "ar",
      });
  }, [manager]);

  function set(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
    clearError(field);
  }

  async function handleSubmit() {
    const ok = validate(form, {
      name:  "الاسم مطلوب",
      email: "البريد الإلكتروني مطلوب",
    });
    if (!ok) return;
    setSaving(true);
    try {
      await updateManager.mutateAsync({
        id: manager.id,
        data: {
          name:             form.name,
          email:            form.email,
          phone:            form.phone,
          management_scope: form.management_scope,
          clinic_id:   form.management_scope === "clinic"   ? form.clinic_id   || null : null,
          location_id: form.management_scope === "location" ? form.location_id || null : null,
          app_lang:         form.app_lang,
        },
      });
      showToast("تم تحديث بيانات المدير");
      resetErrors();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || "تعذر التحديث", "error");
    } finally {
      setSaving(false);
    }
  }

  if (!form) return null;

  return (
    <Modal open={!!manager} onClose={onClose} title="تعديل المدير" subtitle={manager?.name}>
      <div className="field-row">
        <div className="field">
          <label className="field-label">الاسم</label>
          <input
            className={`inp${errors.name ? " inp--error" : ""}`}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="field">
          <label className="field-label">رقم الهاتف</label>
          <PhoneInput value={form.phone} onChange={v => set("phone", v)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">البريد الإلكتروني</label>
        <input
          className={`inp${errors.email ? " inp--error" : ""}`}
          dir="ltr"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">نطاق الصلاحية</label>
          <SpecSelect
            value={form.management_scope}
            onChange={v => set("management_scope", v)}
            options={[
              { id: "all",      label: "كل العيادات" },
              { id: "location", label: "موقع محدد"   },
              { id: "clinic",   label: "عيادة محددة" },
            ]}
          />
        </div>
        <div className="field">
          <label className="field-label">لغة التطبيق</label>
          <SpecSelect
            value={form.app_lang}
            onChange={v => set("app_lang", v)}
            options={[
              { id: "ar", label: "العربية" },
              { id: "en", label: "English"  },
            ]}
          />
        </div>
      </div>

      {form.management_scope === "clinic" && (
        <div className="field">
          <label className="field-label">العيادة</label>
          <SpecSelect
            value={form.clinic_id}
            onChange={v => set("clinic_id", v)}
            options={clinics.map(c => ({ id: c.id, label: c.name?.ar || c.name }))}
            placeholder="اختر العيادة"
          />
        </div>
      )}

      {form.management_scope === "location" && (
        <div className="field">
          <label className="field-label">الموقع</label>
          <SpecSelect
            value={form.location_id}
            onChange={v => set("location_id", v)}
            options={locations.map(l => ({ id: l.id, label: l.name?.ar || l.name }))}
            placeholder="اختر الموقع"
          />
        </div>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
        <button className="btn btn-q" onClick={onClose}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSubmit} disabled={saving}>
          {saving ? "جارٍ الحفظ…" : "حفظ"}
        </button>
      </div>
    </Modal>
  );
}
