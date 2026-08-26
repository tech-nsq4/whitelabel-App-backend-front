import { peakHours } from "../analytics.data";

export default function PeakHoursChart() {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">أوقات الذروة</div>
          <div className="panel-sub">متوسط الزيارات حسب الساعة</div>
        </div>
      </div>
      <div className="panel-body">
        <div
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
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: "100%",
                  background: "var(--brand)",
                  borderRadius: "4px 4px 0 0",
                  height: bar.height,
                  opacity: bar.opacity,
                }}
              />
              <div style={{ fontSize: 9, color: "var(--ink-45)" }}>
                {bar.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
