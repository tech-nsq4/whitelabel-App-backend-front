import { useDoctors } from "../../../hooks/queries/useDoctors";
import KpiCard from "../../../components/ui/KpiCard";

const S = {
  stroke: "currentColor",
  fill: "none",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ICONS = {
  doctor: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <path d="M12 3l8 3v6c0 4.5-3 8-8 9-5-1-8-4.5-8-9V6l8-3z" />
    </svg>
  ),
};

const TINTS = {
  total: {
    cardBg: "#f0faf7",
    border: "#c8e8e1",
    iconBg: "rgba(15,107,92,0.12)",
    iconColor: "#0F6B5C",
  },
  onduty: {
    cardBg: "#eff5fd",
    border: "#c5d9f5",
    iconBg: "rgba(44,109,170,0.12)",
    iconColor: "#2C6DAA",
  },
  rating: {
    cardBg: "#fdf8ec",
    border: "#f0e0b0",
    iconBg: "rgba(201,162,39,0.12)",
    iconColor: "#C9A227",
  },
  license: {
    cardBg: "#fdf2f0",
    border: "#f5cdc8",
    iconBg: "rgba(179,64,47,0.12)",
    iconColor: "#B3402F",
  },
};

export default function DoctorStats({ totalDoctors = 0 }) {
  const { data: doctors = [] } = useDoctors();

  const avgRating = doctors.length
    ? (
        doctors.reduce((sum, d) => sum + (parseFloat(d.avg_rate) || 0), 0) /
        doctors.length
      ).toFixed(1)
    : "—";

  const stats = [
    {
      id: "total",
      label: "إجمالي الأطباء",
      value: String(doctors.length),
      note: "في النظام",
      icon: "doctor",
    },
    {
      id: "onduty",
      label: "عيادات مرتبطة",
      value: String(
        new Set(doctors.flatMap((d) => d.clinics?.map((c) => c.id) || [])).size,
      ),
      note: "عيادة نشطة",
      icon: "clock",
    },
    {
      id: "rating",
      label: "متوسط التقييم",
      value: avgRating,
      note: "من 5 نجوم",
      icon: "star",
    },
    {
      id: "license",
      label: "تخصصات مختلفة",
      value: String(
        new Set(
          doctors.flatMap((d) => d.specializations?.map((s) => s.id) || []),
        ).size,
      ),
      note: "تخصص طبي",
      icon: "shield",
    },
  ];

  return (
    <div className="kpi-grid">
      {stats.map((stat) => (
        <KpiCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          note={stat.note}
          icon={ICONS[stat.icon]}
          tint={TINTS[stat.id] || TINTS.total}
        />
      ))}
    </div>
  );
}
