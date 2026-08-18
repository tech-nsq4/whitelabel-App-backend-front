import { branchFilters } from '../calendar.data'

const VIEW_OPTIONS = ['يوم', 'أسبوع', 'شهر']

export default function CalendarHeader({
  currentDate,
  view,
  activeBranch,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onBranchChange,
  onNewBooking,
  onExport,
}) {
  return (
    <>
      {/* Page head */}
      <div className="page-head calendar-page-head">
        <div>
          <h1>الحجوزات والمواعيد</h1>
          <div className="sub">{currentDate} · جميع الفروع</div>
        </div>
        <div className="page-actions">
          <div className="seg">
            {VIEW_OPTIONS.map((v) => (
              <div
                key={v}
                className={`seg-btn${view === v ? ' active' : ''}`}
                onClick={() => onViewChange(v)}
              >
                {v}
              </div>
            ))}
          </div>
          <button className="btn btn-q" onClick={onExport}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 15V4M12 15l-4-4M12 15l4-4"/>
              <path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17"/>
            </svg>
            تصدير
          </button>
          <button className="btn btn-p" onClick={onNewBooking}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 5.5v13M5.5 12h13"/>
            </svg>
            حجز جديد
          </button>
        </div>
      </div>

      {/* Date navigation bar */}
      <div className="panel calendar-toolbar" style={{ marginBottom: 16 }}>
        <div className="calendar-toolbar-inner">
          <div className="calendar-date-controls">
            <button className="icon-btn" onClick={onNext} aria-label="التالي" title="الفترة التالية">
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M9.5 6l6 6-6 6"/></svg>
            </button>
            <div style={{ fontFamily: "'Readex Pro'", fontSize: 15, fontWeight: 600 }}>
              {currentDate}
            </div>
            <button className="icon-btn" onClick={onPrev} aria-label="السابق" title="الفترة السابقة">
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M14.5 6l-6 6 6 6"/></svg>
            </button>
            <button className="btn btn-g" style={{ marginRight: 8 }} onClick={onToday}>
              اليوم
            </button>
          </div>

          <div className="filter-bar calendar-branch-filters" style={{ margin: 0 }}>
            {branchFilters.map((f) => (
              <div
                key={f.id}
                className={`filter-chip${activeBranch === f.id ? ' active' : ''}`}
                onClick={() => onBranchChange(f.id)}
              >
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
