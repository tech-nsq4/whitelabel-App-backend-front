export const analyticsStats = [
  {
    id: "revenue",
    label: "إجمالي الإيرادات",
    value: "361,000",
    unit: "ر.س",
    delta: { value: "12%", dir: "up" },
    note: "عن الشهر السابق",
    icon: "card",
  },
  {
    id: "visits",
    label: "إجمالي الزيارات",
    value: "4,218",
    delta: { value: "8%", dir: "up" },
    note: "زيارة هذا الشهر",
    icon: "calendar",
  },
  {
    id: "rating",
    label: "معدل رضا المرضى",
    value: "4.7",
    unit: "/ 5",
    delta: { value: "0.2", dir: "up" },
    note: "تحسّن",
    icon: "star",
  },
  {
    id: "cancel",
    label: "نسبة الإلغاء",
    value: "6.3",
    unit: "%",
    valueColor: "var(--warn)",
    delta: { value: "0.8%", dir: "dn" },
    note: "ارتفاع طفيف",
    icon: "x",
  },
];

export const revenueBySpecialty = [
  { label: "باطنة", value: "185,000", pct: 100 },
  { label: "أسنان", value: "168,000", pct: 91 },
  { label: "جلدية", value: "142,000", pct: 77 },
  { label: "نساء وولادة", value: "124,000", pct: 67 },
  { label: "أطفال", value: "98,000", pct: 53 },
];

// height in px, opacity as decimal
export const peakHours = [
  { label: "8", height: 30, opacity: 0.4 },
  { label: "9", height: 80, opacity: 0.7 },
  { label: "10", height: 140, opacity: 1 },
  { label: "11", height: 160, opacity: 1 },
  { label: "12", height: 120, opacity: 1 },
  { label: "1", height: 60, opacity: 0.7 },
  { label: "2", height: 90, opacity: 1 },
  { label: "3", height: 110, opacity: 1 },
  { label: "4", height: 100, opacity: 1 },
  { label: "5", height: 40, opacity: 0.4 },
];

export const periodOptions = ["اليوم", "الأسبوع", "الشهر", "السنة"];
