import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
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
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  MapPin,
} from "lucide-react";
import "./Sidebar.css";
import { useBranding } from "../../hooks/useBranding";
import { getClinicsApi } from "../../api/clinics.api";

const NAV = [
  {
    section: "عام",
    items: [
      {
        id: "dashboard",
        label: "اللوحة الرئيسية",
        path: "/dashboard",
        icon: <LayoutDashboard size={18} strokeWidth={1.7} />,
      },
      {
        id: "queue",
        label: "طابور اليوم",
        path: "/queue",
        icon: <ListOrdered size={18} strokeWidth={1.7} />,
        badge: "18",
      },
      {
        id: "calendar",
        label: "الحجوزات والمواعيد",
        path: "/calendar",
        icon: <CalendarDays size={18} strokeWidth={1.7} />,
      },
      {
        id: "patients",
        label: "المرضى",
        path: "/patients",
        icon: <Users size={18} strokeWidth={1.7} />,
      },
    ],
  },
  {
    section: "الإدارة",
    items: [
      {
        id: "branches",
        label: "الفروع",
        path: "/branches",
        icon: <Building2 size={18} strokeWidth={1.7} />,
      },
      {
        id: "cities",
        label: "المدن والمناطق",
        path: "/cities",
        icon: <MapPin size={18} strokeWidth={1.7} />,
      },
      {
        id: "locations",
        label: "المواقع",
        path: "/locations",
        icon: <MapPin size={18} strokeWidth={1.7} />,
      },
      {
        id: "clinic-managers",
        label: "مديرو العيادات",
        path: "/clinic-managers",
        icon: <UserCog size={18} strokeWidth={1.7} />,
      },
      {
        id: "clinics",
        label: "العيادات والتخصصات",
        path: "/clinics",
        icon: <Stethoscope size={18} strokeWidth={1.7} />,
      },
      {
        id: "doctors",
        label: "الأطباء",
        path: "/doctors",
        icon: <UserRound size={18} strokeWidth={1.7} />,
      },
      {
        id: "services",
        label: "الخدمات والأسعار",
        path: "/services",
        icon: <Wrench size={18} strokeWidth={1.7} />,
      },
      {
        id: "staff",
        label: "المستخدمون والصلاحيات",
        path: "/staff",
        icon: <UserCog size={18} strokeWidth={1.7} />,
      },
    ],
  },
  {
    section: "المالية",
    items: [
      {
        id: "billing",
        label: "الفواتير والمدفوعات",
        path: "/billing",
        icon: <CreditCard size={18} strokeWidth={1.7} />,
      },
      {
        id: "insurance",
        label: "التأمين",
        path: "/insurance",
        icon: <ShieldCheck size={18} strokeWidth={1.7} />,
      },
      {
        id: "reports",
        label: "التقارير المالية",
        path: "/reports",
        icon: <FileBarChart2 size={18} strokeWidth={1.7} />,
      },
    ],
  },
  {
    section: "التحليلات",
    items: [
      {
        id: "analytics",
        label: "التحليلات والذكاء",
        path: "/analytics",
        icon: <BarChart3 size={18} strokeWidth={1.7} />,
      },
      {
        id: "audit",
        label: "سجل النشاط",
        path: "/audit",
        icon: <ClipboardList size={18} strokeWidth={1.7} />,
      },
    ],
  },
  {
    section: "النظام",
    items: [
      {
        id: "branding",
        label: "الهوية البصرية",
        path: "/branding",
        icon: <Palette size={18} strokeWidth={1.7} />,
      },
      {
        id: "settings",
        label: "الإعدادات العامة",
        path: "/settings",
        icon: <Settings size={18} strokeWidth={1.7} />,
      },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { nameAr, nameEn, logo } = useBranding();
  const [clinicsCount, setClinicsCount] = useState(null);

  useEffect(() => {
    getClinicsApi()
      .then(({ data }) => setClinicsCount((data.data || []).length))
      .catch(() => {})
  }, [])

  return (
    <div className={`sidebar${collapsed ? " collapsed" : ""}`}>
      {/* Brand */}
      <div className="brand">
        <div className="brand-logo">
          {logo ? (
            <img
              src={logo}
              alt="logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 12,
              }}
            />
          ) : (
            <LayoutDashboard size={20} strokeWidth={1.6} color="#fff" />
          )}
        </div>
        {!collapsed && (
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="brand-name">{nameAr}</div>
            <div className="brand-sub">{nameEn}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="side-scroll">
        {NAV.map((group) => (
          <div key={group.section} className="side-group">
            {!collapsed && <div className="side-section">{group.section}</div>}
            {group.items.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `side-item${isActive ? " active" : ""}`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="side-icon">{item.icon}</span>
                {!collapsed && <span className="side-label">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="side-badge">{item.badge}</span>
                )}
                {!collapsed && (
                  <ChevronRight
                    size={13}
                    strokeWidth={2}
                    className="side-arrow"
                  />
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="side-foot">
        <button
          className="collapse-btn"
          onClick={onToggle}
          aria-label={collapsed ? "توسيع القائمة" : "تصغير القائمة"}
          title={collapsed ? "توسيع القائمة" : "تصغير القائمة"}
        >
          {collapsed ? (
            <PanelLeftOpen size={17} strokeWidth={1.7} />
          ) : (
            <PanelLeftClose size={17} strokeWidth={1.7} />
          )}
          {!collapsed && <span className="side-label">تصغير القائمة</span>}
        </button>
      </div>
    </div>
  );
}
