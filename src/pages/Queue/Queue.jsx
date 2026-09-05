import { useMemo, useState } from "react";
import QueueStats from "./components/QueueStats";
import QueueFilters from "./components/QueueFilters";
import QueueTable from "./components/QueueTable";
import WalkInModal from "./components/WalkInModal";
import { useToast } from "../../components/ui/Toast";
import {
  useAppointments,
  useUpdateAppointment,
} from "../../hooks/queries/useAppointments";
import { useClinics } from "../../hooks/queries/useClinics";
import { SkeletonTable } from "../../components/ui/Skeleton";
import "./Queue.css";

function toToday() {
  return new Date().toISOString().slice(0, 10);
}

// map API status → queue status
const STATUS_MAP = {
  pending: "waiting",
  confirmed: "waiting",
  in_progress: "in_exam",
  completed: "done",
  cancelled: "done",
};

export default function Queue() {
  const { showToast } = useToast();
  const today = toToday();

  const { data: appointments = [], isLoading } = useAppointments({
    date: today,
  });
  const { data: clinics = [] } = useClinics();
  const updateAppointment = useUpdateAppointment();

  const [clinicFilter, setClinicFilter] = useState("all");
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [localEntries, setLocalEntries] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('queue_local_entries') || '[]') }
    catch { return [] }
  });

  function addLocalEntry(entry) {
    setLocalEntries(p => {
      const next = [...p, entry]
      sessionStorage.setItem('queue_local_entries', JSON.stringify(next))
      return next
    })
  }

  function updateLocalEntry(id, status) {
    setLocalEntries(p => {
      const next = p.map(e => e.id === id ? { ...e, status } : e)
      sessionStorage.setItem('queue_local_entries', JSON.stringify(next))
      return next
    })
  }

  // persist overrides in sessionStorage — survives page refresh
  const [overrides, setOverrides] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("queue_overrides") || "{}");
    } catch {
      return {};
    }
  });

  function applyOverride(id, status) {
    setOverrides((p) => {
      const next = { ...p, [id]: status };
      sessionStorage.setItem("queue_overrides", JSON.stringify(next));
      return next;
    });
  }

  // normalize API appointments → queue entries, applying local overrides
  const apiEntries = useMemo(
    () =>
      appointments.map((a) => ({
        id:         a.id,
        initial:    (a.family_member?.name || a.user?.name || "؟").charAt(0),
        name:       a.family_member?.name || a.user?.name || "—",
        fileNo:     `#${a.id}`,
        phone:      a.user?.phone || "",
        doctor:     a.doctor?.name?.ar || "—",
        clinicId:   a.doctor?.clinic?.id,
        clinicName: a.doctor?.clinic?.name?.ar || "—",
        arrivedAt:  a.times || "—",
        status:     overrides[a.id] ?? STATUS_MAP[a.status] ?? "waiting",
        apiStatus:  a.status,
        isLocal:    false,
      })),
    [appointments, overrides],
  );

  const entries = useMemo(() => [...apiEntries, ...localEntries], [apiEntries, localEntries]);

  const filtered = useMemo(
    () =>
      entries.filter(
        (e) =>
          clinicFilter === "all" || String(e.clinicId) === String(clinicFilter),
      ),
    [entries, clinicFilter],
  );

  // stats derived from real data
  const stats = useMemo(
    () => ({
      waiting: entries.filter((e) => e.status === "waiting").length,
      in_exam: entries.filter((e) => e.status === "in_exam").length,
      done: entries.filter((e) => e.status === "done").length,
      total: entries.length,
    }),
    [entries],
  );

  async function handleCallPatient(id) {
    if (String(id).startsWith('local-')) {
      updateLocalEntry(id, 'in_exam')
      showToast('تم استدعاء المريض للكشف'); return
    }
    applyOverride(id, "in_exam");
    try {
      await updateAppointment.mutateAsync({ id, data: { status: "in_progress" } });
      showToast("تم استدعاء المريض للكشف");
    } catch { showToast("تم الاستدعاء محلياً"); }
  }

  async function handleFinishExam(id) {
    if (String(id).startsWith('local-')) {
      updateLocalEntry(id, 'done')
      showToast('تم إنهاء الكشف بنجاح'); return
    }
    applyOverride(id, "done");
    try {
      await updateAppointment.mutateAsync({ id, data: { status: "completed" } });
      showToast("تم إنهاء الكشف بنجاح");
    } catch { showToast("تم الإنهاء محلياً"); }
  }

  function handleDefer(id) {
    if (String(id).startsWith('local-')) {
      updateLocalEntry(id, 'waiting')
    } else {
      applyOverride(id, "waiting");
    }
    showToast("تم تأجيل المريض");
  }

  function handleWalkInSubmit(data) {
    const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    const newEntry = {
      id:         `local-${Date.now()}`,
      initial:    data.name.trim().charAt(0) || '؟',
      name:       data.name.trim(),
      fileNo:     '—',
      phone:      '',
      doctor:     data.doctorName || '—',
      clinicId:   data.clinicId   || null,
      clinicName: data.clinicName || '—',
      arrivedAt:  now,
      status:     'waiting',
      isLocal:    true,
    }
    addLocalEntry(newEntry)
    showToast(`تم تسجيل حضور ${data.name}`)
    setWalkInOpen(false)
  }

  return (
    <div className="queue-page page-fade">
      <div className="page-head">
        <div>
          <h1>حجوزات اليوم</h1>
          <div className="sub">
            {isLoading
              ? "..."
              : `${stats.waiting} مريضاً في الانتظار · ${stats.in_exam} في الكشف`}
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-p" onClick={() => setWalkInOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 5.5v13M5.5 12h13" />
            </svg>
            تسجيل حضور
          </button>
        </div>
      </div>

      <QueueStats stats={stats} loading={isLoading} />

      <QueueFilters
        clinics={clinics}
        clinicFilter={clinicFilter}
        onClinicChange={setClinicFilter}
      />

      {isLoading ? (
        <div className="panel queue-table-panel" style={{ padding: 24 }}>
          <SkeletonTable rows={6} cols={5} />
        </div>
      ) : (
        <QueueTable
          entries={filtered}
          onCallPatient={handleCallPatient}
          onFinishExam={handleFinishExam}
          onDefer={handleDefer}
        />
      )}

      <WalkInModal
        open={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        onSubmit={handleWalkInSubmit}
      />
    </div>
  );
}
