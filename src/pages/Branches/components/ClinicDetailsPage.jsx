import { ArrowRight, MapPin, Users, UserRound, TrendingUp, Building2 } from 'lucide-react'
import KpiCard from '../../../components/ui/KpiCard'
import { useDoctors } from '../../../hooks/queries/useDoctors'
import { SkeletonTable } from '../../../components/ui/Skeleton'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

const BG_COLORS = [
  'linear-gradient(135deg,#0F6B5C,#0A4F44)',
  'linear-gradient(135deg,#2C6DAA,#1e4f7e)',
  'linear-gradient(135deg,#7C3AED,#5B21B6)',
  'linear-gradient(135deg,#D97706,#b45309)',
  'linear-gradient(135deg,#DB2777,#9d174d)',
]

export default function ClinicDetailsPage({ clinic, onBack }) {
  const nameAr    = clinic?.name?.ar || clinic?.name || ''
  const addressAr = clinic?.address?.ar || clinic?.address || ''
  const location  = clinic?.location?.name?.ar || ''
  const city      = clinic?.location?.city?.name?.ar || ''
  const area      = clinic?.location?.area?.name?.ar || ''

  const { data: allDoctors = [], isLoading } = useDoctors()
  const doctors = allDoctors.filter(d => String(d.clinic_id) === String(clinic?.id))

  const stats = [
    {
      id: 'doctors', label: 'الأطباء', value: String(doctors.length), note: 'طبيب نشط',
      icon: <UserRound size={18} {...S} />,
      tint: { cardBg: '#f0faf7', border: '#c8e8e1', iconBg: 'rgba(15,107,92,0.12)', iconColor: '#0F6B5C' },
    },
    {
      id: 'patients', label: 'المرضى', value: '—', note: 'غير متاح',
      icon: <Users size={18} {...S} />,
      tint: { cardBg: '#eff5fd', border: '#c5d9f5', iconBg: 'rgba(44,109,170,0.12)', iconColor: '#2C6DAA' },
    },
    {
      id: 'revenue', label: 'الإيرادات', value: '—', note: 'غير متاح',
      icon: <TrendingUp size={18} {...S} />,
      tint: { cardBg: '#fdf8ec', border: '#f0e0b0', iconBg: 'rgba(201,162,39,0.12)', iconColor: '#C9A227' },
    },
    {
      id: 'specs', label: 'التخصصات', value: '—', note: 'غير متاح',
      icon: <Building2 size={18} {...S} />,
      tint: { cardBg: '#f4f0fe', border: '#d9ccfa', iconBg: 'rgba(124,58,237,0.12)', iconColor: '#7C3AED' },
    },
  ]

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-q" style={{ padding: '8px 12px' }} onClick={onBack}>
            <ArrowRight size={16} />
          </button>
          <div>
            <h1>{nameAr}</h1>
            <div className="sub" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={13} />
              {[location, city, area].filter(Boolean).join(' · ')}
            </div>
          </div>
        </div>
        <span className="chip ok">نشط</span>
      </div>

      {addressAr && (
        <div className="panel" style={{ marginBottom: 20, padding: '14px 20px', fontSize: 13, color: 'var(--ink-70)' }}>
          {addressAr}
        </div>
      )}

      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        {stats.map(s => <KpiCard key={s.id} label={s.label} value={s.value} note={s.note} icon={s.icon} tint={s.tint} />)}
      </div>

      <div className="panel-head" style={{ marginBottom: 12 }}>
        <div className="panel-title">الأطباء</div>
      </div>
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 20 }}><SkeletonTable rows={3} cols={4} /></div>
        ) : doctors.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 13, color: 'var(--ink-45)' }}>
            لا يوجد أطباء في هذه العيادة
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>الطبيب</th>
                <th>التخصص</th>
                <th>السعر</th>
                <th>الخبرة</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc, idx) => {
                const docName   = doc.name?.ar || doc.name || ''
                const specialty = doc.specializations?.[0]?.title?.ar || '—'
                return (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: BG_COLORS[idx % BG_COLORS.length], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                          {docName.replace('د. ', '').charAt(0)}
                        </div>
                        <div className="td-name">{docName}</div>
                      </div>
                    </td>
                    <td><span className="chip mut">{specialty}</span></td>
                    <td><span className="num" style={{ fontWeight: 700 }}>{doc.price}</span> <span style={{ fontSize: 11, color: 'var(--ink-45)' }}>ج.م</span></td>
                    <td><span className="num">{doc.experience}</span> <span style={{ fontSize: 11, color: 'var(--ink-45)' }}>سنة</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
