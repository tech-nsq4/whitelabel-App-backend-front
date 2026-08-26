import { useState, useMemo } from "react";
import { FileText, Calendar, X } from "lucide-react";
import { useAppointments } from "../../../hooks/queries/useAppointments";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { SkeletonTable } from "../../../components/ui/Skeleton";

const STATUSES = {
  pending: { label: "انتظار", bg: "rgba(201,162,39,.1)", color: "#C9A227" },
  confirmed: { label: "مؤكد", bg: "rgba(15,107,92,.1)", color: "#0F6B5C" },
  in_progress: {
    label: "في الكشف",
    bg: "rgba(44,109,170,.1)",
    color: "#2C6DAA",
  },
  completed: { label: "مكمل", bg: "rgba(124,58,237,.1)", color: "#7C3AED" },
  cancelled: { label: "ملغي", bg: "rgba(179,64,47,.1)", color: "#B3402F" },
};

const VISIT_TYPES = {
  clinic: { label: "عيادة", bg: "rgba(15,107,92,.08)", color: "#0F6B5C" },
  home: { label: "منزل", bg: "rgba(44,109,170,.08)", color: "#2C6DAA" },
  video: { label: "فيديو", bg: "rgba(124,58,237,.08)", color: "#7C3AED" },
};

const AVATAR_COLORS = [
  "#0F6B5C",
  "#2C6DAA",
  "#7C3AED",
  "#D97706",
  "#DB2777",
  "#B3402F",
  "#059669",
];
const PAGE_SIZE = 10;

const COLS = [
  { key: "no", label: "#", width: 70 },
  { key: "patient", label: "المريض", width: 180 },
  { key: "doctor", label: "الطبيب", width: 140 },
  { key: "specialty", label: "التخصص", width: 110 },
  { key: "branch", label: "الفرع", width: 110 },
  { key: "date", label: "التاريخ", width: 100 },
  { key: "time", label: "الوقت", width: 90 },
  { key: "type", label: "النوع", width: 90 },
  { key: "status", label: "الحالة", width: 100 },
  { key: "actions", label: "", width: 50 },
];

