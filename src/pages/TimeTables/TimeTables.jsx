import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Calendar,
  Stethoscope,
  Home,
  Video,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  useTimeTables,
  useDeleteTimeTable,
} from "../../hooks/queries/useTimeTables";
import { useToast } from "../../components/ui/Toast";
import { SkeletonTable } from "../../components/ui/Skeleton";
import TimeTableDetailsModal from "./components/TimeTableDetailsModal";
import "./TimeTables.css";

// ================= Constants =================
const DAYS_AR = {
  Saturday: "السبت",
  Sunday: "الأحد",
  Monday: "الاثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
};

const TYPE_MAP = {
  clinic: { label: "عيادة", bg: "rgba(15,107,92,.1)", color: "#0F6B5C" },
  home: { label: "منزل", bg: "rgba(44,109,170,.1)", color: "#2C6DAA" },
  video: { label: "فيديو", bg: "rgba(124,58,237,.1)", color: "#7C3AED" },
};

const SCHEDULE_MAP = {
  all_days: "كل الأيام",
  specific_days: "أيام محددة",
  flexible_schedule: "جدول مرن",
};

const FILTER_TYPES = ["all", "clinic", "home", "video"];

const STATS = [
  {
    key: "all",
    label: "إجمالي الجداول",
    icon: <Calendar size={16} />,
    cls: "green",
  },
  {
    key: "clinic",
    label: "عيادة",
    icon: <Stethoscope size={16} />,
    cls: "blue",
  },
  { key: "home", label: "منزل", icon: <Home size={16} />, cls: "purple" },
  { key: "video", label: "فيديو", icon: <Video size={16} />, cls: "gold" },
];

const TABLE_HEADERS = [
  "#",
  "الطبيب",
  "اسم الجدول",
  "النوع",
  "الأيام",
  "الوردية الأولى",
  "الوردية الثانية",
  "الفترة",
  "الحالة",
  "",
];

// ================= Helpers =================
function getDoctorName(doctor) {
  return doctor?.name?.ar || doctor?.name?.en || "—";
}

function getDoctorInitial(name) {
  return name !== "—" ? name.replace("د. ", "").charAt(0) : "؟";
}

function formatShift(start, end) {
  return start && end ? `${start} – ${end}` : "—";
}

function countByType(rows, type) {
  return rows.filter((r) => r.type === type).length;
}

