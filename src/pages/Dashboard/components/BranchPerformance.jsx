import { MapPin } from "lucide-react";
import { useClinics, useClinicDashboard } from "../../../hooks/queries/useClinics";

const COLORS = [
  { bar: "var(--brand)",   bg: "rgba(15,107,92,.08)"  },
  { bar: "var(--brand-l)", bg: "rgba(26,139,119,.07)" },
  { bar: "var(--info)",    bg: "rgba(44,109,170,.07)" },
  { bar: "var(--warn)",    bg: "rgba(201,162,39,.07)" },
];

function fmt(n) {
  if (!n && n !== 0) return '—'
  if (n >= 1000) return Math.round(n / 1000) + 'k'
  return String(n)
}

/* Each row fetches its own dashboard — hooks at component level = valid */
function ClinicRow({ clinic, color, maxRevenue }) {
  const { data: dash } = useClinicDashboard(clinic.id)
  const revenue  = dash?.stats?.revenue  ?? 0
  const patients = dash?.stats?.patients ?? 0
  const pct      = maxRevenue > 0 ? Math.min(Math.round((revenue / maxRevenue) * 100), 100) : 0
  const name     = clinic.name?.ar || clinic.name?.en || '—'

  return (
    <div className="branch-metric" style={{ background: color.bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <MapPin size={12} strokeWidth={1.8} color={color.bar} />
          <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--ink)" }}>{name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>{fmt(revenue)}</span>
          {revenue > 0 && <span style={{ fontSize: "11px", color: "var(--ink-45)" }}>ر.س</span>}
          <span style={{ fontSize: "11px", color: "var(--ink-45)", marginRight: 4 }}>{patients} مريض</span>
        </div>
      </div>
      <div className="progress" style={{ height: 6 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color.bar }} />
      </div>
      <div style={{ marginTop: 5, fontSize: "10px", color: "var(--ink-45)", textAlign: "left" }}>
        {pct}%
      </div>
    </div>
  )
}

/* 4 separate components — each has its own hook, no loop violation */
function Clinic0({ clinics, max }) { return clinics[0] ? <ClinicRow clinic={clinics[0]} color={COLORS[0]} maxRevenue={max} /> : null }
function Clinic1({ clinics, max }) { return clinics[1] ? <ClinicRow clinic={clinics[1]} color={COLORS[1]} maxRevenue={max} /> : null }
function Clinic2({ clinics, max }) { return clinics[2] ? <ClinicRow clinic={clinics[2]} color={COLORS[2]} maxRevenue={max} /> : null }
function Clinic3({ clinics, max }) { return clinics[3] ? <ClinicRow clinic={clinics[3]} color={COLORS[3]} maxRevenue={max} /> : null }

/* Parent collects revenues to compute max */
function ClinicRows({ clinics }) {
  const d0 = useClinicDashboard(clinics[0]?.id)
  const d1 = useClinicDashboard(clinics[1]?.id)
  const d2 = useClinicDashboard(clinics[2]?.id)
  const d3 = useClinicDashboard(clinics[3]?.id)

  const revenues = [
    d0.data?.stats?.revenue ?? 0,
    d1.data?.stats?.revenue ?? 0,
    d2.data?.stats?.revenue ?? 0,
    d3.data?.stats?.revenue ?? 0,
  ]
  const max = Math.max(...revenues, 1)

  return (
    <>
      <Clinic0 clinics={clinics} max={max} />
      <Clinic1 clinics={clinics} max={max} />
      <Clinic2 clinics={clinics} max={max} />
      <Clinic3 clinics={clinics} max={max} />
    </>
  )
}

export default function BranchPerformance() {
  const { data: clinics = [], isLoading } = useClinics()
  const top4 = clinics.slice(0, 4)

  return (
    <div className="panel dashboard-panel dashboard-branch-panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">أداء الفروع</div>
          <div className="panel-sub">{clinics.length} فروع · هذا الأسبوع</div>
        </div>
      </div>
      <div className="panel-body" style={{ padding: "16px 20px" }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', color: 'var(--ink-45)', padding: '24px' }}>جاري التحميل...</div>
        ) : top4.length > 0 ? (
          <ClinicRows clinics={top4} />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--ink-45)', padding: '24px' }}>لا توجد بيانات</div>
        )}
      </div>
    </div>
  )
}
