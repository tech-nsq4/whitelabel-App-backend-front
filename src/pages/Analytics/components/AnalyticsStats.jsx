import { analyticsStats } from "../analytics.data";
import KpiCard from "../../../components/ui/KpiCard";

const S = {
  stroke: "currentColor",
  fill: "none",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ICONS = {
  card: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  x: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...S}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
};

const TINTS = {
  revenue: {
    cardBg: "#f0faf7",
    border: "#c8e8e1",
    iconBg: "rgba(15,107,92,0.12)",
    iconColor: "#0F6B5C",
  },
  visits: {
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
  cancel: {
    cardBg: "#fdf2f0",
    border: "#f5cdc8",
    iconBg: "rgba(179,64,47,0.12)",
    iconColor: "#B3402F",
    valueColor: "var(--warn)",
  },
};

export default function AnalyticsStats() {
  return (
    <div className="kpi-grid">
      {analyticsStats.map((stat) => (
        <KpiCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          note={stat.note}
          delta={stat.delta?.value}
          deltaType={stat.delta?.dir}
          icon={ICONS[stat.icon]}
          tint={TINTS[stat.id] || TINTS.revenue}
        />
      ))}
    </div>
  );
}
