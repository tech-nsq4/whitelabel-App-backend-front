import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, LogIn,
  AlertCircle, LayoutDashboard, BarChart3,
  ShieldCheck, CalendarDays, Loader2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useBranding } from "../../hooks/useBranding";
import { ROUTES } from "../../constants";
import "./Login.css";

const FEATURES = [
  { icon: <LayoutDashboard size={18} strokeWidth={1.6} />, text: "إدارة متكاملة للمجمع الطبي" },
  { icon: <BarChart3     size={18} strokeWidth={1.6} />, text: "تحليلات وتقارير فورية" },
  { icon: <ShieldCheck   size={18} strokeWidth={1.6} />, text: "نظام صلاحيات متعدد الأدوار" },
  { icon: <CalendarDays  size={18} strokeWidth={1.6} />, text: "إدارة المواعيد والطوابير" },
];

export default function Login() {
  const { login } = useAuth();
  const { nameAr, nameEn, logo } = useBranding();
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim())    return setError("من فضلك أدخل البريد الإلكتروني");
    if (!password.trim()) return setError("من فضلك أدخل كلمة المرور");

    setLoading(true);
    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message
      setError(msg || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* ── Left panel — branding ───────────────── */}
      <div className="login-side">
        <div className="login-side-content">
          <div className="login-side-logo">
            {logo
              ? <img src={logo} alt="logo" />
              : <LayoutDashboard size={28} strokeWidth={1.5} color="#fff" />
            }
          </div>
          <h1 className="login-side-name">{nameAr}</h1>
          <p className="login-side-sub">{nameEn}</p>

          <div className="login-side-features">
            {FEATURES.map((f) => (
              <div key={f.text} className="login-feature">
                <span className="login-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="login-side-footer">نظام إدارة المجمعات الطبية © 2026</div>
      </div>

      {/* ── Right panel — form ──────────────────── */}
      <div className="login-main">
        <div className="login-card">
          <div className="login-card-head">
            <h2>مرحباً بك</h2>
            <p>أدخل بياناتك للدخول إلى لوحة التحكم</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="field">
              <label className="field-label" htmlFor="email">البريد الإلكتروني</label>
              <div className="login-input-wrap">
                <Mail size={15} strokeWidth={1.7} className="login-input-icon" />
                <input
                  id="email"
                  className={`inp login-inp${error ? ' has-error' : ''}`}
                  type="email"
                  placeholder="example@alshifa.sa"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  autoComplete="email"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label" htmlFor="password">كلمة المرور</label>
              <div className="login-input-wrap">
                <Lock size={15} strokeWidth={1.7} className="login-input-icon" />
                <input
                  id="password"
                  className={`inp login-inp${error ? ' has-error' : ''}`}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  autoComplete="current-password"
                  dir="ltr"
                />
                <button
                  type="button"
                  className="login-show-pass"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPass
                    ? <EyeOff size={15} strokeWidth={1.7} />
                    : <Eye    size={15} strokeWidth={1.7} />
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                <AlertCircle size={14} strokeWidth={2} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button className="btn btn-p login-btn" type="submit" disabled={loading}>
              {loading
                ? <Loader2 size={16} className="login-spinner-icon" />
                : <LogIn   size={16} strokeWidth={1.8} />
              }
              {loading ? "جاري الدخول..." : "دخول"}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}
