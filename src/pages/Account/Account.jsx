import { useState } from "react";
import { useToast } from "../../components/ui/Toast";
import "./UserPages.css";

export default function Account() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "ناصر السالم",
    email: "nasser@alshifa.sa",
    phone: "0501234567",
  });

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
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
          onClick={() => showToast("تم حفظ بيانات الحساب")}
        >
          حفظ التغييرات
        </button>
      </div>
      <div className="user-page-grid">
        <section className="panel account-summary">
          <div className="account-avatar">ن</div>
          <h2>ناصر السالم</h2>
          <p>مدير النظام</p>
          <span className="chip ok">الحساب نشط</span>
          <div className="account-summary-note">
            يمكنك تعديل بيانات التواصل من القسم المقابل.
          </div>
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
            <div className="field">
              <label className="field-label" htmlFor="account-name">
                الاسم الكامل
              </label>
              <input
                id="account-name"
                className="inp"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
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
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
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
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
