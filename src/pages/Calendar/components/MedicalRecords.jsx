import { useState, useRef } from "react";
import {
  Pill,
  FlaskConical,
  ScanLine,
  FileText,
  ChevronLeft,
  X,
  CalendarCheck,
  Upload,
} from "lucide-react";
import {
  usePatients,
  usePatientHistory,
} from "../../../hooks/queries/usePatients";
import { useAppointmentStatistics, useUploadTestResult, useUploadPrescriptionImage } from "../../../hooks/queries/useAppointments";
import "../styles/medical-records.css";

const AVATAR_COLORS = [
  "#0F6B5C",
  "#2C6DAA",
  "#7C3AED",
  "#D97706",
  "#DB2777",
  "#B3402F",
  "#059669",
];

const STATUS = {
  pending: { label: "انتظار", bg: "rgba(201,162,39,.1)", color: "#C9A227" },
  confirmed: { label: "مؤكد", bg: "rgba(15,107,92,.08)", color: "#0F6B5C" },
  in_progress: {
    label: "في الكشف",
    bg: "rgba(44,109,170,.1)",
    color: "#2C6DAA",
  },
  completed: { label: "مكمل", bg: "rgba(124,58,237,.1)", color: "#7C3AED" },
  cancelled: { label: "ملغي", bg: "rgba(179,64,47,.1)", color: "#B3402F" },
};

const ACTION_BTNS = [
  {
    key: "prescriptions",
    label: "الأدوية",
    icon: <Pill size={14} strokeWidth={1.7} />,
    color: "#0F6B5C",
  },
  {
    key: "analysis",
    label: "التحاليل",
    icon: <FlaskConical size={14} strokeWidth={1.7} />,
    color: "#2C6DAA",
  },
  {
    key: "xray",
    label: "الأشعة",
    icon: <ScanLine size={14} strokeWidth={1.7} />,
    color: "#DB2777",
  },
];

const MODAL_CONFIG = {
  prescriptions: {
    title: "الأدوية",
    icon: <Pill size={16} />,
    color: "#0F6B5C",
    render: (items) =>
      items.map((d) => (
        <div key={d.id} className="mr-modal-row">
          <div className="mr-modal-row-main">
            <div className="mr-modal-item-name">{d.drug_name}</div>
            <div className="mr-modal-item-sub">{d.dosage}</div>
          </div>
          <span className="mr-modal-badge green">{d.duration}</span>
        </div>
      )),
  },
  analysis: {
    title: "التحاليل",
    icon: <FlaskConical size={16} />,
    color: "#2C6DAA",
    render: (items) =>
      items.map((t) => (
        <div key={t.id} className="mr-modal-row">
          <div className="mr-modal-item-name">{t.test?.name || "—"}</div>
          <span className={`mr-modal-badge ${t.has_result ? "green" : "blue"}`}>
            {t.has_result ? "مكتمل" : "منتظر"}
          </span>
        </div>
      )),
  },
  xray: {
    title: "الأشعة",
    icon: <ScanLine size={16} />,
    color: "#DB2777",
    render: (items) =>
      items.map((t) => (
        <div
          key={t.id}
          className="mr-modal-row"
          style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div className="mr-modal-item-name">{t.test?.name || "—"}</div>
            <span
              className={`mr-modal-badge ${t.has_result ? "green" : "pink"}`}
            >
              {t.has_result ? "مكتمل" : "منتظر"}
            </span>
          </div>
          {t.url && (
            <a
              href={t.url}
              target="_blank"
              rel="noreferrer"
              style={{ width: "100%" }}
            >
              <img
                src={t.url}
                alt={t.test?.name || "أشعة"}
                style={{
                  width: "100%",
                  borderRadius: 8,
                  maxHeight: 220,
                  objectFit: "cover",
                  border: "1px solid var(--line)",
                }}
              />
            </a>
          )}
        </div>
      )),
  },
};

