import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListOrdered,
  CalendarDays,
  Users,
  Building2,
  Stethoscope,
  UserRound,
  Wrench,
  UserCog,
  CreditCard,
  ShieldCheck,
  FileBarChart2,
  BarChart3,
  ClipboardList,
  Palette,
  Settings,
  Search,
  X,
} from "lucide-react";
import "./GlobalSearch.css";

const SEARCH_ITEMS = [
  {
    icon: LayoutDashboard,
    name: "اللوحة الرئيسية",
    crumb: "عام",
    path: "/dashboard",
  },
  { icon: ListOrdered, name: "طابور اليوم", crumb: "عام", path: "/queue" },
  {
    icon: CalendarDays,
    name: "الحجوزات والمواعيد",
    crumb: "عام",
    path: "/calendar",
  },
  { icon: Users, name: "المرضى", crumb: "عام", path: "/patients" },
  { icon: Building2, name: "الفروع", crumb: "الإدارة", path: "/branches" },
  {
    icon: Stethoscope,
    name: "العيادات والتخصصات",
    crumb: "الإدارة",
    path: "/clinics",
  },
  { icon: UserRound, name: "الأطباء", crumb: "الإدارة", path: "/doctors" },
  {
    icon: Wrench,
    name: "الخدمات والأسعار",
    crumb: "الإدارة",
    path: "/services",
  },
  {
    icon: UserCog,
    name: "المستخدمون والصلاحيات",
    crumb: "الإدارة",
    path: "/staff",
  },
  {
    icon: CreditCard,
    name: "الفواتير والمدفوعات",
    crumb: "المالية",
    path: "/billing",
  },
  { icon: ShieldCheck, name: "التأمين", crumb: "المالية", path: "/insurance" },
  {
    icon: FileBarChart2,
    name: "التقارير المالية",
    crumb: "المالية",
    path: "/reports",
  },
  {
    icon: BarChart3,
    name: "التحليلات والذكاء",
    crumb: "التحليلات",
    path: "/analytics",
  },
  {
    icon: ClipboardList,
    name: "سجل النشاط",
    crumb: "التحليلات",
    path: "/audit",
  },
  { icon: Palette, name: "الهوية البصرية", crumb: "النظام", path: "/branding" },
  {
    icon: Settings,
    name: "الإعدادات العامة",
    crumb: "النظام",
    path: "/settings",
  },
];

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = SEARCH_ITEMS.filter(
    (item) =>
      !query.trim() || item.name.includes(query) || item.crumb.includes(query),
  );

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    function handle(e) {
      if (!open) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((v) => Math.min(v + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((v) => Math.max(v - 1, 0));
      }
      if (e.key === "Enter" && filtered[active]) {
        navigate(filtered[active].path);
        onClose();
      }
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, active, filtered, navigate, onClose]);

  if (!open) return null;

  return (
    <div
      className="gs-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="gs-modal">
        {/* Input */}
        <div className="gs-input-wrap">
          <Search size={16} strokeWidth={1.8} className="gs-search-icon" />
          <input
            ref={inputRef}
            className="gs-input"
            placeholder="ابحث في الصفحات والأقسام..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button
              className="gs-icon-btn"
              onClick={() => setQuery("")}
              aria-label="مسح"
            >
              <X size={14} strokeWidth={2.2} />
            </button>
          ) : (
            <kbd className="gs-esc" onClick={onClose}>
              Esc
            </kbd>
          )}
        </div>

        {/* Results */}
        <div className="gs-list">
          {filtered.length === 0 ? (
            <div className="gs-empty">
              <Search size={26} strokeWidth={1.3} />
              <p>
                لا توجد نتائج لـ "<strong>{query}</strong>"
              </p>
            </div>
          ) : (
            filtered.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  className={`gs-item${i === active ? " gs-active" : ""}`}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className="gs-item-icon">
                    <Icon size={16} strokeWidth={1.7} />
                  </span>
                  <span className="gs-item-name">{item.name}</span>
                  <span className="gs-item-tag">{item.crumb}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="gs-footer">
          <span>
            <kbd>↵</kbd> فتح
          </span>
          <span>
            <kbd>↑↓</kbd> تنقل
          </span>
          <span>
            <kbd>Esc</kbd> إغلاق
          </span>
        </div>
      </div>
    </div>
  );
}
