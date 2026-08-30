import { MapPin } from "lucide-react";
import { useClinics } from "../../../hooks/queries/useClinics";
import { branchPerformance } from "../dashboard.data";

const COLORS = [
  { bar: "var(--brand)", bg: "rgba(15,107,92,.08)" },
  { bar: "var(--brand-l)", bg: "rgba(26,139,119,.07)" },
  { bar: "var(--info)", bg: "rgba(44,109,170,.07)" },
  { bar: "var(--warn)", bg: "rgba(201,162,39,.07)" },
];

const t = (val) => (val && typeof val === 'object' ? val.ar || val.en || '—' : val || '—')

export default function BranchPerformance() {
  const { data, isLoading } = useClinics()

  const clinics = Array.isArray(data) ? data : (data?.data ?? [])

  const maxVal = clinics.length > 0
    ? Math.max(...clinics.map((c) => c.appointments_count ?? 1), 1)
    : 0

  const displayList = clinics.length > 0
    ? clinics.slice(0, 4).map((c) => ({
        id:    c.id,
        name:  c.name?.ar || c.name?.en || t(c.name),
        value: c.revenue ?? '—',
        pct:   Math.round(((c.appointments_count ?? 1) / maxVal) * 100),
      }))
    : branchPerformance

  return (
    <div className="panel dashboard-panel dashboard-branch-panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">أداء الفروع</div>
          <div className="panel-sub">{displayList.length} فروع · هذا الأسبوع</div>
        </div>
      </div>
      <div className="panel-body" style={{ padding: "16px 20px" }}>
        {isLoading && (
          <div style={{ textAlign: 'center', color: 'var(--ink-45)', padding: '24px' }}>جاري التحميل...</div>
        )}
        {!isLoading && displayList.map((branch, i) => {
          const c = COLORS[i] || COLORS[0];
          const key = branch.id ?? branch.name ?? i;
          return (
            <div key={key} className="branch-metric" style={{ background: c.bg }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <MapPin size={12} strokeWidth={1.8} color={c.bar} />
                  <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--ink)" }}>
                    {branch.name}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>
                    {branch.value}
                  </span>
                  {branch.value !== '—' && (
                    <span style={{ fontSize: "11px", color: "var(--ink-45)" }}>ر.س</span>
                  )}
                </div>
              </div>
              <div className="progress" style={{ height: 6 }}>
                <div className="progress-fill" style={{ width: `${branch.pct}%`, background: c.bar }} />
              </div>
              <div style={{ marginTop: 5, fontSize: "10px", color: "var(--ink-45)", textAlign: "left" }}>
                {branch.pct}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
