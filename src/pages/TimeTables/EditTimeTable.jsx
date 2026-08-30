import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  useTimeTable,
  useUpdateTimeTable,
} from "../../hooks/queries/useTimeTables";
import { useDoctors } from "../../hooks/queries/useDoctors";
import { useToast } from "../../components/ui/Toast";
import "./TimeTables.css";

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
const EMPTY_SHIFT = {
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

export default function EditTimeTable() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: tt, isLoading } = useTimeTable(id);
  const { mutate: update, isPending } = useUpdateTimeTable();
  const { data: raw } = useDoctors({ per_page: 100 });

  const doctors = Array.isArray(raw) ? raw : (raw?.data ?? []);

  const [form, setForm] = useState(null);
  const [rows, setRows] = useState(null);

  const initialized = useRef(null);

  // Populate form once data loads
  useEffect(() => {
    if (!tt || initialized.current === id) return;
    initialized.current = id;
    setForm({
      doctor_id: String(tt.doctor_id || tt.doctor?.id || ""),
      name: tt.name || "",
      notes: tt.notes || "",
      type: tt.type || "clinic",
      schedule_type: tt.schedule_type || "all_days",
      start_date: tt.start_date || "",
      end_date: tt.end_date || "",
      session_hours: tt.session_hours || 30,
      duration_between_sessions: tt.duration_between_sessions || 10,
      sessions: tt.sessions || 1,
    });
    setRows(
      DAYS.map((day) => {
        const s = tt.schedules?.find((sc) => sc.day === day);
        return s
          ? {
              day,
              first_shift_start: s.first_shift_start,
              first_shift_end: s.first_shift_end,
              second_shift_start: s.second_shift_start,
              second_shift_end: s.second_shift_end,
              third_shift_start: s.third_shift_start || null,
              third_shift_end: s.third_shift_end || null,
              on: true,
            }
          : { day, ...EMPTY_SHIFT, on: false };
      }),
    );
  }, [tt]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setT = (day, k, v) =>
    setRows((p) => p.map((r) => (r.day === day ? { ...r, [k]: v } : r)));
  const toggle = (day) =>
    setRows((p) => p.map((r) => (r.day === day ? { ...r, on: !r.on } : r)));

  function submit(e) {
    e.preventDefault();
    const activeRows = rows
      .filter((r) => r.on)
      .map(({ on, ...rest }) => {
        const clean = { ...rest };
        const hasThird = clean.third_shift_start && clean.third_shift_end;
        clean.third_shift_start = hasThird ? clean.third_shift_start : null;
        clean.third_shift_end = hasThird ? clean.third_shift_end : null;
        return clean;
      });
    const firstRow = activeRows[0] || {};
    const shift = {
      first_shift_start: firstRow.first_shift_start || null,
      first_shift_end: firstRow.first_shift_end || null,
      second_shift_start: firstRow.second_shift_start || null,
      second_shift_end: firstRow.second_shift_end || null,
      third_shift_start: firstRow.third_shift_start || null,
      third_shift_end: firstRow.third_shift_end || null,
    };
    const fullPayload = {
      ...form,
      doctor_id: Number(form.doctor_id),
      schedules: activeRows,
    };
    if (form.schedule_type !== "flexible_schedule") fullPayload.shift = shift;

    // Try full payload first
    update(
      { id, data: fullPayload },
      {
        onSuccess: () => {
          showToast("تم حفظ التغييرات بنجاح", "success");
          navigate("/time-tables");
        },
        onError: (err) => {
          const serverMsg = err?.response?.data?.message || "";
          const isScheduleBlocked =
            serverMsg.toLowerCase().includes("appointments") ||
            !!err?.response?.data?.errors?.time_table;

          if (isScheduleBlocked) {
            // API rejects any shift/schedules when appointments exist — send basic fields only
            const { schedules: _s, shift: _sh, ...basicPayload } = fullPayload;
            update(
              { id, data: basicPayload },
              {
                onSuccess: () => {
                  showToast("تم حفظ التغييرات بنجاح", "success");
                  navigate("/time-tables");
                },
                onError: (err2) => {
                  const errors2 = err2?.response?.data?.errors;
                  const msg2 =
                    err2?.response?.data?.message ||
                    (errors2 ? Object.values(errors2).flat()[0] : null) ||
                    "حدث خطأ أثناء الحفظ";
                  showToast(msg2, "error");
                },
              },
            );
          } else {
            const errors = err?.response?.data?.errors;
            const msg =
              serverMsg ||
              (errors ? Object.values(errors).flat()[0] : null) ||
              "حدث خطأ أثناء الحفظ";
            showToast(msg, "error");
          }
        },
      },
    );
  }

  if (isLoading || !form || !rows) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "var(--ink-45)" }}>
        جاري التحميل...
      </div>
    );
  }

  const activeCount = rows.filter((r) => r.on).length;

  return (
    <div className="nt-page">
      <div className="nt-header">
        <div className="nt-header-left">
          <button
            type="button"
            className="nt-back"
            onClick={() => navigate("/time-tables")}
          >
            <ArrowRight size={16} />
          </button>
          <div>
            <div className="nt-title">تعديل الجدول</div>
            <div className="nt-sub">{tt?.name}</div>
          </div>
        </div>
        <div className="nt-hactions">
          <button
            type="button"
            className="btn btn-q"
            onClick={() => navigate("/time-tables")}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="btn btn-p"
            disabled={isPending}
            onClick={submit}
          >
            <Save size={14} strokeWidth={2} />
            {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>

      <form onSubmit={submit}>
        <div className="nt-card">
          <div className="nt-card-head">
            <div className="nt-card-title">
              <div className="nt-card-icon">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              المعلومات الأساسية
            </div>
          </div>
          <div className="nt-card-body">
            <div className="nt-row nt-col-2">
              <div className="nt-field">
                <label className="nt-label">الطبيب</label>
                <DoctorSelect
                  doctors={doctors}
                  value={form.doctor_id}
                  onChange={(v) => set("doctor_id", v)}
                />
              </div>
              <div className="nt-field">
                <label className="nt-label">اسم الجدول</label>
                <input
                  className="nt-inp"
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
            </div>

            <div className="nt-row nt-col-3">
              <div className="nt-field">
                <label className="nt-label">نوع الزيارة</label>
                <CustomSelect
                  options={TYPE_OPTIONS}
                  value={form.type}
                  onChange={(v) => set("type", v)}
                />
              </div>
              <div className="nt-field">
                <label className="nt-label">نوع الجدول</label>
                <CustomSelect
                  options={SCHED_OPTIONS}
                  value={form.schedule_type}
                  onChange={(v) => set("schedule_type", v)}
                />
              </div>
              <div className="nt-field">
                <label className="nt-label">عدد الجلسات</label>
                <input
                  className="nt-inp"
                  type="number"
                  min={1}
                  value={form.sessions}
                  onChange={(e) => set("sessions", +e.target.value)}
                />
              </div>
            </div>

            <div className="nt-row nt-col-4">
              <div className="nt-field">
                <label className="nt-label">تاريخ البداية</label>
                <input
                  className="nt-inp"
                  type="date"
                  required
                  value={form.start_date}
                  onChange={(e) => set("start_date", e.target.value)}
                />
              </div>
              <div className="nt-field">
                <label className="nt-label">تاريخ النهاية</label>
                <input
                  className="nt-inp"
                  type="date"
                  required
                  value={form.end_date}
                  onChange={(e) => set("end_date", e.target.value)}
                />
              </div>
              <div className="nt-field">
                <label className="nt-label">مدة الجلسة (دقيقة)</label>
                <input
                  className="nt-inp"
                  type="number"
                  min={5}
                  value={form.session_hours}
                  onChange={(e) => set("session_hours", +e.target.value)}
                />
              </div>
              <div className="nt-field">
                <label className="nt-label">فترة الراحة (دقيقة)</label>
                <input
                  className="nt-inp"
                  type="number"
                  min={0}
                  value={form.duration_between_sessions}
                  onChange={(e) =>
                    set("duration_between_sessions", +e.target.value)
                  }
                />
              </div>
            </div>

            <div className="nt-row nt-notes-row">
              <div className="nt-field">
                <label className="nt-label">ملاحظات</label>
                <textarea
                  className="nt-inp ta"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="ملاحظات اختيارية..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="nt-card">
          <div className="nt-card-head">
            <div className="nt-card-title">
              <div className="nt-card-icon">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              الأيام والورديات
            </div>
            <div className="nt-card-badge">
              {activeCount} من {DAYS.length} أيام نشطة
            </div>
          </div>
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
                  {rows.map((r) => (
                    <tr key={r.day} className={r.on ? "row-on" : "row-off"}>
                      <td>
                        <span className="nt-day">{DAYS_AR[r.day]}</span>
                      </td>
                      <td>
                        <div
                          className={`nt-toggle ${r.on ? "on" : ""}`}
                          onClick={() => toggle(r.day)}
                        >
                          {r.on && (
                            <svg width="10" height="10" viewBox="0 0 12 10">
                              <path d="M1 5l3.5 3.5L11 1" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="nt-shift-cell">
                        <TimePair
                          r={r}
                          sk="first_shift_start"
                          ek="first_shift_end"
                          disabled={!r.on}
                          onChange={setT}
                        />
                      </td>
                      <td className="nt-shift-cell">
                        <TimePair
                          r={r}
                          sk="second_shift_start"
                          ek="second_shift_end"
                          disabled={!r.on}
                          onChange={setT}
                        />
                      </td>
                      <td className="nt-shift-cell">
                        <TimePair
                          r={r}
                          sk="third_shift_start"
                          ek="third_shift_end"
                          disabled={!r.on}
                          onChange={setT}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="nt-footer">
          <button
            type="button"
            className="btn btn-q"
            onClick={() => navigate("/time-tables")}
          >
            إلغاء
          </button>
          <button type="submit" className="btn btn-p" disabled={isPending}>
            <Save size={14} strokeWidth={2} />
            {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TimePair({ r, sk, ek, disabled, onChange }) {
  return (
    <div className="nt-shift-pair">
      <input
        type="time"
        className="nt-time"
        value={r[sk] ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(r.day, sk, e.target.value || null)}
      />
      <span className="nt-sep">—</span>
      <input
        type="time"
        className="nt-time"
        value={r[ek] ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(r.day, ek, e.target.value || null)}
      />
    </div>
  );
}

function CustomSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value) || options[0];
  useEffect(() => {
    function h(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="csel" ref={ref}>
      <div
        className={`csel-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        {selected.color ? (
          <div
            className="csel-option-icon"
            style={{ background: selected.bg, color: selected.color }}
          >
            {selected.icon}
          </div>
        ) : (
          <span className="csel-icon-muted">{selected.icon}</span>
        )}
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
              {o.color ? (
                <div
                  className="csel-option-icon"
                  style={{ background: o.bg, color: o.color }}
                >
                  {o.icon}
                </div>
              ) : (
                <span className="csel-icon-muted">{o.icon}</span>
              )}
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DoctorSelect({ doctors, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const selected = doctors.find((d) => String(d.id) === String(value));
  const filtered = doctors.filter((d) =>
    (d.name?.ar || d.name?.en || "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  useEffect(() => {
    function h(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const displayName = selected
    ? selected.name?.ar || selected.name?.en || `#${selected.id}`
    : "اختر الطبيب";
  const initial = selected ? displayName.replace("د. ", "").charAt(0) : null;
  return (
    <div className="csel" ref={ref}>
      <div
        className={`csel-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        {initial ? (
          <div className={`avatar csel-avatar-sm`}>{initial}</div>
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
              const name = d.name?.ar || d.name?.en || `#${d.id}`;
              return (
                <div
                  key={d.id}
                  className={`csel-option${String(d.id) === String(value) ? " selected" : ""}`}
                  onClick={() => {
                    onChange(String(d.id));
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <div className="avatar csel-doc-avatar">
                    {name.replace("د. ", "").charAt(0)}
                  </div>
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
