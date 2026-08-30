import { useState, useRef, useEffect } from "react";
import { ChevronDown, Building2, Check } from "lucide-react";

const VIEW_OPTIONS = ["يوم", "أسبوع", "شهر"];

function ClinicDropdown({ clinics, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected =
    value === "all"
      ? { label: "كل العيادات" }
      : (() => {
          const c = clinics.find((c) => String(c.id) === String(value));
          return c ? { label: c.name?.ar || c.name } : { label: "كل العيادات" };
        })();

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function pick(val) {
    onChange(val);
    setOpen(false);
  }

  return (
    <div className="cdd-wrap" ref={ref}>
      <button
        className={`cdd-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Building2 size={14} strokeWidth={1.8} className="cdd-icon" />
        <span className="cdd-label">{selected.label}</span>
        <ChevronDown
          size={13}
          strokeWidth={2}
          className={`cdd-arrow${open ? " open" : ""}`}
        />
      </button>
      {open && (
        <div className="cdd-menu">
          <div className="cdd-menu-inner">
            <div
              className={`cdd-option${value === "all" ? " active" : ""}`}
              onClick={() => pick("all")}
            >
              <span>كل العيادات</span>
              {value === "all" && (
                <Check size={13} strokeWidth={2.5} className="cdd-check" />
              )}
            </div>
            {clinics.length > 0 && <div className="cdd-divider" />}
            {clinics.map((c) => {
              const nameAr = c.name?.ar || c.name || "";
              const isActive = String(value) === String(c.id);
              return (
                <div
                  key={c.id}
                  className={`cdd-option${isActive ? " active" : ""}`}
                  onClick={() => pick(c.id)}
                >
                  <span className="cdd-option-label">{nameAr}</span>
                  {isActive && (
                    <Check size={13} strokeWidth={2.5} className="cdd-check" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CalendarHeader({
  currentDate,
  currentDateValue,
  view,
  clinics,
  clinicFilter,
  dateInputRef,
  onPrev,
  onNext,
  onToday,
  onDateClick,
  onDateChange,
  onViewChange,
  onClinicChange,
  onNewBooking,
  onExport,
  activeTab,
  onTabChange,
  tabs = [],
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
              <div
                key={v}
                className={`seg-btn${view === v ? " active" : ""}`}
                onClick={() => onViewChange(v)}
              >
                {v}
              </div>
            ))}
          </div>
          <button className="btn btn-q" onClick={onExport}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 15V4M12 15l-4-4M12 15l4-4" />
              <path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17" />
            </svg>
            تصدير
          </button>
          <button className="btn btn-p" onClick={onNewBooking}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 5.5v13M5.5 12h13" />
            </svg>
            حجز جديد
          </button>
        </div>
      </div>

      <div className="panel calendar-toolbar" style={{ marginBottom: 20 }}>
        <div className="calendar-toolbar-inner">
          {/* Date controls — right */}
          <div className="calendar-date-controls">
            <button className="icon-btn" onClick={onNext} aria-label="التالي">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M9.5 6l6 6-6 6" />
              </svg>
            </button>
            <div style={{ position: "relative" }}>
              <button
                onClick={onDateClick}
                className="cal-date-btn"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--sand)";
                  e.currentTarget.style.borderColor = "var(--brand)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--paper)";
                  e.currentTarget.style.borderColor = "var(--line)";
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  stroke="var(--brand)"
                  fill="none"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {currentDate}
              </button>
              <input
                ref={dateInputRef}
                type="date"
                value={currentDateValue}
                onChange={onDateChange}
                style={{
                  position: "absolute",
                  opacity: 0,
                  pointerEvents: "none",
                  top: 0,
                  right: 0,
                  width: 1,
                  height: 1,
                }}
              />
            </div>
            <button className="icon-btn" onClick={onPrev} aria-label="السابق">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M14.5 6l-6 6 6 6" />
              </svg>
            </button>
            <button className="btn btn-g cal-today-btn" onClick={onToday}>
              اليوم
            </button>
          </div>

          {/* Tabs — center */}
          {tabs.length > 0 && (
            <div className="cal-tabs-inline">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={`cal-tab-inline${activeTab === t.id ? " active" : ""}`}
                  onClick={() => onTabChange(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* Clinic dropdown — left */}
          <ClinicDropdown
            clinics={clinics}
            value={clinicFilter}
            onChange={onClinicChange}
          />
        </div>
      </div>
    </>
  );
}
