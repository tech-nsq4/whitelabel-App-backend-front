import { useState } from "react";
import "../styles/BranchCard.css";

/* ================================
   Icons
================================ */

const BRANCH_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

const MORE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="6" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="18" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

const EDIT_ICON = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M16.5 3.5l4 4L8 20l-4.5.5L4 16z" />
  </svg>
);

/* ================================
   Component
================================ */

export default function BranchCard({ group, onDetails, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState({});

  // ================================
  // Statistics
  // ================================

  const totalDoctors = group.clinics.reduce(
    (total, clinic) => total + (clinic.doctorsCount || 0),
    0
  );

  // ================================
  // Menu Actions
  // ================================

  function toggleMenu(id) {
    setMenuOpen((previous) => ({ ...previous, [id]: !previous[id] }));
  }

  function closeMenu(id) {
    setMenuOpen((previous) => ({ ...previous, [id]: false }));
  }

  // ================================
  // Render
  // ================================

  return (
    <div className="tile branch-card">
      {/* ================================
          City Header
      ================================= */}

      <div className="branch-card-city-header">
        <div className="branch-card-city-header-left">
          <div className="branch-card-city-icon">{BRANCH_ICON}</div>

          <div>
            <div className="branch-card-city-name">{group.cityAr}</div>
            <div className="branch-card-city-meta">
              {group.clinics.length} عيادة · {totalDoctors} طبيب
            </div>
          </div>
        </div>

        <span className="branch-card-city-badge">نشط</span>
      </div>

      {/* ================================
          Clinics List
      ================================= */}

      <div className="branch-card-clinics-list">
        {group.clinics.map((clinic, index) => {
          const nameAr = clinic.name?.ar || clinic.name || "";
          const areaAr =
            clinic.location?.area?.name?.ar ||
            clinic.location?.name?.ar ||
            "";
          const addressAr = clinic.address?.ar || "";
          const isLast = index === group.clinics.length - 1;

          return (
            <div
              key={clinic.id}
              className={`branch-card-clinic-row${isLast ? " last" : ""}`}
            >
              {/* Clinic Information */}

              <div className="branch-card-clinic-info">
                <div className="branch-card-clinic-name-row">
                  <span className="branch-card-clinic-name">{nameAr}</span>
                </div>

                <div className="branch-card-clinic-location">
                  {areaAr && (
                    <span className="branch-card-clinic-area">{areaAr}</span>
                  )}
                  {addressAr && (
                    <span className="branch-card-clinic-address">
                      {addressAr}
                    </span>
                  )}
                </div>

                <div className="branch-card-clinic-doctors">
                  {clinic.doctorsCount} طبيب
                </div>
              </div>

              {/* ================================
                  Actions
              ================================= */}

              <div className="branch-card-clinic-actions">
                <button
                  type="button"
                  className="btn btn-q branch-card-details-btn"
                  onClick={() => onDetails(clinic)}
                >
                  التفاصيل
                </button>

                <button
                  type="button"
                  className="icon-btn branch-card-icon-btn"
                  onClick={() => onEdit(clinic)}
                  aria-label="تعديل العيادة"
                >
                  {EDIT_ICON}
                </button>

                <button
                  type="button"
                  className="icon-btn branch-card-icon-btn"
                  onClick={() => toggleMenu(clinic.id)}
                  aria-label="المزيد من الخيارات"
                  aria-expanded={Boolean(menuOpen[clinic.id])}
                >
                  {MORE_ICON}
                </button>

                {/* ================================
                    Dropdown Menu
                ================================= */}

                {menuOpen[clinic.id] && (
                  <div className="branch-card-dropdown">
                    <button
                      type="button"
                      className="branch-card-dropdown-btn"
                      onClick={() => {
                        onDetails(clinic);
                        closeMenu(clinic.id);
                      }}
                    >
                      عرض التفاصيل
                    </button>

                    <button
                      type="button"
                      className="branch-card-dropdown-btn"
                      onClick={() => {
                        onEdit(clinic);
                        closeMenu(clinic.id);
                      }}
                    >
                      تعديل العيادة
                    </button>

                    <button
                      type="button"
                      className="branch-card-dropdown-btn danger"
                      onClick={() => {
                        if (onDelete) onDelete(clinic.id);
                        closeMenu(clinic.id);
                      }}
                    >
                      حذف العيادة
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
