import { useState } from "react";

import { useToast } from "../../components/ui/Toast";

import AnalyticsStats from "./components/AnalyticsStats";
import RevenueBySpecialty from "./components/RevenueBySpecialty";
import PeakHoursChart from "./components/PeakHoursChart";

import { periodOptions } from "./analytics.data";

export default function Analytics() {
  const { showToast } = useToast();

  const [activePeriod, setActivePeriod] = useState("اسبوع");

  function handlePeriodChange(period) {
    setActivePeriod(period);
  }

  function handleExportPdf() {
    showToast("جاري تصدير PDF...");
  }

  return (
    <div className="page-fade">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>التحليلات الشاملة</h1>

          <div className="sub">
            نظرة تفصيلية لأداء الفروع والأطباء والتشغيل
          </div>
        </div>

        <div className="page-actions">
          {/* Period Selector */}
          <div className="seg">
            {periodOptions.map((period) => (
              <button
                key={period}
                type="button"
                className={`seg-btn${
                  activePeriod === period ? " active" : ""
                }`}
                onClick={() => handlePeriodChange(period)}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Export PDF */}
          <button
            type="button"
            className="btn btn-q"
            onClick={handleExportPdf}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 15V4" />
              <path d="M12 15l-4-4" />
              <path d="M12 15l4-4" />
              <path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17" />
            </svg>

            تصدير PDF
          </button>
        </div>
      </div>

      {/* Analytics Statistics */}
      <AnalyticsStats />

      {/* Charts */}
      <div className="row c31">
        <RevenueBySpecialty />
        <PeakHoursChart />
      </div>
    </div>
  );
}