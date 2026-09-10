import { useClinics } from "../../../hooks/queries/useClinics";
import { useDoctors } from "../../../hooks/queries/useDoctors";
import { useSpecializations } from "../../../hooks/queries/useSpecializations";
import SpecSelect from "../../../components/ui/SpecSelect";
import "./OfferModal.css";

const today = new Date().toISOString().slice(0, 10);

export const OFFER_INITIAL = {
  nameAr: "",
  nameEn: "",
  descAr: "",
  descEn: "",
  discount_type: "percentage",
  discount_value: "",
  max_discount_amount: "",
  scope: "all",
  starts_at: today,
  ends_at: "",
  max_uses: "",
  max_uses_per_user: 1,
  auto_stop: true,
  show_on_home: false,
  status: "active",
  clinic_ids: [],
  doctor_ids: [],
  specialization_ids: [],
  cover: null,
};

export function buildOfferPayload(form, isUpdate = false) {
  const fd = new FormData();
  if (isUpdate) fd.append("_method", "PUT");
  fd.append("name[ar]", form.nameAr);
  fd.append("name[en]", form.nameEn || form.nameAr);
  fd.append("description[ar]", form.descAr);
  fd.append("description[en]", form.descEn || form.descAr);
  fd.append("discount_type", form.discount_type);
  fd.append("discount_value", Number(form.discount_value) || 0);
  if (form.max_discount_amount)
    fd.append("max_discount_amount", Number(form.max_discount_amount));
  fd.append("scope", form.scope);
  fd.append("starts_at", form.starts_at);
  if (form.ends_at) fd.append("ends_at", form.ends_at);
  if (form.max_uses) fd.append("max_uses", Number(form.max_uses));
  fd.append("max_uses_per_user", Number(form.max_uses_per_user) || 1);
  fd.append("auto_stop", form.auto_stop ? 1 : 0);
  fd.append("show_on_home", form.show_on_home ? 1 : 0);
  fd.append("status", form.status);
  const clinicIds = form.scope === "clinics" ? form.clinic_ids : [];
  const doctorIds = form.scope === "doctors" ? form.doctor_ids : [];
  const specializationIds =
    form.scope === "specializations" ? form.specialization_ids : [];
  // نبعت الـ arrays بس لو scope محدد — لو all مانبعتش حاجة
  if (clinicIds.length > 0) clinicIds.forEach((id) => fd.append("clinic_ids[]", id));
  if (doctorIds.length > 0) doctorIds.forEach((id) => fd.append("doctor_ids[]", id));
  if (specializationIds.length > 0) specializationIds.forEach((id) => fd.append("specialization_ids[]", id));
  if (form.cover instanceof File) fd.append("cover", form.cover);
  return fd;
}

export function offerToForm(offer) {
  return {
    nameAr: offer.name?.ar || "",
    nameEn: offer.name?.en || "",
    descAr: offer.description?.ar || "",
    descEn: offer.description?.en || "",
    discount_type: offer.discount_type || "percentage",
    discount_value: offer.discount_value || "",
    max_discount_amount: offer.max_discount_amount || "",
    scope: offer.scope || "all",
    starts_at: offer.starts_at || today,
    ends_at: offer.ends_at || "",
    max_uses: offer.max_uses || "",
    max_uses_per_user: offer.max_uses_per_user || 1,
    auto_stop: offer.auto_stop ?? true,
    show_on_home: offer.show_on_home ?? false,
    status: offer.status || "active",
    clinic_ids: offer.clinic_ids || [],
    doctor_ids: offer.doctor_ids || [],
    specialization_ids: offer.specialization_ids || [],
    cover: null,
  };
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle-switch-label">
      <div
        className={`toggle-switch ${checked ? "on" : "off"}`}
        onClick={onChange}
      >
        <div className="toggle-switch-knob" />
      </div>
      {label}
    </label>
  );
}

