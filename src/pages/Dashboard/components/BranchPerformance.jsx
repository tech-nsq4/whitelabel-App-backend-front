import { MapPin } from "lucide-react";
import { branchPerformance } from "../dashboard.data";

const COLORS = [
  { bar: "var(--brand)", bg: "rgba(15,107,92,.08)" },
  { bar: "var(--brand-l)", bg: "rgba(26,139,119,.07)" },
  { bar: "var(--info)", bg: "rgba(44,109,170,.07)" },
];

export default function BranchPerformance() {
  return (
    <div className="panel dashboard-panel dashboard-branch-panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">أداء الفروع</div>
          <div className="panel-sub">3 فروع · هذا الأسبوع</div>
        </div>
      </div>
      <div className="panel-body" style={{ padding: "16px 20px" }}>
        {branchPerformance.map((branch, i) => {
          const c = COLORS[i] || COLORS[0];
          return (
            <div
              key={branch.name}
              className="branch-metric"
              style={{ background: c.bg }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <MapPin size={12} strokeWidth={1.8} color={c.bar} />
                  <span
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {branch.name}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 3 }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    {branch.value}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--ink-45)" }}>
                    ر.س
                  </span>
                </div>
              </div>
              <div className="progress" style={{ height: 6 }}>
                <div
                  className="progress-fill"
                  style={{ width: `${branch.pct}%`, background: c.bar }}
                />
              </div>
              <div
                style={{
                  marginTop: 5,
                  fontSize: "10px",
                  color: "var(--ink-45)",
                  textAlign: "left",
                }}
              >
                {branch.pct}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
