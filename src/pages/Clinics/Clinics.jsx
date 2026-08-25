import { useState } from "react";
import ClinicCard from "./components/ClinicCard";
import NewClinicModal from "./components/NewClinicModal";
import { clinicStats } from "./clinics.data";
import { useToast } from "../../components/ui/Toast";
import KpiCard from "../../components/ui/KpiCard";
import { SkeletonCards } from "../../components/ui/Skeleton";
import { useSpecializations, useCreateSpecialization, useDeleteSpecialization } from "../../hooks/queries/useSpecializations";

const S = {
  stroke: "currentColor",
  fill: "none",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ICONS = {
  clinic: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  service: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M12 11v6M9 14h6" />
    </svg>
  ),
  doctor: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <path d="M4 17l6-6 4 4 6-8" />
      <path d="M14 7h6v6" />
    </svg>
  ),
};

const TINTS = {
  clinic: {
    cardBg: "#f0faf7",
    border: "#c8e8e1",
    iconBg: "rgba(15,107,92,0.12)",
    iconColor: "#0F6B5C",
  },
  service: {
    cardBg: "#eff5fd",
    border: "#c5d9f5",
    iconBg: "rgba(44,109,170,0.12)",
    iconColor: "#2C6DAA",
  },
  doctor: {
    cardBg: "#f4f0fe",
    border: "#d9ccfa",
    iconBg: "rgba(124,58,237,0.12)",
    iconColor: "#7C3AED",
  },
  chart: {
    cardBg: "#fdf8ec",
    border: "#f0e0b0",
    iconBg: "rgba(201,162,39,0.12)",
    iconColor: "#C9A227",
  },
};

export default function Clinics() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: specialties = [], isLoading: loading } = useSpecializations()
  const createSpecialization = useCreateSpecialization()
  const deleteSpecialization = useDeleteSpecialization()

  async function handleCreate(form) {
    try {
      await createSpecialization.mutateAsync({
        title: { ar: form.nameAr, en: form.nameEn },
        description: { ar: form.descAr || form.nameAr, en: form.descEn || form.nameEn },
      });
      showToast("تم إضافة التخصص بنجاح");
      setModalOpen(false);
    } catch {
      showToast("تعذر إضافة التخصص", "error");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSpecialization.mutateAsync(id);
      showToast("تم حذف التخصص");
    } catch (err) {
      showToast(err.response?.data?.message || "تعذر الحذف", "error");
    }
  }

  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <div className="page-head">
        <div>
          <h1>العيادات والتخصصات</h1>
          <div className="sub">إدارة التخصصات الطبية وتوزيعها على الفروع</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-p" onClick={() => setModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" {...S}>
              <path d="M12 5.5v13M5.5 12h13" />
            </svg>
            تخصص جديد
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="kpi-grid">
        {clinicStats.map((stat) => (
          <KpiCard
            key={stat.id}
            label={stat.label}
            value={stat.isText ? stat.value : stat.value}
            note={stat.note}
            icon={ICONS[stat.icon]}
            tint={TINTS[stat.icon] || TINTS.clinic}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontFamily: "'Readex Pro'",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ink)",
          }}
        >
          التخصصات الطبية
        </div>
        <span style={{ fontSize: 11.5, color: "var(--ink-45)" }}>
          {specialties.length} تخصص
        </span>
      </div>

      {loading ? (
        <SkeletonCards count={3} />
      ) : (
        <div className="row c3" style={{ marginBottom: 0 }}>
          {specialties.map((s) => (
            <ClinicCard
              key={s.id}
              specialty={s}
              onDelete={handleDelete}
              onUpdate={() => {}}
            />
          ))}
        </div>
      )}

      <NewClinicModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
