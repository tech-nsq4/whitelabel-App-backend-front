import { useState, useRef, useEffect } from "react";
import { useToast } from "../../../components/ui/Toast";
import ClinicDetailsModal from "./ClinicDetailsModal";
import ClinicEditModal from "./ClinicEditModal";

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

export default function ClinicCard({ specialty: initialSpecialty, onDelete, onUpdate }) {
  const { showToast } = useToast();
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const nameAr = specialty.title?.ar || specialty.nameAr || ''
  const nameEn = specialty.title?.en || specialty.nameEn || ''
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

  function handleSave(updated) {
    setSpecialty((prev) => ({ ...prev, ...updated }));
    showToast("تم حفظ التغييرات");
  }

  return (
    <>
      <div
        className="tile"
        style={{
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Colored header */}
        <div
          style={{
            background: config.bg,
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {config.icon}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Readex Pro'",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                {nameAr}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.65)",
                  marginTop: 3,
                }}
              >
                {nameEn}
              </div>
            </div>
          </div>

          {/* Three-dots dropdown */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="المزيد"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {MORE_ICON}
            </button>
            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 36,
                  left: 0,
                  zIndex: 50,
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  boxShadow: "0 8px 24px rgba(10,31,27,0.12)",
                  minWidth: 155,
                  overflow: "hidden",
                }}
              >
                {[
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
                      onDelete && onDelete(specialty.id);
                      setMenuOpen(false);
                    },
                    danger: true,
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    style={{
                      width: "100%",
                      textAlign: "right",
                      padding: "10px 14px",
                      fontSize: 12.5,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: item.danger ? "var(--danger)" : "var(--ink)",
                      display: "block",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = item.danger
                        ? "rgba(179,64,47,0.06)"
                        : "var(--paper)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "14px 18px 16px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Stats strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              background: "var(--paper)",
              borderRadius: 10,
              padding: "10px 8px",
              border: "1px solid var(--line)",
            }}
          >
            {[
              { value: specialty.doctors, label: "أطباء" },
              { value: specialty.visitsPerDay, label: "زيارة/يوم" },
              {
                value: specialty.revenueMonth,
                label: "ر.س/شهر",
                highlight: true,
              },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center", padding: "0 4px" }}>
                <div
                  className="num"
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: item.highlight ? "var(--brand)" : "var(--ink)",
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{ fontSize: 10, color: "var(--ink-45)", marginTop: 3 }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Sub Specializations count */}
          {specialty.sub_specializations?.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {specialty.sub_specializations.map((s) => (
              <span key={s.id} className="chip mut" style={{ fontSize: 10.5 }}>
                {s.title?.ar || s.title}
              </span>
            ))}
          </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
            <button
              className="btn btn-q"
              style={{
                flex: 1,
                justifyContent: "center",
                padding: "7px 12px",
                fontSize: 12.5,
              }}
              onClick={() => setDetailsOpen(true)}
            >
              التفاصيل
            </button>
            <button
              className="btn btn-g"
              style={{
                width: 36,
                height: 36,
                padding: 0,
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
              }}
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
        onSave={onUpdate}
      />
    </>
  );
}
