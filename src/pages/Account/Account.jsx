import { useState } from "react";
import { useToast } from "../../components/ui/Toast";
import { useProfile, useUpdateProfile } from "../../hooks/queries/useProfile";
import { SkeletonBox } from "../../components/ui/Skeleton";
import { Loader2 } from "lucide-react";
import "./UserPages.css";

export default function Account() {
  const { showToast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: profile, isLoading: loading } = useProfile();
  const updateProfile = useUpdateProfile();

  // sync form with fetched profile
  const displayForm =
    form ??
    (profile
      ? {
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
        }
      : { name: "", email: "", phone: "" });

  function update(field, value) {
    setForm((current) => ({ ...(current ?? displayForm), [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile.mutateAsync(displayForm);
      showToast("تم حفظ بيانات الحساب");
    } catch {
      showToast("تعذر حفظ البيانات", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="user-page" style={{ animation: "fadeIn .3s ease" }}>
      <div className="page-head">
        <div>
          <h1>إدارة الحساب</h1>
          <div className="sub">تحديث معلومات حسابك وإعداداته الشخصية</div>
        </div>
        <button
          className="btn btn-p"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? <Loader2 size={15} className="login-spinner-icon" /> : null}
          حفظ التغييرات
        </button>
      </div>
      <div className="user-page-grid">
        <section className="panel account-summary">
          {loading ? (
            <>
              <SkeletonBox
                width={64}
                height={64}
                style={{ borderRadius: "50%", margin: "0 auto" }}
              />
              <SkeletonBox
                width={120}
                height={14}
                style={{ margin: "12px auto 8px" }}
              />
              <SkeletonBox
                width={80}
                height={22}
                style={{ borderRadius: 20, margin: "0 auto" }}
              />
            </>
          ) : (
            <>
              <div className="account-avatar">
                {displayForm.name?.charAt(0) || "؟"}
              </div>
              <h2>{displayForm.name}</h2>
              <span className="chip ok">الحساب نشط</span>
              <div className="account-summary-note">
                يمكنك تعديل بيانات التواصل من القسم المقابل.
              </div>
            </>
          )}
        </section>
        <section className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">المعلومات الشخصية</div>
              <div className="panel-sub">
                البيانات الظاهرة داخل لوحة الإدارة
              </div>
            </div>
          </div>
          <div className="panel-body">
            {loading ? (
              <>
                <div className="field">
                  <SkeletonBox height={36} style={{ borderRadius: 8 }} />
                </div>
                <div className="field-row">
                  <div className="field">
                    <SkeletonBox height={36} style={{ borderRadius: 8 }} />
                  </div>
                  <div className="field">
                    <SkeletonBox height={36} style={{ borderRadius: 8 }} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label className="field-label" htmlFor="account-name">
                    الاسم الكامل
                  </label>
                  <input
                    id="account-name"
                    className="inp"
                    value={displayForm.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label className="field-label" htmlFor="account-email">
                      البريد الإلكتروني
                    </label>
                    <input
                      id="account-email"
                      className="inp"
                      dir="ltr"
                      value={displayForm.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="account-phone">
                      رقم الجوال
                    </label>
                    <input
                      id="account-phone"
                      className="inp num"
                      dir="ltr"
                      value={displayForm.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