function MultiSelect({ label, options, selected, onChange }) {
  function toggle(id) {
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  }
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="multiselect-group">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`multiselect-btn${selected.includes(o.id) ? " active" : ""}`}
            onClick={() => toggle(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OfferForm({ form, set, errors = {} }) {
  const { data: clinics = [] } = useClinics();
  const { data: doctors = [] } = useDoctors();
  const { data: specializations = [] } = useSpecializations();

  return (
    <>
      <div className="field-row">
        <div className="field">
          <label className="field-label">اسم العرض (عربي)</label>
          <input
            className={`inp${errors.nameAr ? " inp--error" : ""}`}
            value={form.nameAr}
            onChange={(e) => set("nameAr", e.target.value)}
            placeholder="مثال: خصم الافتتاح"
          />
          {errors.nameAr && (
            <span className="field-error">{errors.nameAr}</span>
          )}
        </div>
        <div className="field">
          <label className="field-label">اسم العرض (إنجليزي)</label>
          <input
            className="inp"
            dir="ltr"
            value={form.nameEn}
            onChange={(e) => set("nameEn", e.target.value)}
            placeholder="Opening discount"
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">الوصف</label>
        <textarea
          className="inp"
          rows={2}
          value={form.descAr}
          onChange={(e) => set("descAr", e.target.value)}
          placeholder="وصف العرض..."
        />
      </div>

      <div className="field">
        <label className="field-label">نوع الخصم</label>
        <div className="discount-type-group">
          {[
            { v: "percentage", l: "نسبة مئوية %" },
            { v: "fixed", l: "خصم ثابت ج.م" },
            { v: "special_price", l: "سعر خاص" },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              className={`discount-type-btn${form.discount_type === o.v ? " active" : ""}`}
              onClick={() => set("discount_type", o.v)}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">
            {form.discount_type === "percentage"
              ? "نسبة الخصم (%)"
              : "قيمة الخصم (ج.م)"}
          </label>
          <input
            className={`inp num${errors.discount_value ? " inp--error" : ""}`}
            dir="ltr"
            type="number"
            min={0}
            value={form.discount_value}
            onChange={(e) => set("discount_value", e.target.value)}
            placeholder="20"
          />
          {errors.discount_value && (
            <span className="field-error">{errors.discount_value}</span>
          )}
        </div>
        {form.discount_type === "percentage" && (
          <div className="field">
            <label className="field-label">حد أقصى للخصم (ج.م) - اختياري</label>
            <input
              className="inp num"
              dir="ltr"
              type="number"
              min={0}
              value={form.max_discount_amount}
              onChange={(e) => set("max_discount_amount", e.target.value)}
              placeholder="100"
            />
          </div>
        )}
      </div>

      <div className="field">
        <label className="field-label">نطاق العرض</label>
        <SpecSelect
          value={form.scope}
          onChange={(v) => set("scope", v)}
          options={[
            { id: "all", label: "كل العيادات" },
            { id: "clinics", label: "عيادات محددة" },
            { id: "doctors", label: "أطباء محددون" },
            { id: "specializations", label: "تخصصات محددة" },
          ]}
        />
      </div>

      {form.scope === "clinics" && (
        <MultiSelect
          label="العيادات"
          selected={form.clinic_ids}
          onChange={(v) => set("clinic_ids", v)}
          options={clinics.map((c) => ({
            id: c.id,
            label: c.name?.ar || c.name,
          }))}
        />
      )}
      {form.scope === "doctors" && (
        <MultiSelect
          label="الأطباء"
          selected={form.doctor_ids}
          onChange={(v) => set("doctor_ids", v)}
          options={doctors.map((d) => ({
            id: d.id,
            label: d.name?.ar || d.name,
          }))}
        />
      )}
      {form.scope === "specializations" && (
        <MultiSelect
          label="التخصصات"
          selected={form.specialization_ids}
          onChange={(v) => set("specialization_ids", v)}
          options={specializations.map((s) => ({
            id: s.id,
            label: s.title?.ar || s.title,
          }))}
        />
      )}

      <div className="field-row">
        <div className="field">
          <label className="field-label">تاريخ البداية</label>
          <input
            className="inp"
            type="date"
            value={form.starts_at}
            onChange={(e) => set("starts_at", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">تاريخ الانتهاء (اختياري)</label>
          <input
            className="inp"
            type="date"
            value={form.ends_at}
            onChange={(e) => set("ends_at", e.target.value)}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">الحد الأقصى للاستخدام (اختياري)</label>
          <input
            className="inp num"
            dir="ltr"
            type="number"
            min={1}
            value={form.max_uses}
            onChange={(e) => set("max_uses", e.target.value)}
            placeholder="غير محدود"
          />
        </div>
        <div className="field">
          <label className="field-label">الحد لكل مستخدم</label>
          <input
            className="inp num"
            dir="ltr"
            type="number"
            min={1}
            value={form.max_uses_per_user}
            onChange={(e) => set("max_uses_per_user", e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">الحالة</label>
        <SpecSelect
          value={form.status}
          onChange={(v) => set("status", v)}
          options={[
            { id: "active", label: "نشط" },
            { id: "inactive", label: "متوقف" },
          ]}
        />
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
        <Toggle
          label="إيقاف تلقائي عند انتهاء الاستخدام"
          checked={form.auto_stop}
          onChange={() => set("auto_stop", !form.auto_stop)}
        />
        <Toggle
          label="عرض على الصفحة الرئيسية"
          checked={form.show_on_home}
          onChange={() => set("show_on_home", !form.show_on_home)}
        />
      </div>

      {/* صورة العرض */}
      <div className="field" style={{ marginTop: 12 }}>
        <label className="field-label">صورة العرض (اختياري)</label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            border: "1.5px dashed var(--line)",
            borderRadius: 10,
            padding: "10px 14px",
            background: "var(--paper)",
            transition: "border-color .2s",
          }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => set("cover", e.target.files[0] || null)}
          />
          {form.cover ? (
            <>
              <img
                src={URL.createObjectURL(form.cover)}
                alt="cover"
                style={{
                  width: 56,
                  height: 56,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <span style={{ fontSize: 13, color: "var(--ink)" }}>
                {form.cover.name}
              </span>
              <button
                type="button"
                style={{
                  marginRight: "auto",
                  fontSize: 12,
                  color: "var(--danger)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  set("cover", null);
                }}
              >
                حذف
              </button>
            </>
          ) : (
            <span style={{ fontSize: 13, color: "var(--ink-45)" }}>
              اضغط لاختيار صورة...
            </span>
          )}
        </label>
      </div>
    </>
  );
}
