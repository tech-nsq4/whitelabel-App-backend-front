import { Star } from 'lucide-react'
import { useTopRatedDoctors } from '../../../hooks/queries/useDoctors'

export default function DoctorPerformance() {
  const { data: doctors = [], isLoading } = useTopRatedDoctors(10)

  return (
    <div className="panel dashboard-panel dashboard-table-panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">أداء الأطباء</div>
          <div className="panel-sub">أعلى تقييماً</div>
        </div>
      </div>
      <div className="dashboard-table-scroll">
        <table className="data">
          <thead>
            <tr>
              <th>الطبيب</th>
              <th>التخصص</th>
              <th>التقييم</th>
              <th>السعر</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--ink-45)', padding: '24px' }}>
                  جاري التحميل...
                </td>
              </tr>
            ) : doctors.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--ink-45)', padding: '24px' }}>
                  لا يوجد بيانات
                </td>
              </tr>
            ) : doctors.map((doc) => {
              const name      = doc.name?.ar || doc.name?.en || '—'
              const initial   = name !== '—' ? name.replace(/^د\.\s*/, '').charAt(0) : '؟'
              const specialty = doc.specializations?.[0]?.title?.ar || doc.specializations?.[0]?.title?.en || '—'
              const clinic    = doc.clinic?.name?.ar || '—'
              const rating    = doc.avg_rate ? Number(doc.avg_rate).toFixed(1) : '—'
              const price     = doc.price ? `${doc.price}` : '—'

              return (
                <tr key={doc.id}>
                  <td>
                    <div className="td-lead">
                      <div className="avatar">{initial}</div>
                      <div>
                        <div className="td-name">{name}</div>
                        <div className="td-sub">{clinic}</div>
                      </div>
                    </div>
                  </td>
                  <td className="td-sub">{specialty}</td>
                  <td>
                    {rating !== '—' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Star size={12} fill="var(--gold)" color="var(--gold)" />
                        <span className="num" style={{ fontSize: '12.5px', fontWeight: 600 }}>{rating}</span>
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    <span className="num" style={{ fontWeight: 600, color: 'var(--brand-d)' }}>{price}</span>
                    {price !== '—' && <span style={{ fontSize: '10.5px', color: 'var(--ink-45)', marginRight: 2 }}> ر.س</span>}
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
