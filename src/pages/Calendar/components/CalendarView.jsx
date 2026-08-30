import { useMemo, useState } from "react";
import { useTimeTables } from "../../../hooks/queries/useTimeTables";
import { SkeletonTable } from "../../../components/ui/Skeleton";
import "../styles/calendar-view.css";

const DAY_AR = {
  Saturday: "السبت",
  Sunday: "الأحد",
  Monday: "الاثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
};
const DAY_ORDER = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const TYPE_META = {
  clinic: { label: "عيادة", color: "#0F6B5C", soft: "#e8f5f2" },
  home: { label: "منزل", color: "#2C6DAA", soft: "#e8f0fa" },
  video: { label: "فيديو", color: "#7C3AED", soft: "#f0ebfd" },
};

const SCHEDULE_TYPE_AR = {
  all_days: "كل الأيام",
  specific_days: "أيام محددة",
  flexible_schedule: "جدول مرن",
};

const PAGE_SIZE = 12;

function collectDays(timeTables) {
  const set = new Set();
  timeTables.forEach((t) => t.schedules?.forEach((s) => set.add(s.day)));
  return DAY_ORDER.filter((d) => set.has(d));
}

function ShiftPill({ start, end, color, soft }) {
  if (!start || !end) return null;
  return (
    <div
      className="cv-shift-pill"
      style={{ background: soft, border: `1px solid ${color}25` }}
    >
      <div className="cv-shift-dot" style={{ background: color }} />
      <span className="cv-shift-time" style={{ color }} dir="ltr">
        {start} – {end}
      </span>
    </div>
  );
}

function EmptyCell() {
  return (
    <td className="cv-td-empty">
      <div className="cv-empty-line" />
    </td>
  );
}

function DoctorRow({ table, days, isEven }) {
  const meta = TYPE_META[table.type] || TYPE_META.clinic;
  const nameAr = table.doctor?.name?.ar || "—";
  const initial = nameAr.replace(/^د\.\s*/, "").charAt(0);
  const price = table.doctor?.price;
  const exp = table.doctor?.experience;
  const bg = isEven ? "#fff" : "var(--surface-subtle)";

  return (
    <tr className="cv-doctor-row" style={{ background: bg }}>
      <td className="cv-td-doctor" style={{ background: bg }}>
        <div className="cv-doctor-header">
          <div
            className="cv-doctor-avatar"
            style={{
              background: `linear-gradient(145deg, ${meta.color}, ${meta.color}99)`,
              boxShadow: `0 3px 8px ${meta.color}30`,
            }}
          >
            {initial}
          </div>
          <div className="cv-doctor-info">
            <div className="cv-doctor-name">{nameAr}</div>
            <div className="cv-doctor-badges">
              <span
                className="cv-badge"
                style={{ background: meta.soft, color: meta.color }}
              >
                {meta.label}
              </span>
              <span className="cv-badge-muted">
                {SCHEDULE_TYPE_AR[table.schedule_type]}
              </span>
            </div>
          </div>
        </div>
        <div className="cv-doctor-dates">
          {table.start_date} → {table.end_date}
        </div>
        <div className="cv-doctor-meta">
          {price && (
            <span className="cv-meta-item">
              <b style={{ color: "var(--ink)" }}>{price}</b> ر.س
            </span>
          )}
          {exp && (
            <span className="cv-meta-item">
              خبرة <b style={{ color: "var(--ink)" }}>{exp}</b>سنة
            </span>
          )}
          <span className="cv-meta-item">
            مدة <b style={{ color: "var(--ink)" }}>{table.session_hours}</b>د
          </span>
          <span className="cv-meta-item">
            راحة{" "}
            <b style={{ color: "var(--ink)" }}>
              {table.duration_between_sessions}
            </b>
            د
          </span>
        </div>
      </td>

      {days.map((day) => {
        const s = table.schedules?.find((sc) => sc.day === day);
        if (!s) return <EmptyCell key={day} />;
        return (
          <td key={day} className="cv-td-day">
            <ShiftPill
              start={s.first_shift_start}
              end={s.first_shift_end}
              color={meta.color}
              soft={meta.soft}
            />
            <ShiftPill
              start={s.second_shift_start}
              end={s.second_shift_end}
              color={meta.color}
              soft={meta.soft}
            />
            <ShiftPill
              start={s.third_shift_start}
              end={s.third_shift_end}
              color={meta.color}
              soft={meta.soft}
            />
          </td>
        );
      })}
    </tr>
  );
}

export default function CalendarView({ clinicFilter = "all", dateRange }) {
  const { data: timeTables = [], isLoading } = useTimeTables();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return timeTables.filter((t) => {
      const nameAr = t.doctor?.name?.ar || "";
      const matchSearch =
        !search.trim() ||
        nameAr.includes(search.trim()) ||
        t.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchType = typeFilter === "all" || t.type === typeFilter;
      const matchClinic =
        clinicFilter === "all" ||
        String(t.doctor?.clinic_id) === String(clinicFilter);
      const matchDate =
        !dateRange ||
        (t.start_date <= dateRange.to && t.end_date >= dateRange.from);
      return matchType && matchSearch && matchClinic && matchDate;
    });
  }, [timeTables, search, typeFilter, clinicFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const days = useMemo(() => collectDays(filtered), [filtered]);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  if (isLoading)
    return (
      <div className="panel cv-loading">
        <SkeletonTable rows={8} cols={6} />
      </div>
    );

  return (
    <>
      {/* Toolbar */}
      <div className="cv-toolbar">
        <div className="cv-search-wrap">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            stroke="var(--ink-45)"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="cv-search-icon"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="inp cv-search-inp"
            placeholder="ابحث بالدكتور…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div
          className="cal-tabs-inline"
          style={{ position: "static", transform: "none" }}
        >
          {[
            { id: "all", label: "الكل" },
            { id: "clinic", label: "عيادة" },
            { id: "home", label: "منزل" },
            { id: "video", label: "فيديو" },
          ].map((f) => (
            <button
              key={f.id}
              className={`cal-tab-inline${typeFilter === f.id ? " active" : ""}`}
              onClick={() => setTypeFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="cv-count">{filtered.length} جدول</span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="panel cv-empty-state">
          <div className="cv-empty-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="var(--brand)"
              fill="none"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01" />
            </svg>
          </div>
          <div className="cv-empty-title">لا توجد جداول في هذا التاريخ</div>
          <div className="cv-empty-sub">
            جرب تغيير التاريخ أو البحث أو الفلتر
          </div>
        </div>
      ) : (
        <>
          <div className="panel cv-table-wrap">
            <table className="cv-table">
              <thead>
                <tr className="cv-thead-row">
                  <th className="cv-th-doctor">الطبيب</th>
                  {days.map((day) => (
                    <th key={day} className="cv-th-day">
                      {DAY_AR[day]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((table, i) => (
                  <DoctorRow
                    key={table.id}
                    table={table}
                    days={days}
                    isEven={i % 2 === 0}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="cv-pagination">
              <span className="cv-pagination-info">
                {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} من{" "}
                {filtered.length} جدول
              </span>
              <div className="cv-pagination-btns">
                <button
                  className="btn btn-q cv-pagination-btn"
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  السابق
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - safePage) <= 1,
                  )
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`d${i}`} className="cv-pagination-ellipsis">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        className={`btn ${p === safePage ? "btn-p" : "btn-q"} cv-pagination-page`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ),
                  )}
                <button
                  className="btn btn-q cv-pagination-btn"
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
