import { useState, useMemo, useRef, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import { useDoctors } from "../../../hooks/queries/useDoctors";
import { useSpecializations } from "../../../hooks/queries/useSpecializations";
import { useClinics } from "../../../hooks/queries/useClinics";
import { useTimeTables } from "../../../hooks/queries/useTimeTables";

const today = new Date().toISOString().slice(0, 10);

const INITIAL = {
  patient: "",
  clinic_id: "",
  specialization_id: "",
  doctor_id: "",
  date: today,
  time: "",
  visitType: "clinic",
};

const VISIT_TYPES = [
  { value: "clinic", label: "كشف عيادة" },
  { value: "home", label: "زيارة منزلية" },
  { value: "video", label: "استشارة فيديو" },
];

const DAYS_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// generate time slots within a shift based on session duration
function generateSlots(start, end, duration) {
  if (!start || !end || !duration) return [];
  const slots = [];
  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  while (h < endH || (h === endH && m + duration <= endM)) {
    const sh = String(h).padStart(2, "0");
    const sm = String(m).padStart(2, "0");
    const totalEnd = m + duration;
    const eh = h + Math.floor(totalEnd / 60);
    const em = totalEnd % 60;
    slots.push(
      `من ${sh}:${sm} الى ${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`,
    );
    m += duration;
    if (m >= 60) {
      h += Math.floor(m / 60);
      m = m % 60;
    }
  }
  return slots;
}

/* ── Custom searchable dropdown ── */
function SearchSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "اختر…",
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  const filtered = useMemo(
    () =>
      options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())),
    [options, q],
  );

  const selected = options.find((o) => String(o.value) === String(value));

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function pick(val) {
    onChange(val);
    setOpen(false);
    setQ("");
  }

  return (
    <div className="field" ref={ref}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <button
          id={id}
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            width: "100%",
            minHeight: 40,
            padding: "9px 36px 9px 12px",
            borderRadius: "var(--radius-md)",
            border: `1px solid ${open ? "var(--brand)" : "var(--line)"}`,
            background: "var(--card)",
            color: selected ? "var(--ink)" : "var(--ink-25)",
            fontSize: 13,
            textAlign: "right",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: open ? "0 0 0 3px var(--focus-ring)" : "none",
          }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selected ? selected.label : placeholder}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            stroke="var(--ink-45)"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              flexShrink: 0,
              transition: "transform .2s",
              transform: open ? "rotate(180deg)" : "none",
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              right: 0,
              left: 0,
              zIndex: 999,
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 8px 24px rgba(10,31,27,.12)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "8px 10px",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div style={{ position: "relative" }}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  stroke="var(--ink-45)"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    position: "absolute",
                    right: 9,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  autoFocus
                  className="inp"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ابحث…"
                  style={{ paddingRight: 28, minHeight: 34, fontSize: 12.5 }}
                />
              </div>
            </div>
            <div
              style={{ maxHeight: 200, overflowY: "auto" }}
              className="custom-scroll"
            >
              {filtered.length === 0 ? (
                <div
                  style={{
                    padding: "12px 14px",
                    fontSize: 12,
                    color: "var(--ink-45)",
                    textAlign: "center",
                  }}
                >
                  لا توجد نتائج
                </div>
              ) : (
                filtered.map((o) => (
                  <div
                    key={String(o.value)}
                    onClick={() => pick(o.value)}
                    style={{
                      padding: "9px 14px",
                      fontSize: 13,
                      cursor: "pointer",
                      color:
                        String(o.value) === String(value)
                          ? "var(--brand)"
                          : "var(--ink)",
                      background:
                        String(o.value) === String(value)
                          ? "rgba(15,107,92,.06)"
                          : "transparent",
                      fontWeight: String(o.value) === String(value) ? 600 : 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={(e) => {
                      if (String(o.value) !== String(value))
                        e.currentTarget.style.background = "var(--paper)";
                    }}
                    onMouseLeave={(e) => {
                      if (String(o.value) !== String(value))
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {o.label}
                    {String(o.value) === String(value) && (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        stroke="var(--brand)"
                        fill="none"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7" />
                      </svg>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Time slots section ── */
function TimeSlots({ timeTables, doctorId, date, value, onChange }) {
  // parse date as local to avoid UTC offset shifting the day
  const dayName = useMemo(() => {
    if (!date) return null;
    const [y, m, d] = date.split("-").map(Number);
    return DAYS_EN[new Date(y, m - 1, d).getDay()];
  }, [date]);

  // find doctor's active time table for this date
  const table = useMemo(() => {
    if (!doctorId || !date) return null;
    return timeTables.find(
      (t) =>
        String(t.doctor_id) === String(doctorId) &&
        t.start_date <= date &&
        t.end_date >= date &&
        t.active,
    );
  }, [timeTables, doctorId, date]);

  // find schedule for this day
  const schedule = useMemo(() => {
    if (!table || !dayName) return null;
    return table.schedules?.find((s) => s.day === dayName);
  }, [table, dayName]);

  const slots = useMemo(() => {
    if (!schedule || !table) return [];
    const duration = table.session_hours || 30;
    const gap = table.duration_between_sessions || 0;
    const step = duration + gap;
    return [
      ...generateSlots(
        schedule.first_shift_start,
        schedule.first_shift_end,
        step,
      ),
      ...generateSlots(
        schedule.second_shift_start,
        schedule.second_shift_end,
        step,
      ),
      ...generateSlots(
        schedule.third_shift_start,
        schedule.third_shift_end,
        step,
      ),
    ];
  }, [schedule, table]);

  if (!doctorId || !date) return null;

  if (!table)
    return (
      <div
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: "rgba(169,118,18,.08)",
          fontSize: 12,
          color: "var(--warn)",
          marginBottom: 4,
        }}
      >
        لا يوجد جدول نشط لهذا الطبيب في التاريخ المختار ({date})
      </div>
    );

  if (!schedule)
    return (
      <div
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: "var(--paper)",
          fontSize: 12,
          color: "var(--ink-45)",
          marginBottom: 4,
        }}
      >
        الطبيب غير متاح يوم {dayName}
      </div>
    );

  return (
    <div className="field">
      <label className="field-label">الوقت المتاح</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {slots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onChange(slot)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "monospace",
              border: `1.5px solid ${value === slot ? "var(--brand)" : "var(--line)"}`,
              background: value === slot ? "rgba(15,107,92,.1)" : "var(--card)",
              color: value === slot ? "var(--brand)" : "var(--ink-70)",
            }}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main modal ── */
export default function BookingModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL);

  const { data: doctors = [] } = useDoctors();
  const { data: specializations = [] } = useSpecializations();
  const { data: clinics = [] } = useClinics();
  const { data: timeTables = [] } = useTimeTables();

  const filteredDoctors = useMemo(
    () =>
      doctors.filter((d) => {
        const matchClinic =
          !form.clinic_id || String(d.clinic_id) === String(form.clinic_id);
        const matchSpec =
          !form.specialization_id ||
          d.specializations?.some(
            (s) => String(s.id) === String(form.specialization_id),
          );
        return matchClinic && matchSpec;
      }),
    [doctors, form.clinic_id, form.specialization_id],
  );

  const selectedDoctor = useMemo(
    () => doctors.find((d) => String(d.id) === String(form.doctor_id)),
    [doctors, form.doctor_id],
  );

  function set(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "clinic_id" || field === "specialization_id") {
        next.doctor_id = "";
        next.time = "";
      }
      if (field === "doctor_id" || field === "date") next.time = "";
      return next;
    });
  }

  function handleSubmit() {
    if (!form.patient.trim() || !form.doctor_id || !form.date) return;
    onSubmit(form);
    setForm(INITIAL);
  }

  function handleClose() {
    setForm(INITIAL);
    onClose();
  }

  const clinicOptions = [
    { value: "", label: "كل العيادات" },
    ...clinics.map((c) => ({ value: c.id, label: c.name?.ar || c.name })),
  ];
  const specOptions = [
    { value: "", label: "كل التخصصات" },
    ...specializations.map((s) => ({
      value: s.id,
      label: s.title?.ar || s.title,
    })),
  ];
  const doctorOptions = [
    { value: "", label: "اختر الطبيب" },
    ...filteredDoctors.map((d) => ({
      value: d.id,
      label: `${d.name?.ar || d.name}${d.price ? ` — ${d.price} ج.م` : ""}`,
    })),
  ];
  const visitOptions = VISIT_TYPES.map((v) => ({
    value: v.value,
    label: v.label,
  }));

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="حجز جديد"
      subtitle="حجز موعد لمريض"
    >
      {/* Patient */}
      <div className="field">
        <label className="field-label" htmlFor="bk-patient">
          المريض
        </label>
        <input
          id="bk-patient"
          className="inp"
          placeholder="ابحث بالاسم أو رقم الملف…"
          value={form.patient}
          onChange={(e) => set("patient", e.target.value)}
        />
      </div>

      {/* Clinic + Specialty */}
      <div className="field-row">
        <SearchSelect
          id="bk-clinic"
          label="العيادة"
          value={form.clinic_id}
          onChange={(v) => set("clinic_id", v)}
          options={clinicOptions}
          placeholder="كل العيادات"
        />
        <SearchSelect
          id="bk-spec"
          label="التخصص"
          value={form.specialization_id}
          onChange={(v) => set("specialization_id", v)}
          options={specOptions}
          placeholder="كل التخصصات"
        />
      </div>

      {/* Doctor */}
      <SearchSelect
        id="bk-doctor"
        label="الطبيب"
        value={form.doctor_id}
        onChange={(v) => set("doctor_id", v)}
        options={doctorOptions}
        placeholder="اختر الطبيب"
      />

      {/* Doctor preview */}
      {selectedDoctor && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "var(--sand)",
            marginBottom: 4,
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {selectedDoctor.description?.ar && (
            <span style={{ fontSize: 11.5, color: "var(--ink-70)", flex: 1 }}>
              {selectedDoctor.description.ar}
            </span>
          )}
          {selectedDoctor.experience && (
            <span
              style={{
                fontSize: 11.5,
                color: "var(--ink-70)",
                whiteSpace: "nowrap",
              }}
            >
              خبرة <b>{selectedDoctor.experience}</b> سنة
            </span>
          )}
          {selectedDoctor.price && (
            <span
              style={{
                fontSize: 12,
                color: "var(--brand)",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {selectedDoctor.price} ج.م
            </span>
          )}
        </div>
      )}

      {/* Date + Visit type */}
      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="bk-date">
            التاريخ
          </label>
          <input
            id="bk-date"
            className="inp num"
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>
        <SearchSelect
          id="bk-visit"
          label="نوع الزيارة"
          value={form.visitType}
          onChange={(v) => set("visitType", v)}
          options={visitOptions}
        />
      </div>

      {/* Time slots */}
      <TimeSlots
        timeTables={timeTables}
        doctorId={form.doctor_id}
        date={form.date}
        value={form.time}
        onChange={(v) => set("time", v)}
      />

      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          marginTop: 6,
        }}
      >
        <button className="btn btn-q" onClick={handleClose}>
          إلغاء
        </button>
        <button
          className="btn btn-p"
          onClick={handleSubmit}
          disabled={!form.patient.trim() || !form.doctor_id || !form.date}
        >
          تأكيد الحجز
        </button>
      </div>
    </Modal>
  );
}
