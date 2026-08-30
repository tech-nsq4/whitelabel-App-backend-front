import { useState, useRef, useEffect } from "react";
import { useToast } from "../../../components/ui/Toast";
import ClinicDetailsModal from "./ClinicDetailsModal";
import ClinicEditModal from "./ClinicEditModal";
import "../styles/ClinicCard.css";

const SPECIALTY_CONFIG = {
  الباطنة: {
    bg: "linear-gradient(135deg, #0F6B5C, #0A4F44)",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  الجلدية: {
    bg: "linear-gradient(135deg, #2C6DAA, #1e4f7e)",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  الأسنان: {
    bg: "linear-gradient(135deg, #7C3AED, #5B21B6)",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2C9 2 6 4.5 6 7.5c0 1.5.5 3 .5 3S5 14 5 17c0 2 1 5 3 5s2-3 4-3 2 3 4 3 3-3 3-5c0-3-1.5-6.5-1.5-6.5S19 9 19 7.5C19 4.5 16 2 12 2z" />
      </svg>
    ),
  },
  الأطفال: {
    bg: "linear-gradient(135deg, #D97706, #b45309)",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  "النساء والولادة": {
    bg: "linear-gradient(135deg, #DB2777, #9d174d)",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M12 13v8M9 18h6" />
      </svg>
    ),
  },
  العظام: {
    bg: "linear-gradient(135deg, #0891B2, #0e7490)",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18.5 2.5a2.121 2.121 0 000 3l-3 3a2.121 2.121 0 010 3 2.121 2.121 0 000 3l3 3a2.121 2.121 0 000 3" />
        <path d="M5.5 2.5a2.121 2.121 0 010 3l3 3a2.121 2.121 0 000 3 2.121 2.121 0 010 3l-3 3a2.121 2.121 0 010 3" />
      </svg>
    ),
  },
  العيون: {
    bg: "linear-gradient(135deg, #059669, #047857)",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  "الأنف والأذن": {
    bg: "linear-gradient(135deg, #9333EA, #7e22ce)",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
};

const DEFAULT_CONFIG = {
  bg: "linear-gradient(135deg, #0F6B5C, #0A4F44)",
  icon: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
};

const EDIT_ICON = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16.5 3.5l4 4L8 20l-4.5.5L4 16z" />
  </svg>
);

const MORE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <circle cx="5" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="19" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export default function ClinicCard({
  specialty: initialSpecialty,
  onDelete,
  onUpdate,
}) {
  useToast();
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const nameAr = specialty.title?.ar || specialty.nameAr || "";
  const nameEn = specialty.title?.en || specialty.nameEn || "";
  const config = SPECIALTY_CONFIG[nameAr] || DEFAULT_CONFIG;

  useEffect(() => {
    if (!menuOpen) return;
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const MENU_ITEMS = [
    {
      label: "عرض التفاصيل",
      action: () => {
        setDetailsOpen(true);
        setMenuOpen(false);
      },
    },
    {
      label: "تعديل التخصص",
      action: () => {
        setEditOpen(true);
        setMenuOpen(false);
      },
    },
    {
      label: "حذف التخصص",
      action: () => {
        onDelete?.(specialty.id);
        setMenuOpen(false);
      },
      danger: true,
    },
  ];

  return (
    <>
      <div className="tile cc-card">
        {/* Header */}
        <div className="cc-header" style={{ background: config.bg }}>
          <div className="cc-header-left">
            <div className="cc-icon-wrap">{config.icon}</div>
            <div>
              <div className="cc-name-ar">{nameAr}</div>
              <div className="cc-name-en">{nameEn}</div>
            </div>
          </div>

          <div ref={menuRef} className="cc-more-wrap">
            <button
              className="cc-more-btn"
              aria-label="المزيد"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {MORE_ICON}
            </button>
            {menuOpen && (
              <div className="cc-dropdown">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    className={`cc-dropdown-btn${item.danger ? " danger" : ""}`}
                    onClick={item.action}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="cc-body">
          {/* Stats strip */}
          <div className="cc-stats">
            {[
              { value: specialty.doctors, label: "أطباء" },
              { value: specialty.visitsPerDay, label: "زيارة/يوم" },
              {
                value: specialty.revenueMonth,
                label: "ر.س/شهر",
                highlight: true,
              },
            ].map((item, i) => (
              <div key={i} className="cc-stat-item">
                <div
                  className={`num cc-stat-value${item.highlight ? " highlight" : ""}`}
                >
                  {item.value}
                </div>
                <div className="cc-stat-label">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Sub specializations */}
          {specialty.sub_specializations?.length > 0 && (
            <div className="cc-sub-specs">
              {specialty.sub_specializations.map((s) => (
                <span key={s.id} className="chip mut cc-sub-spec-chip">
                  {s.title?.ar || s.title}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="cc-actions">
            <button
              className="btn btn-q cc-details-btn"
              onClick={() => setDetailsOpen(true)}
            >
              التفاصيل
            </button>
            <button
              className="btn btn-g cc-edit-btn"
              onClick={() => setEditOpen(true)}
              aria-label="تعديل"
            >
              {EDIT_ICON}
            </button>
          </div>
        </div>
      </div>

      <ClinicDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        specialty={specialty}
      />
      <ClinicEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        specialty={specialty}
        onSave={(updated) => {
          setSpecialty((prev) => ({ ...prev, ...updated }));
          onUpdate?.();
        }}
      />
    </>
  );
}
