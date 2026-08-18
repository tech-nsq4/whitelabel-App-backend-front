import { revenueBySpecialty } from '../analytics.data'

export default function RevenueBySpecialty() {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">توزيع الإيرادات</div>
          <div className="panel-sub">حسب التخصص · هذا الشهر</div>
        </div>
      </div>
      <div className="panel-body">
        {revenueBySpecialty.map((item) => (
          <div key={item.label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</div>
              <div className="num" style={{ fontSize: 12, color: 'var(--brand)' }}>
                {item.value} ر.س
              </div>
            </div>
            <div className="progress">
              <div className="progress-fill" style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