export default function AppointmentsTable({ clinicFilter, dateRange }) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [applyDate, setApplyDate] = useState(false);

  const { data: appointments = [], isLoading } = useAppointments();

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (
        clinicFilter !== "all" &&
        String(a.doctor?.clinic_id) !== String(clinicFilter)
      )
        return false;
      if (applyDate && dateRange?.from) {
        const to = dateRange.to || dateRange.from;
        if (a.date < dateRange.from || a.date > to) return false;
      }
      const q = search.trim();
      if (q) {
        const patient = a.family_member?.name || a.user?.name || "";
        const doctor = a.doctor?.name?.ar || "";
        if (
          !patient.includes(q) &&
          !doctor.includes(q) &&
          !String(a.id).includes(q)
        )
          return false;
      }
      return true;
    });
  }, [appointments, statusFilter, search, applyDate, dateRange, clinicFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const dateLabel = dateRange?.from
    ? dateRange.from === dateRange.to
      ? dateRange.from
      : `${dateRange.from} ← ${dateRange.to}`
    : "";

  return (
    <div>
      {/* ── Toolbar ── */}
      <div className="appt-toolbar">
        {/* Right: status pills */}
        <div className="appt-status-pills">
          {[
            { id: "all", label: "كل الحالات" },
            ...Object.entries(STATUSES).map(([id, v]) => ({
              id,
              label: v.label,
            })),
          ].map((f) => {
            const active = statusFilter === f.id;
            const meta = STATUSES[f.id];
            return (
              <button
                key={f.id}
                className={`appt-pill${active ? " active" : ""}`}
                style={
                  active && meta
                    ? { "--pill-color": meta.color, "--pill-bg": meta.bg }
                    : {}
                }
                onClick={() => {
                  setStatus(f.id);
                  setPage(1);
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Left: search + date filter + count */}
        <div className="appt-toolbar-right">
          {/* Search */}
          <div className="appt-search-wrap">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              stroke="var(--ink-45)"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className="appt-search-inp"
              placeholder="ابحث بالمريض أو الطبيب..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            {search && (
              <button
                className="appt-clear-btn"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Date filter */}
          {dateRange?.from && (
            <button
              className={`appt-date-btn${applyDate ? " active" : ""}`}
              onClick={() => {
                setApplyDate((v) => !v);
                setPage(1);
              }}
            >
              <Calendar size={13} strokeWidth={2} />
              {applyDate ? dateLabel : "فلتر بالتاريخ"}
              {applyDate && (
                <span
                  className="appt-date-x"
                  onClick={(e) => {
                    e.stopPropagation();
                    setApplyDate(false);
                    setPage(1);
                  }}
                >
                  <X size={11} strokeWidth={2.5} />
                </span>
              )}
            </button>
          )}

          <span className="appt-count">{filtered.length} موعد</span>
        </div>
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <SkeletonTable rows={8} cols={COLS.length} />
      ) : (
        <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
          <table className="data" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                {COLS.map((c) => (
                  <th key={c.key} style={{ minWidth: c.width }}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLS.length}
                    style={{
                      textAlign: "center",
                      padding: "48px",
                      color: "var(--ink-45)",
                      fontSize: 13,
                    }}
                  >
                    لا توجد مواعيد
                  </td>
                </tr>
              ) : (
                rows.map((a) => {
                  const status = STATUSES[a.status] || STATUSES.pending;
                  const typeM =
                    VISIT_TYPES[a.time_table?.type] || VISIT_TYPES.clinic;
                  const patientName =
                    a.family_member?.name || a.user?.name || "—";
                  const doctorName = a.doctor?.name?.ar || "—";
                  const specialty =
                    a.doctor?.specializations?.[0]?.title?.ar || "—";
                  const branch = a.doctor?.clinic?.name?.ar || "—";
                  const avatarBg =
                    AVATAR_COLORS[(a.id - 1) % AVATAR_COLORS.length];

                  return (
                    <tr key={a.id}>
                      <td
                        style={{
                          fontSize: 11.5,
                          color: "var(--ink-45)",
                          fontFamily: "monospace",
                        }}
                      >
                        #{a.id}
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 9,
                              background: avatarBg,
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {patientName.charAt(0)}
                          </div>
                          <div>
                            <div className="td-name">{patientName}</div>
                            <div className="td-sub">{a.user?.phone || "—"}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: "var(--ink)",
                          }}
                        >
                          {doctorName}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            padding: "3px 9px",
                            borderRadius: 99,
                            background: "var(--paper)",
                            color: "var(--ink-70)",
                          }}
                        >
                          {specialty}
                        </span>
                      </td>

                      <td style={{ fontSize: 12.5, color: "var(--ink-70)" }}>
                        {branch}
                      </td>

                      <td
                        style={{
                          fontSize: 12,
                          color: "var(--ink-70)",
                          fontFamily: "monospace",
                        }}
                      >
                        {a.date}
                      </td>

                      <td
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--ink)",
                          fontFamily: "monospace",
                          direction: "ltr",
                          textAlign: "right",
                        }}
                      >
                        {a.times}
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            padding: "3px 9px",
                            borderRadius: 99,
                            background: typeM.bg,
                            color: typeM.color,
                          }}
                        >
                          {typeM.label}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            padding: "3px 9px",
                            borderRadius: 99,
                            background: status.bg,
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td>
                        <button
                          className="icon-btn"
                          title="تفاصيل الحجز"
                          style={{ width: 30, height: 30 }}
                          onClick={() => setSelectedId(a.id)}
                        >
                          <FileText size={14} strokeWidth={1.7} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {!isLoading && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 14,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, color: "var(--ink-45)" }}>
            {(safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, filtered.length)} من{" "}
            {filtered.length}
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`btn ${p === safePage ? "btn-p" : "btn-q"}`}
                style={{
                  minWidth: 34,
                  padding: "6px 0",
                  fontSize: 12,
                  justifyContent: "center",
                }}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
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

      <AppointmentDetailsModal
        appointmentId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
