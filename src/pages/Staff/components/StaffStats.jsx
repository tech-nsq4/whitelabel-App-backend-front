import { useAdmins } from "../../../hooks/queries/useAdmins";
import KpiCard from "../../../components/ui/KpiCard";

const S = {
  stroke: "currentColor",
  fill: "none",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ICONS = {
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <path d="M12 3l8 3v6c0 4.5-3 8-8 9-5-1-8-4.5-8-9V6l8-3z" />
    </svg>
  ),
  building: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 8h.01M15 8h.01M9 13h.01M15 13h.01M9 18h6" />
    </svg>
  ),
  person: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" />
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
  admins: {
    cardBg: "#fdf2f0",
    border: "#f5cdc8",
    iconBg: "rgba(179,64,47,0.12)",
    iconColor: "#B3402F",
  },
  managers: {
    cardBg: "#eff5fd",
    border: "#c5d9f5",
    iconBg: "rgba(44,109,170,0.12)",
    iconColor: "#2C6DAA",
  },
  reception: {
    cardBg: "#f4f0fe",
    border: "#d9ccfa",
    iconBg: "rgba(124,58,237,0.12)",
    iconColor: "#7C3AED",
  },
};

export default function StaffStats() {
  const { data: admins = [] } = useAdmins();

  const active = admins.filter((a) => a.is_active).length;
  const inactive = admins.filter((a) => !a.is_active).length;
  const superAdmins = admins.filter((a) => a.is_super_admin).length;

  const stats = [
    {
      id: "total",
      label: "إجمالي المستخدمين",
      value: String(admins.length),
      note: `${active} نشط · ${inactive} معطّل`,
      icon: "users",
    },
    {
      id: "admins",
      label: "مديرو النظام",
      value: String(superAdmins),
      note: "صلاحيات كاملة",
      icon: "shield",
    },
    {
      id: "managers",
      label: "عيادات محددة",
      value: String(admins.filter((a) => !a.manages_all_clinics).length),
      note: "محدود بعيادات",
      icon: "building",
    },
    {
      id: "reception",
      label: "كل العيادات",
      value: String(admins.filter((a) => a.manages_all_clinics).length),
      note: "وصول كامل",
      icon: "person",
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
