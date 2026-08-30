import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Pill, FlaskConical, ScanLine, FileText,
  ChevronLeft, X, CalendarCheck, Upload,
} from "lucide-react";
import {
  usePatients,
  usePatientHistory,
} from "../../../hooks/queries/usePatients";
import {
  useAppointmentStatistics,
  useAppointment,
  useUploadTestResult,
  useUploadPrescriptionImage,
} from "../../../hooks/queries/useAppointments";
import { useToast } from "../../../components/ui/Toast";
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
        <div key={t.id} className="mr-modal-row mr-xray-row">
          <div className="mr-xray-row-top">
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
              className="mr-xray-img-wrap"
            >
              <img
                src={t.url}
                alt={t.test?.name || "أشعة"}
                className="mr-xray-img"
              />
            </a>
          )}
        </div>
      )),
  },
};

/* ── Appointment Media Viewer ── */
function AppointmentMedia({ apptId, inline }) {
  const { data: appt, isLoading } = useAppointment(apptId);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  if (isLoading) return null;

  const rxImage = appt?.prescription_image?.url || null;
  const testImages = (appt?.test_requests || []).filter(
    t => t.url || t.image_url || t.result?.url || t.result?.image_url
  ).map(t => ({
    ...t,
    resolvedUrl: t.url || t.image_url || t.result?.url || t.result?.image_url,
  }));

  // build flat images array for slider
  const allImages = [
    ...(rxImage ? [{ url: rxImage, label: "الروشتة" }] : []),
    ...testImages.map(t => ({
      url: t.resolvedUrl,
      label: t.test?.name || (t.type === "xray" ? "أشعة" : "تحليل"),
    })),
  ];

  if (allImages.length === 0) return null;

  const total = allImages.length;

  const thumbs = (
    <>
      {allImages.map((img, i) => (
        <button
          key={i}
          className="mr-action-btn mr-thumb-btn"
          onClick={() => setLightboxIdx(i)}
          title={img.label}
        >
          <img src={img.url} alt={img.label} className="mr-thumb-img" />
          <span>{img.label}</span>
        </button>
      ))}
    </>
  );

  return (
    <>
      {inline ? thumbs : null}

      {lightboxIdx !== null && createPortal(
        <div className="mr-lightbox" onClick={() => setLightboxIdx(null)}>
          <button className="mr-lightbox-close" onClick={() => setLightboxIdx(null)}>
            <X size={20} />
          </button>

          {total > 1 && (
            <button
              className="mr-lightbox-nav mr-lightbox-prev"
              onClick={e => { e.stopPropagation(); setLightboxIdx((lightboxIdx + total - 1) % total); }}
            >‹</button>
          )}

          <img
            src={allImages[lightboxIdx].url}
            alt={allImages[lightboxIdx].label}
            className="mr-lightbox-img"
            onClick={e => e.stopPropagation()}
          />

          {total > 1 && (
            <button
              className="mr-lightbox-nav mr-lightbox-next"
              onClick={e => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % total); }}
            >›</button>
          )}

          <div className="mr-lightbox-caption" onClick={e => e.stopPropagation()}>
            <span>{allImages[lightboxIdx].label}</span>
            {total > 1 && <span>{lightboxIdx + 1} / {total}</span>}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
function UploadReportModal({ apptId, onClose }) {
  const { data: appt, isLoading } = useAppointment(apptId);
  const { showToast } = useToast();
  const [selected, setSelected]   = useState(null);
  const [resultRate, setResultRate] = useState("normal");
  const [note, setNote]             = useState("");
  const [file, setFile]             = useState(null);
  const fileRef = useRef();
  const upload  = useUploadTestResult();

  const testRequests = appt?.test_requests || [];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected) return;
    try {
      const fd = new FormData();
      fd.append("result_rate", resultRate);
      fd.append("note", note);
      if (file) fd.append("image", file);
      await upload.mutateAsync({ appointmentId: apptId, testRequestId: selected.id, formData: fd });
      showToast("تم رفع النتيجة بنجاح");
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message
        || Object.values(err?.response?.data?.errors || {})?.[0]?.[0]
        || "تعذر رفع النتيجة";
      const arabicMsg = msg.includes("already been submitted") 
        ? "تم رفع نتيجة لهذا الطلب مسبقاً"
        : msg;
      showToast(arabicMsg, "error");
      console.error("422 details:", err?.response?.data);
    }
  }

  return (
    <div className="mr-modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mr-modal">
        <div className="mr-modal-head">
          <div className="mr-modal-head-inner">
            <div className="mr-modal-icon" style={{ background: "#2C6DAA15", color: "#2C6DAA" }}>
              <FlaskConical size={16} />
            </div>
            <div>
              <div className="mr-modal-title">رفع نتيجة تحليل / أشعة</div>
              <div className="mr-modal-sub">موعد #{apptId}</div>
            </div>
          </div>
          <button className="mr-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="mr-modal-body mr-form">
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "20px", color: "var(--ink-45)", fontSize: 13 }}>
              جارٍ التحميل...
            </div>
          ) : testRequests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 16px" }}>
              <FlaskConical size={32} color="var(--ink-25)" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                لا توجد تحاليل أو أشعة مطلوبة
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-45)", lineHeight: 1.6 }}>
                لم يطلب الطبيب أي تحاليل أو أشعة لهذا الموعد بعد.
                <br />يجب أن يضيف الطبيب الطلب أولاً من تطبيقه.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Select test request */}
              <div>
                <label className="mr-form-label">اختر التحليل / الأشعة</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {testRequests.map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => !tr.has_result && setSelected(tr)}
                      style={{
                        textAlign: "right",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: `1.5px solid ${selected?.id === tr.id ? "var(--brand)" : tr.has_result ? "var(--line)" : "var(--line)"}`,
                        background: selected?.id === tr.id ? "rgba(15,107,92,.06)" : tr.has_result ? "var(--paper)" : "var(--paper)",
                        cursor: tr.has_result ? "not-allowed" : "pointer",
                        opacity: tr.has_result ? 0.6 : 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {tr.type === "xray" ? <ScanLine size={14} color="#DB2777" /> : <FlaskConical size={14} color="#2C6DAA" />}
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                        {tr.test?.name || `#${tr.id}`}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--ink-45)", marginRight: "auto" }}>
                        {tr.type === "xray" ? "أشعة" : "تحليل"}
                      </span>
                      {tr.has_result && (
                        <span className="mr-modal-badge green">مكتمل</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {selected && (
                <>
                  <div>
                    <label className="mr-form-label">النتيجة</label>
                    <select className="inp" value={resultRate} onChange={(e) => setResultRate(e.target.value)}>
                      <option value="normal">طبيعي</option>
                      <option value="not_normal">غير طبيعي</option>
                      <option value="caution">تحذير</option>
                    </select>
                  </div>
                  <div>
                    <label className="mr-form-label">ملاحظات</label>
                    <textarea className="inp" rows={3} value={note} onChange={(e) => setNote(e.target.value)} style={{ resize: "none" }} />
                  </div>
                  <div>
                    <label className="mr-form-label">صورة النتيجة (اختياري)</label>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                    <button type="button" className="btn btn-q mr-file-btn" onClick={() => fileRef.current.click()}>
                      <Upload size={14} /> {file ? file.name : "اختر صورة"}
                    </button>
                  </div>
                  <button type="submit" className="btn btn-p mr-modal-submit" disabled={upload.isPending}>
                    {upload.isPending ? "جارٍ الرفع..." : "رفع النتيجة"}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Upload Test Result Modal ── */
function UploadTestResultModal({ appt, testRequest, onClose }) {  const [resultRate, setResultRate] = useState("normal");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const fileRef = useRef();
  const upload = useUploadTestResult();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("result_rate", resultRate);
      fd.append("note", note);
      if (file) fd.append("image", file);
      await upload.mutateAsync({
        appointmentId: appt.id,
        testRequestId: testRequest.id,
        formData: fd,
      });
      onClose();
    } catch (err) {
      console.error("upload error", err?.response?.data || err);
    }
  }

  const typeLabel = testRequest.type === "xray" ? "الأشعة" : "التحليل";

  return (
    <div
      className="mr-modal-bg"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mr-modal">
        <div className="mr-modal-head">
          <div className="mr-modal-head-inner">
            <div
              className="mr-modal-icon"
              style={{ background: "#2C6DAA15", color: "#2C6DAA" }}
            >
              {testRequest.type === "xray" ? (
                <ScanLine size={16} />
              ) : (
                <FlaskConical size={16} />
              )}
            </div>
            <div>
              <div className="mr-modal-title">رفع نتيجة {typeLabel}</div>
              <div className="mr-modal-sub">
                {testRequest.test?.name || "—"}
              </div>
            </div>
          </div>
          <button className="mr-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <form className="mr-modal-body mr-form" onSubmit={handleSubmit}>
          <div>
            <label className="mr-form-label">النتيجة</label>
            <select
              className="inp"
              value={resultRate}
              onChange={(e) => setResultRate(e.target.value)}
            >
              <option value="normal">طبيعي</option>
              <option value="not_normal">غير طبيعي</option>
              <option value="caution">تحذير</option>
            </select>
          </div>
          <div>
            <label className="mr-form-label">ملاحظات</label>
            <textarea
              className="inp"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ resize: "none" }}
            />
          </div>
          <div>
            <label className="mr-form-label">الصورة</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              type="button"
              className="btn btn-q mr-file-btn"
              onClick={() => fileRef.current.click()}
            >
              <Upload size={14} /> {file ? file.name : "اختر صورة"}
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-p mr-modal-submit"
            disabled={upload.isPending}
          >
            {upload.isPending ? "جارٍ الرفع..." : "رفع النتيجة"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Upload Prescription Image Modal ── */
function UploadPrescriptionModal({ appt, onClose }) {
  const [file, setFile] = useState(null);
  const fileRef = useRef();
  const upload = useUploadPrescriptionImage();
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("prescription_image", file);
      await upload.mutateAsync({ appointmentId: appt.id, formData: fd });
      showToast("تم رفع الروشتة بنجاح");
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || "تعذر رفع الروشتة";
      showToast(msg, "error");
    }
  }

  return (
    <div
      className="mr-modal-bg"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mr-modal">
        <div className="mr-modal-head">
          <div className="mr-modal-head-inner">
            <div
              className="mr-modal-icon"
              style={{ background: "#0F6B5C15", color: "#0F6B5C" }}
            >
              <Pill size={16} />
            </div>
            <div>
              <div className="mr-modal-title">رفع صورة الروشتة</div>
              <div className="mr-modal-sub">موعد #{appt.id}</div>
            </div>
          </div>
          <button className="mr-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <form className="mr-modal-body mr-form" onSubmit={handleSubmit}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="button"
            className="btn btn-q mr-file-btn"
            onClick={() => fileRef.current.click()}
          >
            <Upload size={14} /> {file ? file.name : "اختر صورة الروشتة"}
          </button>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="mr-preview-img"
            />
          )}
          <button
            type="submit"
            className="btn btn-p"
            disabled={!file || upload.isPending}
          >
            {upload.isPending ? "جارٍ الرفع..." : "رفع الروشتة"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Data Modal ── */
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
          <div className="mr-modal-head-inner">
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
  const [modal, setModal] = useState(null);
  const [uploadTest, setUploadTest] = useState(null);
  const [uploadRx, setUploadRx] = useState(null);
  const [uploadReport, setUploadReport] = useState(null);

  const appointments = history?.appointments || [];

  function getModalItems(appt, type) {
    if (type === "prescriptions") return appt.prescriptions || [];
    return (appt.test_requests || []).filter((t) => t.type === type);
  }

  return (
    <div>
      <div className="mr-history-header">
        <button className="btn btn-g mr-back-btn" onClick={onBack}>
          <ChevronLeft size={14} /> رجوع
        </button>
        <div className="mr-patient-header">
          <div className="mr-patient-avatar-lg">
            {(patient.name || "؟").charAt(0)}
          </div>
          <div>
            <div className="mr-patient-name-lg">{patient.name || "—"}</div>
            <div className="mr-patient-phone">{patient.phone}</div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="panel mr-panel-msg">جارٍ تحميل السجل الطبي...</div>
      ) : appointments.length === 0 ? (
        <div className="panel mr-panel-msg">لا توجد سجلات طبية لهذا المريض</div>
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

                  {/* Inline media thumbnails */}
                  <AppointmentMedia apptId={appt.id} inline />
                </div>

                <div className="mr-upload-row">
                  <button
                    className="btn mr-upload-btn"
                    style={{ background: 'rgba(15,107,92,.08)', color: '#0F6B5C', border: '1px solid rgba(15,107,92,.2)' }}
                    onClick={() => setUploadRx(appt)}
                  >
                    <Pill size={12} /> رفع الروشتة
                  </button>
                  <button
                    className="btn mr-upload-btn"
                    style={{ background: 'rgba(44,109,170,.08)', color: '#2C6DAA', border: '1px solid rgba(44,109,170,.2)' }}
                    onClick={() => setUploadReport(appt.id)}
                  >
                    <FlaskConical size={12} /> رفع نتيجة تحليل / أشعة
                  </button>
                </div>

                <AppointmentMedia apptId={appt.id} />
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
      {uploadReport && (
        <UploadReportModal
          apptId={uploadReport}
          onClose={() => setUploadReport(null)}
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
    {
      label: "مواعيد اليوم",
      value: stats?.appointments?.total ?? "—",
      icon: <CalendarCheck size={16} />,
      color: "#0F6B5C",
    },
    {
      label: "وصفات طبية",
      value: stats?.appointments?.by_status?.completed ?? "—",
      icon: <Pill size={16} />,
      color: "#7C3AED",
    },
    {
      label: "تحاليل مطلوبة",
      value: stats?.test_requests?.by_type?.analysis ?? "—",
      icon: <FlaskConical size={16} />,
      color: "#2C6DAA",
    },
    {
      label: "تقارير طبية",
      value: stats?.test_requests?.by_type?.xray ?? "—",
      icon: <ScanLine size={16} />,
      color: "#DB2777",
    },
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
      {/* Stats */}
      <div className="mr-stats-grid">
        {statCards.map((c) => (
          <div key={c.label} className="panel mr-stat-card">
            <div className="mr-stat-label">{c.label}</div>
            <div className="mr-stat-value" style={{ color: c.color }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mr-topbar">
        <div className="mr-search-wrap">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            stroke="var(--ink-45)"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="mr-search-icon"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="inp mr-search-inp"
            placeholder="ابحث باسم المريض أو الجوال..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Patients list */}
      <div className="mr-list">
        {isLoading ? (
          <div className="panel mr-panel-msg">جارٍ تحميل المرضى...</div>
        ) : filtered.length === 0 ? (
          <div className="panel mr-panel-msg">لا يوجد مرضى</div>
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
