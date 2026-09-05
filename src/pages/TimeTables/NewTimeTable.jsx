import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Save,
  Stethoscope,
  Home,
  Video,
  CalendarDays,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useCreateTimeTable } from "../../hooks/queries/useTimeTables";
import { useDoctors } from "../../hooks/queries/useDoctors";
import { useToast } from "../../components/ui/Toast";
import "./TimeTables.css";

// ================= Constants =================
const DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const DAYS_AR = {
  Saturday: "السبت",
  Sunday: "الأحد",
  Monday: "الاثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
};

const DEFAULT_SHIFTS = {
  first_shift_start: "09:00",
  first_shift_end: "13:00",
  second_shift_start: "14:00",
  second_shift_end: "18:00",
  third_shift_start: null,
  third_shift_end: null,
};

const TYPE_OPTIONS = [
  {
    value: "clinic",
    label: "عيادة",
    icon: <Stethoscope size={15} strokeWidth={1.8} />,
    color: "#0F6B5C",
    bg: "rgba(15,107,92,.1)",
  },
  {
    value: "home",
    label: "منزل",
    icon: <Home size={15} strokeWidth={1.8} />,
    color: "#2C6DAA",
    bg: "rgba(44,109,170,.1)",
  },
  {
    value: "video",
    label: "فيديو",
    icon: <Video size={15} strokeWidth={1.8} />,
    color: "#7C3AED",
    bg: "rgba(124,58,237,.1)",
  },
];

const SCHED_OPTIONS = [
  {
    value: "all_days",
    label: "كل الأيام",
    icon: <CalendarDays size={15} strokeWidth={1.8} />,
  },
  {
    value: "specific_days",
    label: "أيام محددة",
    icon: <Calendar size={15} strokeWidth={1.8} />,
  },
  {
    value: "flexible_schedule",
    label: "جدول مرن",
    icon: <Calendar size={15} strokeWidth={1.8} />,
  },
];

const SHIFT_FIELDS = [
  { startKey: "first_shift_start", endKey: "first_shift_end" },
  { startKey: "second_shift_start", endKey: "second_shift_end" },
  { startKey: "third_shift_start", endKey: "third_shift_end" },
];

const INITIAL_FORM = {
  doctor_id: "",
  clinic_id: "",
  name: "",
  notes: "",
  type: "clinic",
  schedule_type: "all_days",
  start_date: "",
  end_date: "",
  session_hours: 30,
  duration_between_sessions: 10,
  sessions: 1,
};

// ================= Helpers =================
function normalizeThirdShift(row) {
  const hasThird =
    row.third_shift_start &&
    row.third_shift_end &&
    row.third_shift_start !== "" &&
    row.third_shift_end !== "";

  return {
    ...row,
    third_shift_start: hasThird ? row.third_shift_start : null,
    third_shift_end: hasThird ? row.third_shift_end : null,
  };
}

function buildPayload(form, rows) {
  const activeRows = rows
    .filter((r) => r.on)
    .map(({ on, ...rest }) => normalizeThirdShift(rest));

  const firstRow = activeRows[0] || {};
  const shift = {
    first_shift_start: firstRow.first_shift_start || null,
    first_shift_end: firstRow.first_shift_end || null,
    second_shift_start: firstRow.second_shift_start || null,
    second_shift_end: firstRow.second_shift_end || null,
    third_shift_start: firstRow.third_shift_start || null,
    third_shift_end: firstRow.third_shift_end || null,
  };

  const payload = { ...form, schedules: activeRows };
  if (form.schedule_type !== "flexible_schedule") payload.shift = shift;

  return payload;
}

function extractErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    Object.values(err?.response?.data?.errors || {})?.[0]?.[0] ||
    "حدث خطأ"
  );
}

// ================= Shared Hook =================
function useOutsideClick(onOutside) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onOutside]);

  return ref;
}

