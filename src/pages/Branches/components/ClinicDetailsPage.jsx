import { useState } from 'react'
import { ArrowRight, Phone, Clock, User, Star } from 'lucide-react'
import { useClinicDashboard } from '../../../hooks/queries/useClinics'
import { useTimeTables } from '../../../hooks/queries/useTimeTables'
import { SkeletonTable } from '../../../components/ui/Skeleton'
import BranchReportModal from './BranchReportModal'
import '../styles/ClinicDetailsPage.css'

const AVATAR_COLORS = [
  'linear-gradient(135deg,#0F6B5C,#0A4F44)',
  'linear-gradient(135deg,#2C6DAA,#1e4f7e)',
  'linear-gradient(135deg,#7C3AED,#5B21B6)',
  'linear-gradient(135deg,#D97706,#b45309)',
  'linear-gradient(135deg,#DB2777,#9d174d)',
]

const KPIS = [
  { key: 'revenue',  label: 'إيرادات',  color: '#0F6B5C', bg: '#f0faf7', border: '#c8e8e1' },
  { key: 'patients', label: 'مرضى',     color: '#2C6DAA', bg: '#eff5fd', border: '#c5d9f5' },
  { key: 'doctors',  label: 'أطباء',    color: '#7C3AED', bg: '#f4f0fe', border: '#d9ccfa' },
  { key: 'clinics',  label: 'عيادات',   color: '#D97706', bg: '#fdf8ec', border: '#f0e0b0' },
]

function fmt(n) {
  if (!n && n !== 0) return '—'
  if (n >= 1000) return Math.round(n / 1000) + 'k'
  return String(n)
}

