import { useMemo, useState } from "react";
import { useTimeTables } from "../../../hooks/queries/useTimeTables";
import { SkeletonTable } from "../../../components/ui/Skeleton";

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
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: 7,
        marginBottom: 5,
        background: soft,
        border: `1px solid ${color}25`,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <span
        style={{ fontSize: 12.5, fontWeight: 700, color, letterSpacing: 0.3 }}
        dir="ltr"
      >
        {start} – {end}
      </span>
    </div>
  );
}

function EmptyCell() {
  return (
    <td
      style={{
        padding: "14px 12px",
        borderLeft: "1px solid var(--line)",
        verticalAlign: "middle",
        textAlign: "center",
        background: "var(--surface-subtle)",
      }}
    >
      <div
        style={{
          width: 20,
          height: 2,
          background: "var(--line)",
          borderRadius: 2,
          margin: "0 auto",
        }}
      />
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
    <tr style={{ borderBottom: "1px solid var(--line)", background: bg }}>
      <td
        style={{
          padding: "14px 16px",
          minWidth: 280,
          maxWidth: 280,
          position: "sticky",
          right: 0,
          zIndex: 1,
          borderLeft: "2px solid var(--line)",
          background: bg,
          verticalAlign: "top",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              flexShrink: 0,
              background: `linear-gradient(145deg, ${meta.color}, ${meta.color}99)`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 800,
              boxShadow: `0 3px 8px ${meta.color}30`,
            }}
          >
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 4,
              }}
            >
              {nameAr}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 99,
                  background: meta.soft,
                  color: meta.color,
                  whiteSpace: "nowrap",
                }}
              >
                {meta.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 99,
                  background: "var(--paper)",
                  color: "var(--ink-45)",
                  whiteSpace: "nowrap",
                }}
              >
                {SCHEDULE_TYPE_AR[table.schedule_type]}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--ink-45)",
            marginBottom: 7,
            direction: "ltr",
            textAlign: "right",
          }}
        >
          {table.start_date} → {table.end_date}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "nowrap" }}>
          {price && (
            <span
              style={{
                fontSize: 11.5,
                color: "var(--ink-70)",
                whiteSpace: "nowrap",
              }}
            >
              <b style={{ color: "var(--ink)" }}>{price}</b> ر.س
            </span>
          )}
          {exp && (
            <span
              style={{
                fontSize: 11.5,
                color: "var(--ink-70)",
                whiteSpace: "nowrap",
              }}
            >
              خبرة <b style={{ color: "var(--ink)" }}>{exp}</b>سنة
            </span>
          )}
          <span
            style={{
              fontSize: 11.5,
              color: "var(--ink-70)",
              whiteSpace: "nowrap",
            }}
          >
            مدة <b style={{ color: "var(--ink)" }}>{table.session_hours}</b>د
          </span>
          <span
            style={{
              fontSize: 11.5,
              color: "var(--ink-70)",
              whiteSpace: "nowrap",
            }}
          >
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
          <td
            key={day}
            style={{
              padding: "10px 12px",
              verticalAlign: "top",
              minWidth: 150,
              borderLeft: "1px solid var(--line)",
            }}
          >
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

export default function CalendarView({
  clinicFilter = "all",
  dateRange,
  view,
}) {
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
      // table is active within the selected date range
      const matchDate =
        !dateRange ||
        (t.start_date <= dateRange.to && t.end_date >= dateRange.from);
      return matchType && matchSearch && matchClinic && matchDate;
    });
  }, [timeTables, search, typeFilter, clinicFilter, dateRange]);

  const safePage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
  );
  const days = useMemo(() => collectDays(filtered), [filtered]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  if (isLoading)
    return (
      <div className="panel" style={{ padding: 28 }}>
        <SkeletonTable rows={8} cols={6} />
      </div>
    );

  return (
    <>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 260 }}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            stroke="var(--ink-45)"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              position: "absolute",
              right: 11,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="inp"
            style={{
              paddingRight: 34,
              minHeight: 38,
              fontSize: 12.5,
              borderRadius: 10,
            }}
            placeholder="ابحث بالدكتور…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Clinic filter — removed, now in CalendarHeader */}

        {/* Type filter */}
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

        <span
          style={{ marginRight: "auto", fontSize: 12, color: "var(--ink-45)" }}
        >
          {filtered.length} جدول
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div
          className="panel"
          style={{ padding: "64px 24px", textAlign: "center" }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              margin: "0 auto 16px",
              background: "var(--sand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 6,
            }}
          >
            لا توجد جداول في هذا التاريخ
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-45)" }}>
            جرب تغيير التاريخ أو البحث أو الفلتر
          </div>
        </div>
      ) : (
        <>
          <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--line)" }}>
                  <th
                    style={{
                      padding: "13px 16px",
                      textAlign: "right",
                      minWidth: 280,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--ink-45)",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      position: "sticky",
                      right: 0,
                      zIndex: 2,
                      background: "var(--surface-subtle)",
                      borderLeft: "2px solid var(--line)",
                    }}
                  >
                    الطبيب
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      style={{
                        padding: "13px 12px",
                        textAlign: "center",
                        minWidth: 150,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--ink)",
                        background: "var(--surface-subtle)",
                        borderLeft: "1px solid var(--line)",
                      }}
                    >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 16,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 12, color: "var(--ink-45)" }}>
                {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} من{" "}
                {filtered.length} جدول
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  className="btn btn-q"
                  style={{ padding: "6px 13px", fontSize: 12 }}
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
                      <span
                        key={`d${i}`}
                        style={{ padding: "0 4px", color: "var(--ink-45)" }}
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        className={`btn ${p === safePage ? "btn-p" : "btn-q"}`}
                        style={{
                          minWidth: 36,
                          padding: "6px 0",
                          fontSize: 12,
                          justifyContent: "center",
                        }}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ),
                  )}
                <button
                  className="btn btn-q"
                  style={{ padding: "6px 13px", fontSize: 12 }}
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
