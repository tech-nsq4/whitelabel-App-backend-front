/**
 * DemoBanner — يظهر في الصفحات التي تعرض بيانات تجريبية ثابتة
 * وتحتاج إلى ربط بـ API من الـ Backend
 */
export default function DemoBanner({ page }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(201,162,39,.08)",
        border: "1.5px solid rgba(201,162,39,.35)",
        borderRadius: 12,
        padding: "12px 18px",
        marginBottom: 20,
        fontSize: 13,
        color: "var(--ink-70)",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A227"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <path d="M12 9v4m0 4h.01" />
      </svg>
      <div>
        <span style={{ fontWeight: 700, color: "#a07d12" }}>بيانات تجريبية — </span>
        صفحة <strong>{page}</strong> تعرض بيانات توضيحية ثابتة. يتطلب الربط الكامل توفير
        {" "}<strong>endpoints</strong> مخصصة من الـ Backend.
      </div>
    </div>
  );
}
