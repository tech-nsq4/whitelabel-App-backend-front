import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import { useToast } from "../../../components/ui/Toast";
import { useClinics } from "../../../hooks/queries/useClinics";
import { useLocations } from "../../../hooks/queries/useLocations";
import { useCreateClinicManager } from "../../../hooks/queries/useClinicManagers";
import { useValidation } from "../../../hooks/useValidation";
import PhoneInput from "../../../components/ui/PhoneInput";
import SpecSelect from "../../../components/ui/SpecSelect";

const INITIAL = {
  name: "",
  email: "",
  phone: "",
  password: "",
  management_scope: "clinic",
  clinic_id: "",
  location_id: "",
  app_lang: "ar",
};

export default function NewClinicManagerModal({ open, onClose }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const { errors, validate, clearError, resetErrors } = useValidation();

  const { data: clinics = [] } = useClinics();
  const { data: locations = [] } = useLocations();
  const createManager = useCreateClinicManager();

  function set(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
    clearError(field);
  }

  async function handleSubmit() {
    const ok = validate(form, {
      name: 'الاسم مطلوب',
      email: 'البريد الإلكتروني مطلوب',
      password: 'كلمة المرور مطلوبة',
    });
    if (!ok) return;
    setSaving(true);
    try {
      await createManager.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.password,
        management_scope: form.management_scope,
        clinic_id:
          form.management_scope === "clinic" ? form.clinic_id || null : null,
        location_id:
          form.management_scope === "location"
            ? form.location_id || null
            : null,
        app_lang: form.app_lang,
      });
      showToast("تم إضافة المدير بنجاح");
      setForm(INITIAL);
      resetErrors();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || "تعذر الإضافة", "error");
    } finally {
      setSaving(false);
    }
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
      title="مدير جديد"
      subtitle="إضافة مدير عيادة"
    >
      <div className="field-row">
        <div className="field">
          <label className="field-label">الاسم</label>
          <input
            className={`inp${errors.name ? ' inp--error' : ''}`}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="الاسم الكامل"
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
          className={`inp${errors.email ? ' inp--error' : ''}`}
          dir="ltr"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="email@example.com"
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="field">
        <label className="field-label">كلمة المرور</label>
        <input
          className={`inp${errors.password ? ' inp--error' : ''}`}
          type="password"
          dir="ltr"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          placeholder="••••••••"
        />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">نطاق الصلاحية</label>
          <SpecSelect
            value={form.management_scope}
            onChange={v => set("management_scope", v)}
            options={[
              { id: "all",      label: "كل العيادات" },
              { id: "location", label: "موقع محدد"  },
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
        <button className="btn btn-p" onClick={handleSubmit} disabled={saving}>
          {saving ? "جارٍ الحفظ…" : "إضافة"}
        </button>
      </div>
    </Modal>
  );
}
