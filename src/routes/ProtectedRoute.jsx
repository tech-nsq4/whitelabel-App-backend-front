import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, permission }) {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 16,
          color: "var(--ink-45)",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "rgba(179,64,47,.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--danger)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 6,
            }}
          >
            ليس لديك صلاحية الوصول
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-45)", maxWidth: 320 }}>
            هذه الصفحة تتطلب صلاحيات خاصة. تواصل مع مدير النظام لطلب الوصول.
          </div>
        </div>
      </div>
    );
  }

  return children;
}