// ================= Main Component =================
export default function NewTimeTable() {
  const navigate = useNavigate();
  const { mutate: create, isPending } = useCreateTimeTable();
  const { data: raw } = useDoctors({ per_page: 100 });
  const { showToast } = useToast();

  const doctors = Array.isArray(raw) ? raw : (raw?.data ?? []);

  const [form, setForm] = useState(INITIAL_FORM);
  const [rows, setRows] = useState(
    DAYS.map((day) => ({ day, ...DEFAULT_SHIFTS, on: true })),
  );

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // لما يتغير الدكتور، لو عنده عيادة واحدة بس حددها أوتوماتيك
  function handleDoctorChange(doctorId) {
    const doc = doctors.find(d => String(d.id) === String(doctorId));
    const clinics = doc?.clinics || [];
    setForm(prev => ({
      ...prev,
      doctor_id: doctorId,
      clinic_id: clinics.length === 1 ? String(clinics[0].id) : '',
    }));
  }

  const setShiftField = (day, key, value) =>
    setRows((prev) =>
      prev.map((r) => (r.day === day ? { ...r, [key]: value } : r)),
    );

  const toggleDay = (day) =>
    setRows((prev) =>
      prev.map((r) => (r.day === day ? { ...r, on: !r.on } : r)),
    );

  function handleSubmit(e) {
    e?.preventDefault();
    const payload = buildPayload(form, rows);

    create(payload, {
      onSuccess: () => {
        showToast("تم إنشاء الجدول بنجاح", "success");
        navigate("/time-tables");
      },
      onError: (err) => showToast(extractErrorMessage(err), "error"),
    });
  }

  const activeCount = rows.filter((r) => r.on).length;

  return (
    <div className="nt-page">
      <PageHeader
        onCancel={() => navigate("/time-tables")}
        onSave={handleSubmit}
        isPending={isPending}
      />

      <form onSubmit={handleSubmit}>
        <BasicInfoCard
          form={form}
          setField={setField}
          doctors={doctors}
          onDoctorChange={handleDoctorChange}
        />

        <ScheduleCard
          rows={rows}
          activeCount={activeCount}
          totalDays={DAYS.length}
          onToggleDay={toggleDay}
          onShiftChange={setShiftField}
        />

        <PageFooter
          onCancel={() => navigate("/time-tables")}
          isPending={isPending}
        />
      </form>
    </div>
  );
}

// ================= Layout Sections =================
function PageHeader({ onCancel, onSave, isPending }) {
  return (
    <div className="nt-header">
      <div className="nt-header-left">
        <button type="button" className="nt-back" onClick={onCancel}>
          <ArrowRight size={16} />
        </button>
        <div>
          <div className="nt-title">جدول جديد</div>
          <div className="nt-sub">إنشاء جدول مواعيد جديد لطبيب</div>
        </div>
      </div>
      <div className="nt-hactions">
        <button type="button" className="btn btn-q" onClick={onCancel}>
          إلغاء
        </button>
        <button
          type="button"
          className="btn btn-p"
          disabled={isPending}
          onClick={onSave}
        >
          <Save size={14} strokeWidth={2} />
          {isPending ? "جاري الحفظ..." : "حفظ الجدول"}
        </button>
      </div>
    </div>
  );
}

function PageFooter({ onCancel, isPending }) {
  return (
    <div className="nt-footer">
      <button type="button" className="btn btn-q" onClick={onCancel}>
        إلغاء
      </button>
      <button type="submit" className="btn btn-p" disabled={isPending}>
        <Save size={14} strokeWidth={2} />
        {isPending ? "جاري الحفظ..." : "حفظ الجدول"}
      </button>
    </div>
  );
}

function CardHeader({ icon, title, badge }) {
  return (
    <div className="nt-card-head">
      <div className="nt-card-title">
        <div className="nt-card-icon">{icon}</div>
        {title}
      </div>
      {badge && <div className="nt-card-badge">{badge}</div>}
    </div>
  );
}