export default function ClinicDetailsPage({ clinic, onBack }) {
  const [reportOpen, setReportOpen] = useState(false)
  const { data: dash, isLoading } = useClinicDashboard(clinic?.id)
  const { data: timeTables = [] } = useTimeTables()

  // compute working hours from active time tables for this clinic's doctors
  const clinicTables = timeTables.filter(t =>
    String(t.doctor?.clinic_id) === String(clinic?.id) && t.active
  )
  const allStarts = clinicTables.flatMap(t =>
    (t.schedules || []).map(s => s.first_shift_start).filter(Boolean)
  )
  const allEnds = clinicTables.flatMap(t =>
    (t.schedules || []).map(s => s.third_shift_end || s.second_shift_end || s.first_shift_end).filter(Boolean)
  )
  const earliest = allStarts.length ? allStarts.sort()[0] : null
  const latest   = allEnds.length   ? allEnds.sort().reverse()[0] : null
  const hours    = earliest && latest ? `${earliest} — ${latest}` : 'غير محدد'

  const stats       = dash?.stats        || {}
  const topDoctors  = dash?.top_doctors  || []
  const specs       = dash?.specializations || []
  const manager     = dash?.manager

  const nameAr    = dash?.clinic?.name?.ar    || clinic?.name?.ar    || clinic?.name    || ''
  const addressAr = dash?.clinic?.address?.ar || clinic?.address?.ar || clinic?.address || ''
  const city      = dash?.clinic?.location?.city?.name?.ar || clinic?.location?.city?.name?.ar || ''
  const area      = dash?.clinic?.location?.area?.name?.ar || clinic?.location?.area?.name?.ar || clinic?.location?.name?.ar || ''
  const fullAddr  = [addressAr, area, city].filter(Boolean).join(' · ')
  const kpiValues = {
    revenue:  fmt(stats.revenue) + (stats.revenue ? ' ر.س' : ''),
    patients: fmt(stats.patients),
    doctors:  fmt(stats.doctors),
    clinics:  fmt(stats.clinics),
  }

  const metrics = [
    { label: 'رضا المرضى',   value: stats.patient_satisfaction ? Number(stats.patient_satisfaction).toFixed(1) : '—', color: '#D97706' },
    { label: 'نسبة الإلغاء', value: stats.cancellation_rate != null ? `${stats.cancellation_rate}%` : '—',            color: 'var(--ink)' },
    { label: 'مكتملة',       value: fmt(stats.completed_bookings),                                                      color: '#0F6B5C' },
    { label: 'قيد التنفيذ',  value: fmt(stats.in_progress_bookings),                                                    color: '#2C6DAA' },
  ]

  const totalRevenue = specs.reduce((s, x) => s + (x.revenue || 0), 0)
  const totalVisits  = specs.reduce((s, x) => s + (x.visits  || 0), 0)

  return (
    <div className="cdp">
      {/* Header */}
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
            <div className="cdp-meta-value mono">{isLoading ? '...' : (dash?.manager?.phone || '—')}</div>
          </div>
          <div className="cdp-meta-item">
            <div className="cdp-meta-label"><User size={12} /> مدير الفرع</div>
            <div className="cdp-meta-value">{isLoading ? '...' : (dash?.manager?.name || 'غير محدد')}</div>
          </div>
          <div className="cdp-meta-item">
            <div className="cdp-meta-label"><Clock size={12} /> ساعات العمل</div>
            <div className="cdp-meta-value mono">{isLoading ? '...' : hours}</div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="panel" style={{ padding: 24 }}>
          <SkeletonTable rows={6} cols={4} />
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="cdp-kpi-grid">
            {KPIS.map(k => (
              <div key={k.key} className="cdp-kpi-card" style={{ background: k.bg, borderColor: k.border }}>
                <div className="cdp-kpi-value" style={{ color: k.color }}>{kpiValues[k.key]}</div>
                <div className="cdp-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="cdp-metrics-grid">
            {metrics.map(m => (
              <div key={m.label} className="cdp-metric-card">
                <div className="cdp-metric-value" style={{ color: m.color }}>{m.value}</div>
                <div className="cdp-metric-label">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Two columns */}
          <div className="cdp-two-col">
            {/* Specializations */}
            <div className="panel" style={{ padding: 0 }}>
              <div className="cdp-section-head">التخصصات والإيرادات</div>
              {specs.length === 0 ? (
                <div className="cdp-empty">لا توجد تخصصات</div>
              ) : (
                specs.map(s => (
                  <div key={s.id} className="cdp-spec-row">
                    <div>
                      <div className="cdp-spec-name">{s.title?.ar || s.title}</div>
                      <div className="cdp-spec-sub">{s.doctors_count} طبيب · {s.visits} زيارة</div>
                    </div>
                    <div className="cdp-spec-revenue">{fmt(s.revenue)}</div>
                  </div>
                ))
              )}
            </div>

            {/* Top Doctors */}
            <div className="panel" style={{ padding: 0 }}>
              <div className="cdp-section-head">أفضل الأطباء</div>
              {topDoctors.length === 0 ? (
                <div className="cdp-empty">لا يوجد أطباء</div>
              ) : (
                topDoctors.map((doc, idx) => {
                  const docName = doc.name?.ar || doc.name || ''
                  const spec    = doc.specializations?.[0]?.title?.ar || '—'
                  return (
                    <div key={doc.id} className="cdp-doc-row">
                      <div className="cdp-doc-avatar" style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
                        {docName.replace(/^د\.\s*/, '').charAt(0) || '؟'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="cdp-doc-name">{docName}</div>
                        <div className="cdp-doc-sub">{spec} · {doc.visits} زيارة</div>
                      </div>
                      <div className="cdp-doc-stats">
                        <div className="cdp-doc-revenue">{doc.avg_rate ? `${Number(doc.avg_rate).toFixed(1)} ★` : '—'}</div>
                        <div className="cdp-doc-rating">
                          <Star size={10} fill="#D97706" stroke="none" />
                          {doc.avg_rate ? Number(doc.avg_rate).toFixed(1) : '—'}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="cdp-footer">
        <button className="btn btn-q" style={{ minWidth: 130 }}>تعديل الفرع</button>
        <button className="btn btn-p" style={{ minWidth: 130 }} onClick={() => setReportOpen(true)}>تقرير الفرع</button>
      </div>

      <BranchReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        clinic={clinic}
        specData={specs.map(s => ({ name: s.title?.ar || s.title, doctors: s.doctors_count, visits: s.visits, revenue: s.revenue }))}
        totalRevenue={totalRevenue}
        totalVisits={totalVisits}
      />
    </div>
  )
}
