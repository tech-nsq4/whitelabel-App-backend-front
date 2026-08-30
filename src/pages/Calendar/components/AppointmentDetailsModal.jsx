import { useAppointment } from "../../../hooks/queries/useAppointments";
import Modal from "../../../components/ui/Modal";
import { SkeletonBox } from "../../../components/ui/Skeleton";
import "../styles/appointment-details-modal.css";

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

const TEST_TYPE = { analysis: "تحليل", xray: "أشعة" };

function InfoRow({ label, value }) {
  return (
    <div className="adm-info-row">
      <span className="adm-info-label">{label}</span>
      <span className="adm-info-value">{value || "—"}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div className="adm-section-title">{children}</div>;
}

export default function AppointmentDetailsModal({ appointmentId, onClose }) {
  const { data: appt, isLoading } = useAppointment(appointmentId);
  const open = !!appointmentId;
  if (!open) return null;

  const patientName = appt?.family_member?.name || appt?.user?.name || "—";
  const doctorName = appt?.doctor?.name?.ar || "—";
  const clinicName = appt?.doctor?.clinic?.name?.ar || "—";
  const specialty = appt?.doctor?.specializations?.[0]?.title?.ar || "—";
  const status = STATUSES[appt?.status] || STATUSES.pending;
  const prescriptions = appt?.prescriptions || [];
  const testRequests = appt?.test_requests || [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="تفاصيل الحجز"
      subtitle={`موعد #${appointmentId}`}
    >
      {isLoading ? (
        <div className="adm-skeleton">
          <SkeletonBox height={60} style={{ borderRadius: 14 }} />
          <SkeletonBox height={14} width="80%" />
          <SkeletonBox height={14} width="60%" />
          <SkeletonBox height={14} width="70%" />
        </div>
      ) : appt ? (
        <>
          {/* Patient hero */}
          <div className="adm-patient-hero">
            <div className="adm-patient-avatar">{patientName.charAt(0)}</div>
            <div className="adm-patient-info">
              <div className="adm-patient-name">{patientName}</div>
              <div className="adm-patient-contact">
                {appt.user?.phone || appt.user?.email || "—"}
              </div>
            </div>
            <span
              className="adm-status-badge"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>

          {/* Appointment info */}
          <SectionTitle>معلومات الموعد</SectionTitle>
          <div className="adm-info-group">
            <InfoRow label="الطبيب" value={doctorName} />
            <InfoRow label="العيادة" value={clinicName} />
            <InfoRow label="التخصص" value={specialty} />
            <InfoRow label="التاريخ" value={appt.date} />
            <InfoRow label="الوقت" value={appt.times} />
            <InfoRow
              label="نوع الزيارة"
              value={
                appt.time_table?.type === "clinic"
                  ? "عيادة"
                  : appt.time_table?.type || "—"
              }
            />
          </div>

          {/* Complaint & Diagnosis */}
          {(appt.complaint || appt.diagnosis) && (
            <>
              <SectionTitle>الشكوى والتشخيص</SectionTitle>
              <div className="adm-info-group">
                {appt.complaint && (
                  <InfoRow label="الشكوى" value={appt.complaint} />
                )}
                {appt.diagnosis && (
                  <InfoRow label="التشخيص" value={appt.diagnosis} />
                )}
              </div>
            </>
          )}

          {/* Prescriptions */}
          {prescriptions.length > 0 && (
            <>
              <SectionTitle>الأدوية</SectionTitle>
              <div className="adm-list">
                {prescriptions.map((p) => (
                  <div key={p.id} className="adm-list-item">
                    <div>
                      <div className="adm-list-item-name">{p.drug_name}</div>
                      <div className="adm-list-item-sub">{p.dosage}</div>
                    </div>
                    <span
                      className="adm-list-item-badge"
                      style={{
                        background: "rgba(15,107,92,.1)",
                        color: "#0F6B5C",
                      }}
                    >
                      {p.duration}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Test requests */}
          {testRequests.length > 0 && (
            <>
              <SectionTitle>التحاليل والأشعة</SectionTitle>
              <div className="adm-list">
                {testRequests.map((t) => (
                  <div key={t.id} className="adm-list-item">
                    <div>
                      <div className="adm-list-item-name">
                        {t.test?.name || "—"}
                      </div>
                      <div className="adm-list-item-sub">
                        {TEST_TYPE[t.type] || t.type}
                      </div>
                    </div>
                    <span
                      className="adm-list-item-badge"
                      style={{
                        background: t.has_result
                          ? "rgba(15,107,92,.1)"
                          : "rgba(201,162,39,.1)",
                        color: t.has_result ? "#0F6B5C" : "#C9A227",
                      }}
                    >
                      {t.has_result ? "مكتمل" : "منتظر"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Rating */}
          {appt.rate && (
            <>
              <SectionTitle>التقييم</SectionTitle>
              <div className="adm-rating">
                <span className="adm-rating-stars">
                  {"★".repeat(appt.rate)}
                  {"☆".repeat(5 - appt.rate)}
                </span>
                {appt.comment && (
                  <span className="adm-rating-comment">{appt.comment}</span>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="adm-empty">لا توجد بيانات</div>
      )}

      <div className="adm-footer">
        <button className="btn btn-q" onClick={onClose}>
          إغلاق
        </button>
      </div>
    </Modal>
  );
}
