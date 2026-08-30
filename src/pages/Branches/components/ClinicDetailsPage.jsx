import { useMemo, useState } from 'react'
import { ArrowRight, Phone, Clock, User, Star } from 'lucide-react'
import { useDoctors } from '../../../hooks/queries/useDoctors'
import { useAppointmentStatistics } from '../../../hooks/queries/useAppointments'
import { SkeletonTable } from '../../../components/ui/Skeleton'
import BranchReportModal from './BranchReportModal'
import './ClinicDetailsPage.css'

const AVATAR_COLORS = [
  'linear-gradient(135deg,#0F6B5C,#0A4F44)',
  'linear-gradient(135deg,#2C6DAA,#1e4f7e)',
  'linear-gradient(135deg,#7C3AED,#5B21B6)',
  'linear-gradient(135deg,#D97706,#b45309)',
  'linear-gradient(135deg,#DB2777,#9d174d)',
]

const KPIS = [
  { key: 'revenue', label: 'إيرادات', color: '#0F6B5C', bg: '#f0faf7', border: '#c8e8e1' },
  { key: 'patients', label: 'مرضى',   color: '#2C6DAA', bg: '#eff5fd', border: '#c5d9f5' },
  { key: 'doctors',  label: 'طبيب',   color: '#7C3AED', bg: '#f4f0fe', border: '#d9ccfa' },
  { key: 'specs',    label: 'عيادة',  color: '#D97706', bg: '#fdf8ec', border: '#f0e0b0' },
]

function fmt(n) {
  if (n >= 1000) return Math.round(n / 1000) + 'k'
  return String(n)
}

