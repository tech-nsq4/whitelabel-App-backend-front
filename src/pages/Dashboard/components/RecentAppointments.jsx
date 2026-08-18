import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { recentAppointments } from '../dashboard.data'

export default function RecentAppointments() {
  const navigate = useNavigate()

  return (
    <div className="panel dashboard-panel dashboard-table-panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">آخر المواعيد</div>
          <div className="panel-sub">آخر 6 مواعيد من كل الفروع</div>
        </div>
        <button className="btn btn-g" onClick={() => navigate('/calendar')}>
          عرض الكل
          <ArrowLeft size={13} strokeWidth={2} />
        </button>
      </div>
      <div className="dashboard-table-scroll">
        <table className="data">
          <thead>
            <tr>
              <th>المريض</th>
              <th>الطبيب</th>
              <th>الفرع</th>
              <th>الموعد</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {recentAppointments.map((appt) => (
              <tr key={appt.id}>
                <td>
                  <div className="td-lead">
                    <div className="avatar">{appt.patientInitial}</div>
                    <div>
                      <div className="td-name">{appt.patientName}</div>
                      <div className="td-sub num">{appt.patientRef}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="td-name">{appt.doctorName}</div>
                  <div className="td-sub">{appt.specialty}</div>
                </td>
                <td style={{ color: 'var(--ink-70)', fontSize: '12px' }}>{appt.branch}</td>
                <td className="num" style={{ fontSize: '11.5px' }}>{appt.time}</td>
                <td><span className={`chip ${appt.status}`}>{appt.statusLabel}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
