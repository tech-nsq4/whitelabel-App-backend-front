import { useState } from 'react'
import { Pill, FlaskConical, LayoutGrid, FileText, ChevronLeft, X, ScanLine } from 'lucide-react'
import '../styles/medical-records.css'

const AVATAR_COLORS = [
  '#0F6B5C','#2C6DAA','#7C3AED','#D97706','#DB2777','#B3402F','#059669',
]

const STATUS = {
  done:      { label: 'مكمل',     bg: 'rgba(15,107,92,.1)',   color: '#0F6B5C' },
  checkedin: { label: 'في الكشف', bg: 'rgba(44,109,170,.1)',  color: '#2C6DAA' },
  waiting:   { label: 'انتظار',   bg: 'rgba(201,162,39,.1)',  color: '#C9A227' },
  confirmed: { label: 'مؤكد',     bg: 'rgba(15,107,92,.08)',  color: '#0F6B5C' },
  cancelled: { label: 'ملغي',     bg: 'rgba(179,64,47,.1)',   color: '#B3402F' },
}

const VISIT_TYPE = { clinic: 'عيادة', home: 'منزل', video: 'فيديو' }

const RECORDS = [
  {
    id: 1, no: '#30412', patient: 'نورة العتيبي', status: 'done',
    doctor: 'د. خالد العبدي', specialty: 'باطنة', branch: 'فرع العليا', time: '4 أغسطس 2026 · 10:30 ص',
    visitType: 'clinic', isNew: false,
    note: 'متابعة شفط الدم — إعادة الكشف بعد أسبوعين',
    drugs:    [{ name: 'أملوديبين 5mg', dosage: 'مرة يومياً', duration: '30 يوم' }, { name: 'أسبرين 100mg', dosage: 'مرة يومياً', duration: 'مستمر' }],
    tests:    [{ name: 'صورة دم كاملة CBC', status: 'منتظر' }, { name: 'HbA1c', status: 'منتظر' }],
    analyses: [{ name: 'تحليل بول', result: 'طبيعي' }, { name: 'وظائف كلى', result: 'طبيعي' }],
    xrays:    [{ name: 'أشعة صدر', type: 'X-Ray', date: '2026-08-25' }],
    reports:  [{ name: 'تقرير متابعة شهري', date: '2026-08-25' }],
  },
  {
    id: 2, no: '#30298', patient: 'محمد الشمري', status: 'checkedin',
    doctor: 'د. سارة الحربي', specialty: 'جلدية', branch: 'فرع النخيل', time: '4 أغسطس 2026 · 11:00 ص',
    visitType: 'clinic', isNew: true, note: null,
    drugs: [], tests: [], analyses: [], xrays: [], reports: [],
  },
  {
    id: 3, no: '#30115', patient: 'فاطمة القرشي', status: 'done',
    doctor: 'د. عبدالله السالم', specialty: 'أسنان', branch: 'فرع الجهنا', time: '4 أغسطس 2026 · 12:15 م',
    visitType: 'clinic', isNew: false,
    note: 'تنظيف الأسنان — تم التنظيف',
    drugs:    [{ name: 'غسول فم كلورهيكسيدين', dosage: 'مرتين يومياً', duration: '10 أيام' }],
    tests:    [],
    analyses: [{ name: 'أشعة بانورامية', result: 'طبيعي' }],
    xrays:    [{ name: 'أشعة بانورامية للأسنان', type: 'Panoramic', date: '2026-08-25' }, { name: 'أشعة جانبية للفك', type: 'X-Ray', date: '2026-08-25' }],
    reports:  [{ name: 'تقرير حالة اللثة', date: '2026-08-25' }],
  },
  {
    id: 4, no: '#29882', patient: 'سعد المطيري', status: 'waiting',
    doctor: 'د. خالد العبدي', specialty: 'باطنة', branch: 'فرع العليا', time: '4 أغسطس 2026 · 10:30 ص',
    visitType: 'home', isNew: false,
    note: 'متابعة ضغط الدم في المنزل',
    drugs:    [{ name: 'ميتوبرولول 50mg', dosage: 'مرة يومياً', duration: '60 يوم' }],
    tests:    [{ name: 'ضغط الدم 24 ساعة', status: 'منتظر' }],
    analyses: [],
    xrays:    [],
    reports:  [],
  },
  {
    id: 5, no: '#29120', patient: 'أحمد الحربي', status: 'done',
    doctor: 'د. خالد العبدي', specialty: 'باطنة', branch: 'فرع العليا', time: '4 أغسطس 2026 · 9:00 ص',
    visitType: 'clinic', isNew: false,
    note: 'استقرار نسبي في مستوى السكر — استمرار الدواء',
    drugs:    [{ name: 'ميتفورمين 1000mg', dosage: 'مرتين يومياً', duration: '60 يوم' }, { name: 'جلوكوفاج XR', dosage: 'مرة مساءً', duration: '60 يوم' }],
    tests:    [{ name: 'HbA1c', status: 'مكتمل' }, { name: 'سكر صائم', status: 'مكتمل' }],
    analyses: [{ name: 'وظائف كلى', result: 'طبيعي' }, { name: 'كوليسترول', result: 'مرتفع قليلاً' }],
    xrays:    [{ name: 'أشعة قدم للأوعية الدموية', type: 'Doppler', date: '2026-07-10' }],
    reports:  [{ name: 'تقرير السكري الشهري', date: '2026-08-25' }],
  },
  {
    id: 6, no: '#30100', patient: 'طفل الشمري', status: 'confirmed',
    doctor: 'د. رهف الدوسري', specialty: 'أطفال', branch: 'فرع النخيل', time: '4 أغسطس 2026 · 9:30 ص',
    visitType: 'clinic', isNew: true, note: null,
    drugs: [], tests: [], analyses: [], xrays: [], reports: [],
  },
]

