import { peakHours } from "../analytics.data";

export default function PeakHoursChart() {
  return (
    <div className="panel">
      {/* Panel Header */}
      <div className="panel-head">
        <div>
          <div className="panel-title">أوقات الذروة</div>

          <div className="panel-sub">متوسط الزيارات حسب الساعة</div>
        </div>
      </div>

      {/* Chart */}
      <div className="panel-body">
        <div
          className="peak-hours-chart"
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 6,
            height: 180,
          }}
        >
          {peakHours.map((bar) => (
            <div
              key={bar.label}
              className="peak-hours-bar-wrapper"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              {/* Bar */}
              <div
                className="peak-hours-bar"
                style={{
                  width: "100%",
                  height: bar.height,
                  background: "var(--brand)",
                  borderRadius: "4px 4px 0 0",
                  opacity: bar.opacity,
                }}
              />

              {/* Label */}
              <div
                className="peak-hours-label"
                style={{
                  fontSize: 9,
                  color: "var(--ink-45)",
                }}
              >
                {bar.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
