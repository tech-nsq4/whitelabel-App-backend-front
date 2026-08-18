import { useState } from "react";
import AnalyticsStats from "./components/AnalyticsStats";
import RevenueBySpecialty from "./components/RevenueBySpecialty";
import PeakHoursChart from "./components/PeakHoursChart";
import { periodOptions } from "./analytics.data";
import { useToast } from "../../components/ui/Toast";

export default function Analytics() {
  const { showToast } = useToast();
  const [activePeriod, setActivePeriod] = useState("الشهر");

  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <div className="page-head">
        <div>
          <h1>التحليلات والذكاء</h1>
          <div className="sub">رؤية متكاملة لأداء المجمع بالأرقام والرسوم</div>
        </div>
        <div className="page-actions">
          <div className="seg">
            {periodOptions.map((p) => (
              <button
                key={p}
                className={`seg-btn${activePeriod === p ? " active" : ""}`}
                onClick={() => setActivePeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            className="btn btn-q"
            onClick={() => showToast("جارٍ تصدير PDF...")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 15V4M12 15l-4-4M12 15l4-4" />
              <path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17" />
            </svg>
            تصدير PDF
          </button>
        </div>
      </div>

      <AnalyticsStats />

      <div className="row c31">
        <RevenueBySpecialty />
        <PeakHoursChart />
      </div>
    </div>
  );
}