const STATUS_TABS = [
  { id: 'all', label: 'كل الحالات' },
  { id: 'done', label: 'مكمل' },
  { id: 'checkedin', label: 'في الكشف' },
  { id: 'waiting', label: 'انتظار' },
  { id: 'confirmed', label: 'مؤكد' },
]

const ACTION_BTNS = [
  { key: 'drugs',    label: 'الأدوية',   icon: <Pill size={14} strokeWidth={1.7} />,         color: '#0F6B5C' },
  { key: 'tests',    label: 'التحاليل',  icon: <FlaskConical size={14} strokeWidth={1.7} />,  color: '#2C6DAA' },
  { key: 'analyses', label: 'الوصفات',   icon: <LayoutGrid size={14} strokeWidth={1.7} />,    color: '#7C3AED' },
  { key: 'xrays',    label: 'الأشعة',    icon: <ScanLine size={14} strokeWidth={1.7} />,      color: '#DB2777' },
  { key: 'reports',  label: 'التقارير',  icon: <FileText size={14} strokeWidth={1.7} />,      color: '#D97706' },
]

const MODAL_CONFIG = {
  drugs: {
    title: 'الأدوية',
    icon: <Pill size={16} />,
    color: '#0F6B5C',
    render: (items) => items.map((d, i) => (
      <div key={i} className="mr-modal-row">
        <div className="mr-modal-row-main">
          <div className="mr-modal-item-name">{d.name}</div>
          <div className="mr-modal-item-sub">{d.dosage}</div>
        </div>
        <span className="mr-modal-badge green">{d.duration}</span>
      </div>
    )),
  },
  tests: {
    title: 'التحاليل',
    icon: <FlaskConical size={16} />,
    color: '#2C6DAA',
    render: (items) => items.map((t, i) => (
      <div key={i} className="mr-modal-row">
        <div className="mr-modal-item-name">{t.name}</div>
        <span className={`mr-modal-badge ${t.status === 'مكتمل' ? 'green' : 'blue'}`}>{t.status}</span>
      </div>
    )),
  },
  analyses: {
    title: 'الوصفات',
    icon: <LayoutGrid size={16} />,
    color: '#7C3AED',
    render: (items) => items.map((a, i) => (
      <div key={i} className="mr-modal-row">
        <div className="mr-modal-item-name">{a.name}</div>
        <span className={`mr-modal-badge ${a.result === 'طبيعي' ? 'green' : 'warn'}`}>{a.result}</span>
      </div>
    )),
  },
  xrays: {
    title: 'الأشعة',
    icon: <ScanLine size={16} />,
    color: '#DB2777',
    render: (items) => items.map((x, i) => (
      <div key={i} className="mr-modal-row">
        <div className="mr-modal-row-main">
          <div className="mr-modal-item-name">{x.name}</div>
          <div className="mr-modal-item-sub">{x.type}</div>
        </div>
        <span className="mr-modal-badge pink">{x.date}</span>
      </div>
    )),
  },
  reports: {
    title: 'التقارير',
    icon: <FileText size={16} />,
    color: '#D97706',
    render: (items) => items.map((r, i) => (
      <div key={i} className="mr-modal-row">
        <div className="mr-modal-item-name">{r.name}</div>
        <span className="mr-modal-badge gold">{r.date}</span>
      </div>
    )),
  },
}