function BasicInfoCard({ form, setField, doctors, onDoctorChange }) {
  const selectedDoctor = doctors.find(d => String(d.id) === String(form.doctor_id));
  const clinicOptions = selectedDoctor?.clinics || [];

  return (
    <div className="nt-card">
      <CardHeader
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        }
        title="المعلومات الأساسية"
      />
      <div className="nt-card-body">
        <div className="nt-row nt-col-2">
          <Field label="الطبيب">
            <DoctorSelect
              doctors={doctors}
              value={form.doctor_id}
              onChange={onDoctorChange}
            />
          </Field>
          <Field label="العيادة">
            <select
              className="nt-inp"
              required
              value={form.clinic_id}
              onChange={e => setField('clinic_id', e.target.value)}
              disabled={clinicOptions.length === 0}
            >
              <option value="">اختر العيادة</option>
              {clinicOptions.map(c => (
                <option key={c.id} value={c.id}>{c.name?.ar || c.name}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="nt-row">
          <Field label="اسم الجدول">
            <input
              className="nt-inp"
              required
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="مثال: جدول العيادة الأسبوعي"
            />
          </Field>
        </div>

        <div className="nt-row nt-col-3">
          <Field label="نوع الزيارة">
            <CustomSelect
              options={TYPE_OPTIONS}
              value={form.type}
              onChange={(v) => setField("type", v)}
            />
          </Field>
          <Field label="نوع الجدول">
            <CustomSelect
              options={SCHED_OPTIONS}
              value={form.schedule_type}
              onChange={(v) => setField("schedule_type", v)}
            />
          </Field>
          <Field label="عدد الجلسات">
            <input
              className="nt-inp"
              type="number"
              min={1}
              value={form.sessions}
              onChange={(e) => setField("sessions", +e.target.value)}
            />
          </Field>
        </div>

        <div className="nt-row nt-col-4">
          <Field label="تاريخ البداية">
            <input
              className="nt-inp"
              type="date"
              required
              value={form.start_date}
              onChange={(e) => setField("start_date", e.target.value)}
            />
          </Field>
          <Field label="تاريخ النهاية">
            <input
              className="nt-inp"
              type="date"
              required
              value={form.end_date}
              onChange={(e) => setField("end_date", e.target.value)}
            />
          </Field>
          <Field label="مدة الجلسة (دقيقة)">
            <input
              className="nt-inp"
              type="number"
              min={5}
              value={form.session_hours}
              onChange={(e) => setField("session_hours", +e.target.value)}
            />
          </Field>
          <Field label="فترة الراحة (دقيقة)">
            <input
              className="nt-inp"
              type="number"
              min={0}
              value={form.duration_between_sessions}
              onChange={(e) =>
                setField("duration_between_sessions", +e.target.value)
              }
            />
          </Field>
        </div>

        <div className="nt-row nt-notes-row">
          <Field label="ملاحظات">
            <textarea
              className="nt-inp ta"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="ملاحظات اختيارية..."
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function ScheduleCard({ rows, activeCount, totalDays, onToggleDay, onShiftChange }) {
  return (
    <div className="nt-card">
      <CardHeader
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        }
        title="الأيام والورديات"
        badge={`${activeCount} من ${totalDays} أيام نشطة`}
      />
      <div className="nt-card-body">
        <div className="nt-sched-wrap">
          <table className="nt-sched">
            <thead>
              <tr>
                <th>اليوم</th>
                <th>تفعيل</th>
                <th>الوردية الأولى</th>
                <th>الوردية الثانية</th>
                <th>الوردية الثالثة</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <ScheduleRow
                  key={row.day}
                  row={row}
                  onToggle={onToggleDay}
                  onShiftChange={onShiftChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ScheduleRow({ row, onToggle, onShiftChange }) {
  return (
    <tr className={row.on ? "row-on" : "row-off"}>
      <td>
        <span className="nt-day">{DAYS_AR[row.day]}</span>
      </td>
      <td>
        <DayToggle active={row.on} onClick={() => onToggle(row.day)} />
      </td>
      {SHIFT_FIELDS.map(({ startKey, endKey }) => (
        <td key={startKey} className="nt-shift-cell">
          <TimePair
            row={row}
            startKey={startKey}
            endKey={endKey}
            disabled={!row.on}
            onChange={onShiftChange}
          />
        </td>
      ))}
    </tr>
  );
}

function DayToggle({ active, onClick }) {
  return (
    <div className={`nt-toggle ${active ? "on" : ""}`} onClick={onClick}>
      {active && (
        <svg width="10" height="10" viewBox="0 0 12 10">
          <path d="M1 5l3.5 3.5L11 1" />
        </svg>
      )}
    </div>
  );
}

// ================= Small Shared Components =================
function Field({ label, children }) {
  return (
    <div className="nt-field">
      <label className="nt-label">{label}</label>
      {children}
    </div>
  );
}

function TimePair({ row, startKey, endKey, disabled, onChange }) {
  // null means "not set" — use empty string for input but keep null in state
  const startVal = row[startKey] ?? "";
  const endVal = row[endKey] ?? "";

  return (
    <div className="nt-shift-pair">
      <input
        type="time"
        className="nt-time"
        value={startVal}
        disabled={disabled}
        onChange={(e) => onChange(row.day, startKey, e.target.value || null)}
      />
      <span className="nt-sep">—</span>
      <input
        type="time"
        className="nt-time"
        value={endVal}
        disabled={disabled}
        onChange={(e) => onChange(row.day, endKey, e.target.value || null)}
      />
    </div>
  );
}

// ================= Select Components =================
function CustomSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useOutsideClick(close);

  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div className="csel" ref={ref}>
      <div
        className={`csel-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <SelectIcon option={selected} />
        <span className="csel-trigger-label">{selected.label}</span>
        <ChevronDown size={15} strokeWidth={2} className="csel-chevron" />
      </div>
      {open && (
        <div className="csel-menu">
          {options.map((o) => (
            <div
              key={o.value}
              className={`csel-option${o.value === value ? " selected" : ""}`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              <SelectIcon option={o} />
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SelectIcon({ option }) {
  if (!option.color) return <span className="csel-icon-muted">{option.icon}</span>;
  return (
    <div
      className="csel-option-icon"
      style={{ background: option.bg, color: option.color }}
    >
      {option.icon}
    </div>
  );
}

function DoctorSelect({ doctors, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const close = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);
  const ref = useOutsideClick(close);

  const getDoctorName = (d) => d.name?.ar || d.name?.en || `#${d.id}`;

  const selected = doctors.find((d) => String(d.id) === String(value));
  const filtered = doctors.filter((d) =>
    getDoctorName(d).toLowerCase().includes(search.toLowerCase()),
  );

  const displayName = selected ? getDoctorName(selected) : "اختر الطبيب";
  const initial = selected ? displayName.replace("د. ", "").charAt(0) : null;

  function handleSelect(doctorId) {
    onChange(String(doctorId));
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="csel" ref={ref}>
      <div
        className={`csel-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        {initial ? (
          <div className="avatar csel-avatar-sm">{initial}</div>
        ) : (
          <div className="csel-avatar-placeholder" />
        )}
        <span
          className={`csel-trigger-label ${selected ? "csel-trigger-selected" : "csel-trigger-placeholder"}`}
        >
          {displayName}
        </span>
        <ChevronDown size={15} strokeWidth={2} className="csel-chevron" />
      </div>

      {open && (
        <div className="csel-menu">
          <div className="csel-search-wrap">
            <input
              className="nt-inp csel-search-inp"
              placeholder="بحث..."
              value={search}
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="csel-list">
            {filtered.length === 0 && (
              <div className="csel-empty">لا توجد نتائج</div>
            )}
            {filtered.map((d) => {
              const name = getDoctorName(d);
              const ini = name.replace("د. ", "").charAt(0);
              return (
                <div
                  key={d.id}
                  className={`csel-option${String(d.id) === String(value) ? " selected" : ""}`}
                  onClick={() => handleSelect(d.id)}
                >
                  <div className="avatar csel-doc-avatar">{ini}</div>
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}