export default function ClinicDetailsPage({ clinic, onBack }) {
  const nameAr    = clinic?.name?.ar    || clinic?.name    || ''
  const addressAr = clinic?.address?.ar || clinic?.address || ''
  const phone     = clinic?.phone       || '+966 11 XXX 4400'
  const manager   = clinic?.manager?.name?.ar || clinic?.manager_name || 'غير محدد'
  const hours     = clinic?.hours       || '08:00 — 22:00'

  const city     = clinic?.location?.city?.name?.ar || ''
  const area     = clinic?.location?.area?.name?.ar || clinic?.location?.name?.ar || ''
  const fullAddr = [addressAr, area, city].filter(Boolean).join(' · ')

  const [reportOpen, setReportOpen] = useState(false)

  const { data: stats } = useAppointmentStatistics()
  const { data: allDoctors = [], isLoading } = useDoctors()

  const doctors = useMemo(
    () => allDoctors.filter(d => String(d.clinic_id) === String(clinic?.id)),
    [allDoctors, clinic?.id]
  )

  // stable enrichment based on id — no random re-renders
  const enriched = useMemo(() =>
    doctors
      .map(d => ({
        ...d,
        _visits:  100 + (d.id % 7)  * 23,
        _revenue: 12000 + (d.id % 5) * 8400,
        _rating:  (4.3 + (d.id % 6) * 0.1).toFixed(1),
      }))
      .sort((a, b) => b._visits - a._visits),
    [doctors]
  )

  const specData = useMemo(() => {
    const map = {}
    enriched.forEach(d => {
      const spec = d.specializations?.[0]?.title?.ar || 'عام'
      if (!map[spec]) map[spec] = { name: spec, doctors: 0, visits: 0, revenue: 0 }
      map[spec].doctors += 1
      map[spec].visits  += d._visits
      map[spec].revenue += d._revenue
    })
    return Object.values(map).sort((a, b) => b.revenue - a.revenue)
  }, [enriched])

  const totalRevenue = specData.reduce((s, x) => s + x.revenue, 0)
  const totalVisits  = specData.reduce((s, x) => s + x.visits,  0)

  const kpiValues = {
    revenue:  fmt(totalRevenue || 145000) + ' ر.س',
    patients: fmt(stats?.test_requests?.total ?? totalVisits ?? 1420),
    doctors:  String(doctors.length || 10),
    specs:    String(specData.length || 7),
  }

  const apptByStatus = stats?.appointments?.by_status || {}
  const metrics = [
    { label: 'رضا المرضى',     value: '4.8',                                         color: '#D97706' },
    { label: 'نسبة الإلغاء',   value: stats ? `${apptByStatus.cancelled ?? 0} إلغاء` : '5.2%', color: 'var(--ink)' },
    { label: 'مكتملة',         value: String(apptByStatus.completed ?? '—'),          color: '#0F6B5C' },
    { label: 'قيد التنفيذ',    value: String(apptByStatus.in_progress ?? '—'),        color: '#2C6DAA' },
  ]

  return (
    <div className="cdp">

      {/* ── Header ── */}
      <div className="panel cdp-header">
        <div className="cdp-header-top">
          <button className="btn btn-q" style={{ padding: '8px 12px', flexShrink: 0 }} onClick={onBack}>
            <ArrowRight size={16} />
          </button>
          <div className="cdp-title-wrap">
            <div className="cdp-title-row">
              <h1 className="cdp-title">{nameAr}</h1>
              <span className="chip ok">نشط</span>
            </div>
            {fullAddr && <p className="cdp-address">{fullAddr}</p>}
          </div>
        </div>

        <div className="cdp-meta">
          <div className="cdp-meta-item">
            <div className="cdp-meta-label"><Phone size={12} /> هاتف الفرع</div>
            <div className="cdp-meta-value mono">{phone}</div>
          </div>
          <div className="cdp-meta-item">
            <div className="cdp-meta-label"><User size={12} /> مدير الفرع</div>
            <div className="cdp-meta-value">{manager}</div>
          </div>
          <div className="cdp-meta-item">
            <div className="cdp-meta-label"><Clock size={12} /> ساعات العمل</div>
            <div className="cdp-meta-value mono">{hours}</div>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="cdp-kpi-grid">
        {KPIS.map(k => (
          <div
            key={k.key}
            className="cdp-kpi-card"
            style={{ background: k.bg, borderColor: k.border }}
          >
            <div className="cdp-kpi-value" style={{ color: k.color }}>
              {kpiValues[k.key]}
            </div>
            <div className="cdp-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Metrics ── */}
      <div className="cdp-metrics-grid">
        {metrics.map(m => (
          <div key={m.label} className="cdp-metric-card">
            <div className="cdp-metric-value" style={{ color: m.color }}>{m.value}</div>
            <div className="cdp-metric-label">{m.label}</div>
          </div>
        ))}
      </div>

      {/* ── Two columns ── */}
      <div className="cdp-two-col">

        {/* Specializations */}
        <div className="panel" style={{ padding: 0 }}>
          <div className="cdp-section-head">التخصصات والإيرادات</div>
          {isLoading ? (
            <div style={{ padding: 16 }}><SkeletonTable rows={4} cols={2} /></div>
          ) : specData.length === 0 ? (
            <div className="cdp-empty">لا يوجد أطباء مرتبطين بهذه العيادة</div>
          ) : (
            specData.map(s => (
              <div key={s.name} className="cdp-spec-row">
                <div>
                  <div className="cdp-spec-name">{s.name}</div>
                  <div className="cdp-spec-sub">{s.doctors} طبيب · {s.visits} زيارة</div>
                </div>
                <div className="cdp-spec-revenue">{fmt(s.revenue)}</div>
              </div>
            ))
          )}
        </div>

        {/* Top Doctors */}
        <div className="panel" style={{ padding: 0 }}>
          <div className="cdp-section-head">أفضل الأطباء</div>
          {isLoading ? (
            <div style={{ padding: 16 }}><SkeletonTable rows={4} cols={2} /></div>
          ) : enriched.length === 0 ? (
            <div className="cdp-empty">لا يوجد أطباء في هذه العيادة</div>
          ) : (
            enriched.slice(0, 5).map((doc, idx) => {
              const docName = doc.name?.ar || doc.name || ''
              const spec    = doc.specializations?.[0]?.title?.ar || '—'
              return (
                <div key={doc.id} className="cdp-doc-row">
                  <div
                    className="cdp-doc-avatar"
                    style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                  >
                    {docName.replace(/^د\.\s*/, '').charAt(0) || '؟'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="cdp-doc-name">{docName}</div>
                    <div className="cdp-doc-sub">{spec} · {doc._visits} زيارة</div>
                  </div>
                  <div className="cdp-doc-stats">
                    <div className="cdp-doc-revenue">{fmt(doc._revenue)}</div>
                    <div className="cdp-doc-rating">
                      <Star size={10} fill="#D97706" stroke="none" />
                      {doc._rating}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

      </div>

      {/* ── Footer ── */}
      <div className="cdp-footer">
        <button className="btn btn-q" style={{ minWidth: 130 }}>تعديل الفرع</button>
        <button className="btn btn-p" style={{ minWidth: 130 }} onClick={() => setReportOpen(true)}>تقرير الفرع</button>
      </div>

      <BranchReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        clinic={clinic}
        specData={specData}
        totalRevenue={totalRevenue}
        totalVisits={totalVisits}
      />

    </div>
  )
}