/* ── Upload Test Result Modal ── */
function UploadTestResultModal({ appt, testRequest, onClose }) {
  const [resultRate, setResultRate] = useState('normal')
  const [note, setNote]             = useState('')
  const [file, setFile]             = useState(null)
  const fileRef                     = useRef()
  const upload                      = useUploadTestResult()

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('result_rate', resultRate)
    fd.append('note', note)
    if (file) fd.append('image', file)
    await upload.mutateAsync({ appointmentId: appt.id, testRequestId: testRequest.id, formData: fd })
    onClose()
  }

  const typeLabel = testRequest.type === 'xray' ? 'الأشعة' : 'التحليل'

  return (
    <div className="mr-modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mr-modal">
        <div className="mr-modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="mr-modal-icon" style={{ background: '#2C6DAA15', color: '#2C6DAA' }}>
              {testRequest.type === 'xray' ? <ScanLine size={16} /> : <FlaskConical size={16} />}
            </div>
            <div>
              <div className="mr-modal-title">رفع نتيجة {typeLabel}</div>
              <div className="mr-modal-sub">{testRequest.test?.name || '—'}</div>
            </div>
          </div>
          <button className="mr-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <form className="mr-modal-body" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--ink-45)', display: 'block', marginBottom: 6 }}>النتيجة</label>
            <select className="inp" value={resultRate} onChange={e => setResultRate(e.target.value)}>
              <option value="normal">طبيعي</option>
              <option value="not_normal">غير طبيعي</option>
              <option value="caution">تحذير</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--ink-45)', display: 'block', marginBottom: 6 }}>ملاحظات</label>
            <textarea className="inp" rows={3} value={note} onChange={e => setNote(e.target.value)} style={{ resize: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--ink-45)', display: 'block', marginBottom: 6 }}>الصورة</label>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
            <button type="button" className="btn btn-q" style={{ width: '100%', justifyContent: 'center', gap: 6 }} onClick={() => fileRef.current.click()}>
              <Upload size={14} /> {file ? file.name : 'اختر صورة'}
            </button>
          </div>
          <button type="submit" className="btn btn-p" disabled={upload.isPending} style={{ marginTop: 4 }}>
            {upload.isPending ? 'جارٍ الرفع...' : 'رفع النتيجة'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Upload Prescription Image Modal ── */
function UploadPrescriptionModal({ appt, onClose }) {
  const [file, setFile] = useState(null)
  const fileRef         = useRef()
  const upload          = useUploadPrescriptionImage()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return
    const fd = new FormData()
    fd.append('prescription_image', file)
    await upload.mutateAsync({ appointmentId: appt.id, formData: fd })
    onClose()
  }

  return (
    <div className="mr-modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mr-modal">
        <div className="mr-modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="mr-modal-icon" style={{ background: '#0F6B5C15', color: '#0F6B5C' }}>
              <Pill size={16} />
            </div>
            <div>
              <div className="mr-modal-title">رفع صورة الروشتة</div>
              <div className="mr-modal-sub">موعد #{appt.id}</div>
            </div>
          </div>
          <button className="mr-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <form className="mr-modal-body" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
          <button type="button" className="btn btn-q" style={{ width: '100%', justifyContent: 'center', gap: 6 }} onClick={() => fileRef.current.click()}>
            <Upload size={14} /> {file ? file.name : 'اختر صورة الروشتة'}
          </button>
          {file && (
            <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover', border: '1px solid var(--line)' }} />
          )}
          <button type="submit" className="btn btn-p" disabled={!file || upload.isPending}>
            {upload.isPending ? 'جارٍ الرفع...' : 'رفع الروشتة'}
          </button>
        </form>
      </div>
    </div>
  )
}


function DataModal({ patientName, items, type, onClose }) {
  if (!type) return null;
  const cfg = MODAL_CONFIG[type];
  return (
    <div
      className="mr-modal-bg"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mr-modal">
        <div
          className="mr-modal-head"
          style={{ borderBottom: `2px solid ${cfg.color}20` }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              className="mr-modal-icon"
              style={{ background: `${cfg.color}15`, color: cfg.color }}
            >
              {cfg.icon}
            </div>
            <div>
              <div className="mr-modal-title">{cfg.title}</div>
              <div className="mr-modal-sub">{patientName}</div>
            </div>
          </div>
          <button className="mr-modal-close" onClick={onClose}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>
        <div className="mr-modal-body">
          {items.length === 0 ? (
            <div className="mr-modal-empty">لا توجد بيانات</div>
          ) : (
            cfg.render(items)
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Patient history view ── */
function PatientHistory({ patient, onBack }) {
  const { data: history, isLoading } = usePatientHistory(patient.id);
  const [modal, setModal]           = useState(null) // { appt, type }
  const [uploadTest, setUploadTest] = useState(null) // { appt, testRequest }
  const [uploadRx, setUploadRx]     = useState(null) // appt

  const appointments = history?.appointments || [];
  const prescriptions = history?.prescriptions || [];
  const testRequests = history?.test_requests || [];

  function getModalItems(appt, type) {
    if (type === "prescriptions") return appt.prescriptions || [];
    return (appt.test_requests || []).filter((t) => t.type === type);
  }

  return (
    <div>
      {/* Back + patient header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <button
          className="btn btn-g"
          style={{
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          onClick={onBack}
        >
          <ChevronLeft size={14} />
          رجوع
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: "#0F6B5C",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            {(patient.name || "؟").charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {patient.name || "—"}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-45)" }}>
              {patient.phone}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div
          className="panel"
          style={{
            padding: 32,
            textAlign: "center",
            color: "var(--ink-45)",
            fontSize: 13,
          }}
        >
          جارٍ تحميل السجل الطبي...
        </div>
      ) : appointments.length === 0 ? (
        <div
          className="panel"
          style={{
            padding: 32,
            textAlign: "center",
            color: "var(--ink-45)",
            fontSize: 13,
          }}
        >
          لا توجد سجلات طبية لهذا المريض
        </div>
      ) : (
        <div className="mr-list">
          {appointments.map((appt, idx) => {
            const st = STATUS[appt.status] || STATUS.pending;
            const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const doctorName = appt.doctor?.name?.ar || "—";
            const specialty =
              appt.doctor?.specializations?.[0]?.title?.ar || "—";
            const rxCount = (appt.prescriptions || []).length;
            const analysisCount = (appt.test_requests || []).filter(
              (t) => t.type === "analysis",
            ).length;
            const xrayCount = (appt.test_requests || []).filter(
              (t) => t.type === "xray",
            ).length;

            return (
              <div
                key={appt.id}
                className="mr-card"
                style={{ borderRight: `3px solid ${st.color}` }}
              >
                <div className="mr-card-head">
                  <div className="mr-avatar" style={{ background: color }}>
                    {(patient.name || "؟").charAt(0)}
                  </div>
                  <div className="mr-card-info">
                    <div className="mr-card-top">
                      <span className="mr-patient-name">
                        {patient.name || "—"}
                      </span>
                      <span className="mr-no">#{appt.id}</span>
                      <span
                        className="mr-status-chip"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>
                    <div className="mr-card-meta">
                      {doctorName}
                      <span className="mr-sep">·</span>
                      {specialty}
                      <span className="mr-sep">|</span>
                      {appt.date} — {appt.times}
                    </div>
                  </div>
                </div>

                {(appt.complaint || appt.diagnosis) && (
                  <div className="mr-note">
                    <FileText size={12} strokeWidth={1.8} />
                    {appt.complaint && <span>الشكوى: {appt.complaint}</span>}
                    {appt.complaint && appt.diagnosis && " — "}
                    {appt.diagnosis && <span>التشخيص: {appt.diagnosis}</span>}
                  </div>
                )}

                <div className="mr-card-actions">
                  {[
                    {
                      key: "prescriptions",
                      label: "الأدوية",
                      icon: <Pill size={14} strokeWidth={1.7} />,
                      color: "#0F6B5C",
                      count: rxCount,
                    },
                    {
                      key: "analysis",
                      label: "التحاليل",
                      icon: <FlaskConical size={14} strokeWidth={1.7} />,
                      color: "#2C6DAA",
                      count: analysisCount,
                    },
                    {
                      key: "xray",
                      label: "الأشعة",
                      icon: <ScanLine size={14} strokeWidth={1.7} />,
                      color: "#DB2777",
                      count: xrayCount,
                    },
                  ].map((btn) => (
                    <button
                      key={btn.key}
                      className={`mr-action-btn${btn.count === 0 ? " empty" : ""}`}
                      onClick={() =>
                        btn.count > 0 && setModal({ appt, type: btn.key })
                      }
                      style={btn.count > 0 ? { "--btn-color": btn.color } : {}}
                    >
                      {btn.icon}
                      {btn.label}
                      {btn.count > 0 && (
                        <span
                          className="mr-action-count"
                          style={{ background: btn.color }}
                        >
                          {btn.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Upload buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
                  <button className="btn btn-q" style={{ fontSize: 11.5, gap: 5, justifyContent: 'center' }} onClick={() => setUploadRx(appt)}>
                    <Upload size={12} /> رفع الروشتة
                  </button>
                  {(appt.test_requests || []).map(tr => (
                    <button key={tr.id} className="btn btn-q" style={{ fontSize: 11.5, gap: 5, justifyContent: 'center' }} onClick={() => setUploadTest({ appt, testRequest: tr })}>
                      <Upload size={12} /> {tr.type === 'xray' ? 'أشعة' : 'تحليل'}: {tr.test?.name || `#${tr.id}`}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <DataModal
          patientName={patient.name || patient.phone}
          items={getModalItems(modal.appt, modal.type)}
          type={modal.type}
          onClose={() => setModal(null)}
        />
      )}
      {uploadTest && (
        <UploadTestResultModal
          appt={uploadTest.appt}
          testRequest={uploadTest.testRequest}
          onClose={() => setUploadTest(null)}
        />
      )}
      {uploadRx && (
        <UploadPrescriptionModal
          appt={uploadRx}
          onClose={() => setUploadRx(null)}
        />
      )}
    </div>
  );
}

/* ── Main component ── */
export default function MedicalRecords() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { data: patients = [], isLoading } = usePatients();
  const { data: stats } = useAppointmentStatistics();

  const statCards = [
    { label: "مواعيد اليوم",     value: stats?.appointments?.total         ?? "—", icon: <CalendarCheck size={16} />, color: "#0F6B5C" },
    { label: "وصفات طبية",       value: stats?.appointments?.by_status?.completed ?? "—", icon: <Pill size={16} />,          color: "#7C3AED" },
    { label: "تحاليل مطلوبة",    value: stats?.test_requests?.by_type?.analysis   ?? "—", icon: <FlaskConical size={16} />,  color: "#2C6DAA" },
    { label: "تقارير طبية",      value: stats?.test_requests?.by_type?.xray        ?? "—", icon: <ScanLine size={16} />,     color: "#DB2777" },
  ];

  const filtered = patients.filter((p) => {
    const q = search.trim();
    if (!q) return true;
    return (p.name || "").includes(q) || (p.phone || "").includes(q);
  });

  if (selectedPatient) {
    return (
      <PatientHistory
        patient={selectedPatient}
        onBack={() => setSelectedPatient(null)}
      />
    );
  }

  return (
    <div>
      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {statCards.map(c => (
          <div key={c.label} className="panel" style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 11, color: "var(--ink-45)", textAlign: "center" }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: c.color, textAlign: "center", fontFamily: "Careem, sans-serif", lineHeight: 1 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mr-topbar">
        <div style={{ position: "relative", flex: "0 0 280px" }}>
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
              right: 10,
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
              paddingRight: 32,
              minHeight: 36,
              fontSize: 12.5,
              borderRadius: 10,
            }}
            placeholder="ابحث باسم المريض أو الجوال..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Patients list */}
      <div className="mr-list">
        {isLoading ? (
          <div
            className="panel"
            style={{
              padding: 32,
              textAlign: "center",
              color: "var(--ink-45)",
              fontSize: 13,
            }}
          >
            جارٍ تحميل المرضى...
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="panel"
            style={{
              padding: 32,
              textAlign: "center",
              color: "var(--ink-45)",
              fontSize: 13,
            }}
          >
            لا يوجد مرضى
          </div>
        ) : (
          filtered.map((p, idx) => (
            <div
              key={p.id}
              className="mr-card"
              style={{
                borderRight: `3px solid ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`,
                cursor: "pointer",
              }}
              onClick={() => setSelectedPatient(p)}
            >
              <div className="mr-card-head">
                <div
                  className="mr-avatar"
                  style={{
                    background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                  }}
                >
                  {(p.name || "؟").charAt(0)}
                </div>
                <div className="mr-card-info">
                  <div className="mr-card-top">
                    <span className="mr-patient-name">{p.name || "—"}</span>
                    <span className="mr-no">#{p.id}</span>
                    {p.phone_verified_at ? (
                      <span
                        className="mr-status-chip"
                        style={{
                          background: "rgba(15,107,92,.1)",
                          color: "#0F6B5C",
                        }}
                      >
                        موثق
                      </span>
                    ) : (
                      <span
                        className="mr-status-chip"
                        style={{
                          background: "rgba(150,150,150,.1)",
                          color: "#888",
                        }}
                      >
                        غير موثق
                      </span>
                    )}
                  </div>
                  <div className="mr-card-meta">
                    {p.phone}
                    {p.email && (
                      <>
                        <span className="mr-sep">·</span>
                        {p.email}
                      </>
                    )}
                    <span className="mr-sep">|</span>
                    {p.appointments_count ?? 0} موعد
                  </div>
                </div>
                <button
                  className="btn btn-p mr-detail-btn"
                  style={{ marginRight: "auto" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPatient(p);
                  }}
                >
                  السجل الطبي <ChevronLeft size={13} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
