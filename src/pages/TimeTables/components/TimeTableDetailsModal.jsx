import { useTimeTable } from "../../../hooks/queries/useTimeTables";
import Modal from "../../../components/ui/Modal";
import "../TimeTables.css";

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
  clinic: { label: "عيادة" },
  home: { label: "منزل" },
  video: { label: "فيديو" },
};

const SCHED_LABEL = {
  all_days: "كل الأيام",
  specific_days: "أيام محددة",
  flexible_schedule: "جدول مرن",
};

const SHIFT_KEYS = [
  { key: "first", label: "الوردية الأولى" },
  { key: "second", label: "الوردية الثانية" },
  { key: "third", label: "الوردية الثالثة" },
];

// ================= Helpers =================
const getDoctorName = (doctor) =>
  doctor?.name?.ar || doctor?.name?.en || "—";

const getTypeLabel = (type) => TYPE_MAP[type]?.label || type;

const getScheduleLabel = (type) => SCHED_LABEL[type] || type;

// ================= Main Component =================
export default function TimeTableDetailsModal({ id, onClose }) {
  const { data: tt, isLoading } = useTimeTable(id);
  const isReady = !isLoading && tt;

  return (
    <Modal title="تفاصيل الجدول" onClose={onClose} size="lg">
      {!isReady ? (
        <div className="ttd-loading">جاري التحميل...</div>
      ) : (
        <TimeTableDetails timeTable={tt} />
      )}
    </Modal>
  );
}

// ================= Sub Components =================
function TimeTableDetails({ timeTable: tt }) {
  return (
    <div className="ttd-body">
      <FieldsGrid timeTable={tt} />

      {tt.notes && <Notes text={tt.notes} />}

      <SchedulesSection schedules={tt.schedules} />
    </div>
  );
}

function FieldsGrid({ timeTable: tt }) {
  const fields = [
    { label: "الطبيب", value: getDoctorName(tt.doctor) },
    { label: "اسم الجدول", value: tt.name },
    { label: "النوع", value: getTypeLabel(tt.type) },
    { label: "نوع الجدول", value: getScheduleLabel(tt.schedule_type) },
    { label: "تاريخ البداية", value: tt.start_date },
    { label: "تاريخ النهاية", value: tt.end_date },
    { label: "مدة الجلسة", value: `${tt.session_hours} دقيقة` },
    { label: "فترة الراحة", value: `${tt.duration_between_sessions} دقيقة` },
  ];

  return (
    <div className="ttd-grid">
      {fields.map((f) => (
        <Field key={f.label} label={f.label} value={f.value} />
      ))}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="ttd-field-lbl">{label}</div>
      <div className="ttd-field-val">{value}</div>
    </div>
  );
}

function Notes({ text }) {
  return (
    <div>
      <div className="ttd-notes-lbl">ملاحظات</div>
      <div className="ttd-notes-val">{text}</div>
    </div>
  );
}

function SchedulesSection({ schedules }) {
  return (
    <div>
      <div className="ttd-sched-lbl">جدول الأيام</div>
      <div className="ttd-sched-list">
        {schedules?.map((s) => (
          <ScheduleRow key={s.id} schedule={s} />
        ))}
      </div>
    </div>
  );
}

function ScheduleRow({ schedule: s }) {
  return (
    <div className="ttd-sched-row">
      <span className="ttd-day-name">{DAYS_AR[s.day] || s.day}</span>

      {SHIFT_KEYS.map(({ key, label }) => (
        <Shift
          key={key}
          label={label}
          start={s[`${key}_shift_start`]}
          end={s[`${key}_shift_end`]}
        />
      ))}
    </div>
  );
}

function Shift({ label, start, end }) {
  if (!start || !end) return <div className="ttd-shift-empty">—</div>;

  return (
    <div>
      <div className="ttd-shift-lbl">{label}</div>
      <div className="ttd-shift-val">
        {start} – {end}
      </div>
    </div>
  );
}