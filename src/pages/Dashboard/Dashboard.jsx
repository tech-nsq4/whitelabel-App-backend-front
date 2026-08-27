import { useState } from 'react'
import StatsCards from './components/StatsCards'
import RevenueChart from './components/RevenueChart'
import BranchPerformance from './components/BranchPerformance'
import RecentAppointments from './components/RecentAppointments'
import DoctorPerformance from './components/DoctorPerformance'
import { useAuth } from '../../context/AuthContext'
import { Download } from 'lucide-react'
import './Dashboard.css'

const PERIODS = ['اليوم', 'الأسبوع', 'الشهر', 'السنة']

export default function Dashboard() {
  const [period, setPeriod] = useState('اليوم')
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'بك'

  const todayLabel = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date())

  return (
    <div className="dashboard-page" style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-head">
        <div>
          <h1>مرحباً، {firstName} 👋</h1>
          <div className="sub">لمحة سريعة على أداء المجمع اليوم — {todayLabel}</div>
        </div>
        <div className="page-actions">
          <div className="seg">
            {PERIODS.map((p) => (
              <div key={p} className={`seg-btn${period === p ? ' active' : ''}`}
                onClick={() => setPeriod(p)}>
                {p}
              </div>
            ))}
          </div>
          <button className="btn btn-q">
            <Download size={14} strokeWidth={1.8} />
            تصدير
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <StatsCards period={period} />

      {/* Revenue + Branch performance */}
      <div className="row c31">
        <RevenueChart />
        <BranchPerformance />
      </div>

      {/* Recent appointments + Doctor performance */}
      <div className="row c31">
        <RecentAppointments />
        <DoctorPerformance />
      </div>
    </div>
  )
}
