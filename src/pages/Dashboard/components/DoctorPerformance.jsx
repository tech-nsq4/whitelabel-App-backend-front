import { Star } from 'lucide-react'
import { useDoctors } from '../../../hooks/queries/useDoctors'
import { topDoctors } from '../dashboard.data'

export default function DoctorPerformance() {
  const { data, isLoading } = useDoctors({ per_page: 5, sort: '-patients_count' })

  const doctors = Array.isArray(data) ? data : (data?.data ?? [])
  const list = doctors.length > 0 ? doctors : topDoctors

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
            {isLoading && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--ink-45)', padding: '24px' }}>جاري التحميل...</td></tr>
            )}
            {!isLoading && list.map((doc) => {
              const isApi    = doctors.length > 0
              const name     = isApi ? (doc.name?.ar || doc.name?.en || '—') : doc.name
              const initial  = name !== '—' ? name.charAt(0) : '؟'
              const specObj  = doc.specializations?.[0]?.title
              const specialty = isApi
                ? (specObj?.ar || specObj?.en || '—')
                : doc.specialty
              const patients = isApi ? (doc.patients_count ?? '—') : doc.patients
              const rating   = isApi ? (doc.rating   ?? '—') : doc.rating
              const revenue  = isApi ? (doc.revenue  ?? '—') : doc.revenue

              return (
                <tr key={doc.id}>
                  <td>
                    <div className="td-lead">
                      <div className="avatar">{initial}</div>
                      <div>
                        <div className="td-name">{name}</div>
                        <div className="td-sub">{specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="num">{patients}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Star size={12} fill="var(--gold)" color="var(--gold)" />
                      <span className="num" style={{ fontSize: '12.5px', fontWeight: 600 }}>{rating}</span>
                    </span>
                  </td>
                  <td>
                    <span className="num" style={{ fontWeight: 600, color: 'var(--brand-d)' }}>{revenue}</span>
                    <span style={{ fontSize: '10.5px', color: 'var(--ink-45)', marginRight: 2 }}> ر.س</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
