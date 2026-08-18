import { Star } from 'lucide-react'
import { topDoctors } from '../dashboard.data'

export default function DoctorPerformance() {
  return (
    <div className="panel dashboard-panel dashboard-table-panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">أداء الأطباء</div>
          <div className="panel-sub">أعلى أداءً اليوم</div>
        </div>
      </div>
      <div className="dashboard-table-scroll">
        <table className="data">
          <thead>
            <tr>
              <th>الطبيب</th>
              <th>المرضى</th>
              <th>التقييم</th>
              <th>الإيراد</th>
            </tr>
          </thead>
          <tbody>
            {topDoctors.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div className="td-lead">
                    <div className="avatar">{doc.initial}</div>
                    <div>
                      <div className="td-name">{doc.name}</div>
                      <div className="td-sub">{doc.specialty}</div>
                    </div>
                  </div>
                </td>
                <td className="num">{doc.patients}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Star size={12} fill="var(--gold)" color="var(--gold)" />
                    <span className="num" style={{ fontSize: '12.5px', fontWeight: 600 }}>{doc.rating}</span>
                  </span>
                </td>
                <td>
                  <span className="num" style={{ fontWeight: 600, color: 'var(--brand-d)' }}>{doc.revenue}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--ink-45)', marginRight: 2 }}> ر.س</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