// ================= Main Component =================
export default function TimeTables() {
  const { data, isLoading } = useTimeTables();
  const { mutate: deleteTimeTable } = useDeleteTimeTable();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const rows = Array.isArray(data) ? data : (data?.data ?? []);
  const filtered =
    filterType === "all" ? rows : rows.filter((r) => r.type === filterType);

  function handleDelete(tt) {
    if (!window.confirm(`حذف جدول "${tt.name}"؟`)) return;
    deleteTimeTable(tt.id, {
      onSuccess: () => showToast("تم الحذف بنجاح", "success"),
      onError: (e) =>
        showToast(
          e?.response?.data?.message || "لا يمكن الحذف — يوجد مواعيد مرتبطة",
          "error",
        ),
    });
  }

  return (
    <div className="tt-page">
      <PageHeader
        filterType={filterType}
        onFilterChange={setFilterType}
        onCreate={() => navigate("/time-tables/new")}
      />

      <StatsGrid rows={rows} />

      <div className="panel">
        {isLoading ? (
          <SkeletonTable rows={5} cols={7} />
        ) : (
          <TimeTablesTable
            rows={filtered}
            onSelect={(id) => navigate(`/time-tables/${id}/edit`)}
            onDelete={handleDelete}
          />
        )}
      </div>

      {selectedId && (
        <TimeTableDetailsModal
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

// ================= Layout Sections =================
function PageHeader({ filterType, onFilterChange, onCreate }) {
  return (
    <div className="page-head">
      <div>
        <h1>جداول الأطباء</h1>
        <div className="sub">إدارة جداول المواعيد والورديات</div>
      </div>
      <div className="page-actions">
        <TypeFilter value={filterType} onChange={onFilterChange} />
        <button className="btn btn-p" onClick={onCreate}>
          <Plus size={14} strokeWidth={2} />
          جدول جديد
        </button>
      </div>
    </div>
  );
}

function TypeFilter({ value, onChange }) {
  return (
    <div className="seg">
      {FILTER_TYPES.map((t) => (
        <div
          key={t}
          className={`seg-btn${value === t ? " active" : ""}`}
          onClick={() => onChange(t)}
        >
          {t === "all" ? "الكل" : TYPE_MAP[t]?.label}
        </div>
      ))}
    </div>
  );
}

function StatsGrid({ rows }) {
  return (
    <div className="tt-stats">
      {STATS.map((s) => (
        <div key={s.key} className="panel tt-stat">
          <div className={`tt-stat-icon ${s.cls}`}>{s.icon}</div>
          <div>
            <div className="tt-stat-val">
              {s.key === "all" ? rows.length : countByType(rows, s.key)}
            </div>
            <div className="tt-stat-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ================= Table =================
function TimeTablesTable({ rows, onSelect, onDelete }) {
  return (
    <div className="tt-table-wrap">
      <table className="data tt-table">
        <thead>
          <tr>
            {TABLE_HEADERS.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyRow />
          ) : (
            rows.map((tt) => (
              <TimeTableRow
                key={tt.id}
                timeTable={tt}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function EmptyRow() {
  return (
    <tr>
      <td
        colSpan={TABLE_HEADERS.length}
        style={{ textAlign: "center", padding: 48, color: "var(--ink-45)" }}
      >
        لا توجد جداول
      </td>
    </tr>
  );
}

function TimeTableRow({ timeTable: tt, onSelect, onDelete }) {
  const typeMeta = TYPE_MAP[tt.type] || TYPE_MAP.clinic;
  const shift = tt.schedules?.[0] || tt.shift || {};
  const days = tt.schedules?.map((s) => DAYS_AR[s.day] || s.day) ?? [];
  const docName = getDoctorName(tt.doctor);
  const docInitial = getDoctorInitial(docName);

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <tr onClick={() => onSelect(tt.id)}>
      <td>
        <span className="tt-id">{tt.time_number || `#${tt.id}`}</span>
      </td>

      <td>
        <div className="td-lead">
          <div className="avatar">{docInitial}</div>
          <div className="td-name">{docName}</div>
        </div>
      </td>

      <td>
        <div className="td-name tt-name-max">{tt.name}</div>
        <div className="td-sub">
          {SCHEDULE_MAP[tt.schedule_type] || tt.schedule_type}
        </div>
      </td>

      <td>
        <span
          className="tt-badge"
          style={{ background: typeMeta.bg, color: typeMeta.color }}
        >
          {typeMeta.label}
        </span>
      </td>

      <td>
        <DaysCell days={days} />
      </td>

      <td onClick={stopPropagation}>
        <span className="tt-shift">
          {formatShift(shift.first_shift_start, shift.first_shift_end)}
        </span>
      </td>

      <td onClick={stopPropagation}>
        <span className="tt-shift">
          {formatShift(shift.second_shift_start, shift.second_shift_end)}
        </span>
      </td>

      <td onClick={stopPropagation}>
        <span className="tt-period">
          {tt.start_date} ← {tt.end_date}
        </span>
      </td>

      <td onClick={stopPropagation}>
        <span className={`tt-badge ${tt.active ? "active" : "inactive"}`}>
          {tt.active ? "نشط" : "موقوف"}
        </span>
      </td>

      <td onClick={stopPropagation}>
        <RowActions
          onEdit={() => onSelect(tt.id)}
          onDelete={() => onDelete(tt)}
        />
      </td>
    </tr>
  );
}

function DaysCell({ days, max = 4 }) {
  const visible = days.slice(0, max);
  const remaining = days.length - max;

  return (
    <div className="tt-days">
      {visible.map((d) => (
        <span key={d} className="tt-day">
          {d}
        </span>
      ))}
      {remaining > 0 && <span className="tt-day more">+{remaining}</span>}
    </div>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="tt-actions">
      <button className="icon-btn" title="تفاصيل" onClick={onEdit}>
        <Pencil size={13} strokeWidth={1.8} />
      </button>
      <button className="icon-btn tt-del" title="حذف" onClick={onDelete}>
        <Trash2 size={13} strokeWidth={1.8} />
      </button>
    </div>
  );
}