function DataModal({ record, type, onClose }) {
  if (!record || !type) return null
  const cfg   = MODAL_CONFIG[type]
  const items = record[type] || []

  return (
    <div className="mr-modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mr-modal">
        {/* Header */}
        <div className="mr-modal-head" style={{ borderBottom: `2px solid ${cfg.color}20` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="mr-modal-icon" style={{ background: `${cfg.color}15`, color: cfg.color }}>
              {cfg.icon}
            </div>
            <div>
              <div className="mr-modal-title">{cfg.title}</div>
              <div className="mr-modal-sub">{record.patient} · {record.no}</div>
            </div>
          </div>
          <button className="mr-modal-close" onClick={onClose}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="mr-modal-body">
          {items.length === 0 ? (
            <div className="mr-modal-empty">لا توجد بيانات</div>
          ) : (
            cfg.render(items)
          )}
        </div>
      </div>
    </div>
  )
}

export default function MedicalRecords({ clinicFilter = 'all' }) {
  const [statusTab, setStatusTab] = useState('all')
  const [search, setSearch]       = useState('')
  const [modal, setModal]         = useState(null) // { record, type }

  const filtered = RECORDS.filter(r => {
    const matchStatus = statusTab === 'all' || r.status === statusTab
    const matchClinic = clinicFilter === 'all' || String(r.clinic_id) === String(clinicFilter)
    const matchSearch = !search.trim() ||
      r.patient.includes(search.trim()) ||
      r.no.includes(search.trim()) ||
      r.doctor.includes(search.trim())
    return matchStatus && matchClinic && matchSearch
  })

  return (
    <div>
      {/* Top filter bar */}
      <div className="mr-topbar">
        <div className="mr-status-tabs">
          {STATUS_TABS.map(t => (
            <button key={t.id} className={`mr-status-tab${statusTab === t.id ? ' active' : ''}`}
              onClick={() => setStatusTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: '0 0 240px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" stroke="var(--ink-45)" fill="none" strokeWidth="2" strokeLinecap="round"
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input className="inp" style={{ paddingRight: 32, minHeight: 36, fontSize: 12.5, borderRadius: 10 }}
            placeholder="ابحث بالمريض أو الطبيب..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Records list */}
      <div className="mr-list">
        {filtered.length === 0 ? (
          <div className="panel" style={{ padding: '40px 24px', textAlign: 'center', fontSize: 13, color: 'var(--ink-45)' }}>
            لا توجد سجلات
          </div>
        ) : filtered.map(r => {
          const st      = STATUS[r.status] || STATUS.confirmed
          const color   = AVATAR_COLORS[(r.id - 1) % AVATAR_COLORS.length]
          return (
            <div key={r.id} className="mr-card" style={{ borderRight: `3px solid ${st.color}` }}>
              <div className="mr-card-head">
                <div className="mr-avatar" style={{ background: color }}>{r.patient.charAt(0)}</div>
                <div className="mr-card-info">
                  <div className="mr-card-top">
                    <span className="mr-patient-name">{r.patient}</span>
                    <span className="mr-no">{r.no}</span>
                    <span className="mr-status-chip" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                  <div className="mr-card-meta">
                    {r.doctor}<span className="mr-sep">·</span>{r.specialty}
                    <span className="mr-sep">·</span>{r.branch}
                    <span className="mr-sep">|</span>{r.time}
                  </div>
                </div>
                <div className="mr-card-type">
                  {r.isNew
                    ? <span className="mr-new-badge">زيارة جديدة</span>
                    : <span className="mr-type-badge">{VISIT_TYPE[r.visitType]}</span>
                  }
                </div>
              </div>

              {r.note && (
                <div className="mr-note">
                  <FileText size={12} strokeWidth={1.8} />
                  {r.note}
                </div>
              )}

              <div className="mr-card-actions">
                {ACTION_BTNS.map(btn => (
                  <button
                    key={btn.key}
                    className={`mr-action-btn${r[btn.key]?.length === 0 ? ' empty' : ''}`}
                    onClick={() => r[btn.key]?.length > 0 && setModal({ record: r, type: btn.key })}
                    style={r[btn.key]?.length > 0 ? { '--btn-color': btn.color } : {}}
                  >
                    {btn.icon}
                    {btn.label}
                    {r[btn.key]?.length > 0 && (
                      <span className="mr-action-count" style={{ background: btn.color }}>
                        {r[btn.key].length}
                      </span>
                    )}
                  </button>
                ))}
                <button className="btn btn-p mr-detail-btn">
                  التفاصيل
                  <ChevronLeft size={13} strokeWidth={2} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Data modal */}
      <DataModal
        record={modal?.record}
        type={modal?.type}
        onClose={() => setModal(null)}
      />
    </div>
  )
}
