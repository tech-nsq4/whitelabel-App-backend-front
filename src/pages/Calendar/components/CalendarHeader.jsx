import { branchFilters } from '../calendar.data'

const VIEW_OPTIONS = ['يوم', 'أسبوع', 'شهر']

export default function CalendarHeader({
  currentDate, currentDateValue, view, activeBranch,
  clinics, clinicFilter,
  dateInputRef, onPrev, onNext, onToday, onDateClick, onDateChange,
  onViewChange, onBranchChange, onClinicChange, onNewBooking, onExport,
}) {
  return (
    <>
      <div className="page-head calendar-page-head">
        <div>
          <h1>الحجوزات والمواعيد</h1>
          <div className="sub">{currentDate} · جميع الفروع</div>
        </div>
        <div className="page-actions">
          <div className="seg">
            {VIEW_OPTIONS.map((v) => (
              <div key={v} className={`seg-btn${view === v ? ' active' : ''}`} onClick={() => onViewChange(v)}>
                {v}
              </div>
            ))}
          </div>
          <button className="btn btn-q" onClick={onExport}>
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 15V4M12 15l-4-4M12 15l4-4"/><path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17"/></svg>
            تصدير
          </button>
          <button className="btn btn-p" onClick={onNewBooking}>
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 5.5v13M5.5 12h13"/></svg>
            حجز جديد
          </button>
        </div>
      </div>

      <div className="panel calendar-toolbar" style={{ marginBottom: 16 }}>
        <div className="calendar-toolbar-inner">
          <div className="calendar-date-controls">
            <button className="icon-btn" onClick={onNext} aria-label="التالي">
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M9.5 6l6 6-6 6"/></svg>
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={onDateClick} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 10, cursor: 'pointer', background: 'var(--paper)', border: '1px solid var(--line)', fontFamily: "'Readex Pro'", fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--sand)'; e.currentTarget.style.borderColor = 'var(--brand)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper)'; e.currentTarget.style.borderColor = 'var(--line)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" stroke="var(--brand)" fill="none" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                {currentDate}
              </button>
              <input ref={dateInputRef} type="date" value={currentDateValue} onChange={onDateChange}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: 0, right: 0, width: 1, height: 1 }} />
            </div>
            <button className="icon-btn" onClick={onPrev} aria-label="السابق">
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M14.5 6l-6 6 6 6"/></svg>
            </button>
            <button className="btn btn-g" style={{ marginRight: 8 }} onClick={onToday}>اليوم</button>
          </div>

          {/* Clinic filters from API */}
          <div className="filter-bar calendar-branch-filters" style={{ margin: 0 }}>
            <div className={`filter-chip${clinicFilter === 'all' ? ' active' : ''}`} onClick={() => onClinicChange('all')}>
              كل العيادات
            </div>
            {clinics.map(c => (
              <div key={c.id}
                className={`filter-chip${String(clinicFilter) === String(c.id) ? ' active' : ''}`}
                onClick={() => onClinicChange(c.id)}>
                {c.name?.ar || c.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
