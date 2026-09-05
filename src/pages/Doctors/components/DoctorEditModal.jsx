import { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import { updateDoctorApi } from "../../../api/doctors.api";
import { getClinicsApi } from "../../../api/clinics.api";
import { getSpecializationsApi } from "../../../api/specializations.api";
import { useToast } from "../../../components/ui/Toast";
import { useQueryClient } from "@tanstack/react-query";
import { DOCTORS_KEY } from "../../../hooks/queries/useDoctors";

export default function DoctorEditModal({ open, onClose, doctor, onSave }) {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({});
  const [clinics, setClinics] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ password: '', password_confirmation: '' });
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    getClinicsApi()
      .then(({ data }) => setClinics(data.data || []))
      .catch(() => {});
    getSpecializationsApi()
      .then(({ data }) => setSpecializations(data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!doctor) return;
    const nameParts = (doctor.name?.ar || "").split(" ");
    setForm({
      first_name: nameParts[0] || "",
      last_name: nameParts.slice(1).join(" ") || "",
      phone: doctor.phone || "",
      email: doctor.email || "",
      specialization_id: doctor.specializations?.[0]?.id || "",
      clinic_ids:
        doctor.clinics?.map((c) => c.id) ||
        (doctor.clinic_id ? [doctor.clinic_id] : []),
      license_number: doctor.license_number || "",
      license_expiry: doctor.license_expiry || "",
      pricing_type: "unified",
      price: doctor.price || "",
      experience: doctor.experience || "",
      descAr: doctor.description?.ar || "",
    });
  }, [doctor]);

  if (!doctor) return null;

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function toggleClinic(id) {
    setForm((p) => ({
      ...p,
      clinic_ids: p.clinic_ids.includes(id)
        ? p.clinic_ids.filter((x) => x !== id)
        : [...p.clinic_ids, id],
    }));
  }

  async function handleSave() {
    if (!form.first_name.trim()) return showToast("أدخل الاسم الأول", "error");
    setSaving(true);
    try {
      await updateDoctorApi(doctor.id, {
        name: {
          ar: `${form.first_name} ${form.last_name}`.trim(),
          en: `${form.first_name} ${form.last_name}`.trim(),
        },
        description: { ar: form.descAr || "", en: form.descAr || "" },
        phone: form.phone,
        email: form.email,
        experience: Number(form.experience) || 0,
        price: form.price,
        clinic_id: form.clinic_ids[0] || doctor.clinic_id,
        clinic_ids: form.clinic_ids,
        specialization_ids: form.specialization_id
          ? [Number(form.specialization_id)]
          : [],
        sub_specialization_ids: [],
        license_number: form.license_number,
        license_expiry: form.license_expiry,
      });
      qc.invalidateQueries({ queryKey: DOCTORS_KEY });
      showToast("تم حفظ التغييرات بنجاح", "success");
      onSave && onSave();
      onClose();
    } catch (err) {
      showToast(err?.response?.data?.message || "تعذر حفظ التغييرات", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!pwForm.password) return showToast("أدخل كلمة المرور الجديدة", "error");
    if (pwForm.password !== pwForm.password_confirmation) return showToast("كلمة المرور غير متطابقة", "error");
    setSavingPw(true);
    try {
      await updateDoctorApi(doctor.id, {
        password: pwForm.password,
        password_confirmation: pwForm.password_confirmation,
      });
      showToast("تم تغيير كلمة المرور بنجاح", "success");
      setPwForm({ password: '', password_confirmation: '' });
    } catch (err) {
      showToast(err?.response?.data?.message || "تعذر تغيير كلمة المرور", "error");
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="تعديل بيانات الطبيب"
      subtitle={`${form.first_name} ${form.last_name}`}
    >
      {/* الاسم */}
      <div className="field-row">
        <div className="field">
          <label className="field-label">الاسم الأول</label>
          <input
            className="inp"
            value={form.first_name || ""}
            onChange={(e) => set("first_name", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">اسم العائلة</label>
          <input
            className="inp"
            value={form.last_name || ""}
            onChange={(e) => set("last_name", e.target.value)}
          />
        </div>
      </div>

      {/* التخصص والجوال */}
      <div className="field-row">
        <div className="field">
          <label className="field-label">التخصص</label>
          <select
            className="inp"
            value={form.specialization_id || ""}
            onChange={(e) => set("specialization_id", e.target.value)}
          >
            <option value="">اختر التخصص</option>
            {specializations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title?.ar}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field-label">الجوال</label>
          <input
            className="inp num"
            dir="ltr"
            placeholder="+966 55 XXX XXXX"
            value={form.phone || ""}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
      </div>

      {/* البريد */}
      <div className="field">
        <label className="field-label">البريد الإلكتروني</label>
        <input
          className="inp"
          dir="ltr"
          value={form.email || ""}
          onChange={(e) => set("email", e.target.value)}
        />
      </div>

      {/* الفروع */}
      <div className="field">
        <label className="field-label">الفروع</label>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}
        >
          {clinics.map((c) => (
            <label
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={(form.clinic_ids || []).includes(c.id)}
                onChange={() => toggleClinic(c.id)}
                style={{ accentColor: "var(--brand)", width: 15, height: 15 }}
              />
              {c.name?.ar || c.name}
            </label>
          ))}
        </div>
      </div>

      {/* الرخصة */}
      <div className="field-row">
        <div className="field">
          <label className="field-label">رقم الرخصة الطبية</label>
          <input
            className="inp"
            dir="ltr"
            placeholder="SCFHS-XXXXX"
            value={form.license_number || ""}
            onChange={(e) => set("license_number", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">تاريخ انتهاء الرخصة</label>
          <input
            className="inp"
            type="date"
            value={form.license_expiry || ""}
            onChange={(e) => set("license_expiry", e.target.value)}
          />
        </div>
      </div>

      {/* التسعير */}
      <div className="field">
        <label className="field-label">تسعير الكشف</label>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {[
            { v: "unified", l: "سعر موحّد لكل الفروع" },
            { v: "per_branch", l: "سعر مختلف لكل فرع" },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                fontSize: 13,
                cursor: "pointer",
                border: `1.5px solid ${form.pricing_type === o.v ? "var(--brand)" : "var(--line)"}`,
                background:
                  form.pricing_type === o.v ? "var(--brand)" : "transparent",
                color: form.pricing_type === o.v ? "#fff" : "var(--ink)",
                fontFamily: "inherit",
              }}
              onClick={() => set("pricing_type", o.v)}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {form.pricing_type === "unified" && (
        <div className="field">
          <label className="field-label">سعر الكشف (ريال)</label>
          <input
            className="inp num"
            dir="ltr"
            value={form.price || ""}
            onChange={(e) => set("price", e.target.value)}
          />
        </div>
      )}

      {form.pricing_type === "per_branch" && (
        <div className="field">
          <label className="field-label">أسعار الفروع</label>
          {clinics.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 8,
                background: "var(--paper)",
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                {c.name?.ar || c.name}
              </span>
              <input
                className="inp num"
                dir="ltr"
                placeholder="150"
                style={{ width: 110 }}
                value={form[`price_${c.id}`] || ""}
                onChange={(e) => set(`price_${c.id}`, e.target.value)}
              />
              <span
                style={{ fontSize: 12, color: "var(--ink-45)", flexShrink: 0 }}
              >
                ر.س
              </span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: "var(--ink-45)", marginTop: 8 }}>
            💡 اترك الفرع فارغاً إذا لم يكن الطبيب يعمل فيه
          </div>
        </div>
      )}

      {/* الخبرة */}
      <div className="field">
        <label className="field-label">سنوات الخبرة</label>
        <input
          className="inp num"
          dir="ltr"
          placeholder="10"
          value={form.experience || ""}
          onChange={(e) => set("experience", e.target.value)}
        />
      </div>

      {/* نبذة */}
      <div className="field">
        <label className="field-label">نبذة عن الطبيب</label>
        <textarea
          className="inp"
          rows="3"
          placeholder="الخبرة والشهادات..."
          value={form.descAr || ""}
          onChange={(e) => set("descAr", e.target.value)}
        />
      </div>

      {/* تغيير كلمة المرور */}
      <div className="field" style={{ marginTop: 8, padding: '14px 16px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>تغيير كلمة المرور</div>
        <div className="field-row" style={{ marginBottom: 0 }}>
          <div className="field">
            <label className="field-label">كلمة المرور الجديدة</label>
            <input className="inp" dir="ltr" type="password" placeholder="••••••••"
              value={pwForm.password}
              onChange={e => setPwForm(p => ({ ...p, password: e.target.value }))} />
          </div>
          <div className="field">
            <label className="field-label">تأكيد كلمة المرور</label>
            <input className="inp" dir="ltr" type="password" placeholder="••••••••"
              value={pwForm.password_confirmation}
              onChange={e => setPwForm(p => ({ ...p, password_confirmation: e.target.value }))} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button className="btn btn-q" onClick={handleChangePassword} disabled={savingPw}>
            {savingPw ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
          </button>
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
        <button className="btn btn-p" onClick={handleSave} disabled={saving}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </Modal>
  );
}
