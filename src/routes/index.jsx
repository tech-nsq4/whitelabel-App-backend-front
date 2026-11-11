import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants";
import ProtectedRoute from "./ProtectedRoute";

/* ─── Page Loader ────────────────────────────────────────── */
function PageLoader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "70vh",
      flexDirection: "column",
      gap: 20,
    }}>
      <div style={{ position: "relative", width: 52, height: 52 }}>
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
          style={{ position: "absolute", inset: 0 }}>
          <circle cx="26" cy="26" r="22" stroke="var(--line)" strokeWidth="4" />
        </svg>
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
          style={{ position: "absolute", inset: 0, animation: "pl-spin 0.75s linear infinite" }}>
          <circle cx="26" cy="26" r="22" stroke="var(--brand)" strokeWidth="4"
            strokeLinecap="round" strokeDasharray="138" strokeDashoffset="100" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--brand)", opacity: 0.25 }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>جاري التحميل</span>
        <span style={{ fontSize: 11.5, color: "var(--ink-45)" }}>يرجى الانتظار لحظة...</span>
      </div>
      <style>{`@keyframes pl-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Lazy Imports ───────────────────────────────────────── */

// Auth
const Login           = lazy(() => import("../pages/Login/Login"));

// Core
const Dashboard       = lazy(() => import("../pages/Dashboard/Dashboard"));
const Account         = lazy(() => import("../pages/Account/Account"));

// Appointments
const Queue           = lazy(() => import("../pages/Queue/Queue"));
const Calendar        = lazy(() => import("../pages/Calendar/Calendar"));

// People
const Patients        = lazy(() => import("../pages/Patients/Patients"));
const Doctors         = lazy(() => import("../pages/Doctors/Doctors"));
const DoctorReviews   = lazy(() => import("../pages/DoctorReviews/DoctorReviews"));
const Staff           = lazy(() => import("../pages/Staff/Staff"));
const Roles           = lazy(() => import("../pages/Roles/Roles"));
const ClinicManagers  = lazy(() => import("../pages/ClinicManagers/ClinicManagers"));

// Clinics & Services
const Branches        = lazy(() => import("../pages/Branches/Branches"));
const Clinics         = lazy(() => import("../pages/Clinics/Clinics"));
const Services        = lazy(() => import("../pages/Services/Services"));
const TimeTables      = lazy(() => import("../pages/TimeTables/TimeTables"));
const NewTimeTable    = lazy(() => import("../pages/TimeTables/NewTimeTable"));
const EditTimeTable   = lazy(() => import("../pages/TimeTables/EditTimeTable"));

// Finance & Marketing
const Billing         = lazy(() => import("../pages/Billing/Billing"));
const Insurance       = lazy(() => import("../pages/Insurance/Insurance"));
const Finance         = lazy(() => import("../pages/Finance/Finance"));
const Offers          = lazy(() => import("../pages/Offers/Offers"));
const PromoCodes      = lazy(() => import("../pages/PromoCodes/PromoCodes"));
const Packages        = lazy(() => import("../pages/Packages/Packages"));
const LoyaltySettings = lazy(() => import("../pages/LoyaltySettings/LoyaltySettings"));

// Analytics
const Reports         = lazy(() => import("../pages/Reports/Reports"));
const Analytics       = lazy(() => import("../pages/Analytics/Analytics"));
const Audit           = lazy(() => import("../pages/Audit/Audit"));

// Locations
const Cities          = lazy(() => import("../pages/Cities/Cities"));
const Locations       = lazy(() => import("../pages/Locations/Locations"));

// System
const Notifications   = lazy(() => import("../pages/Notifications/Notifications"));
const ContactMessages = lazy(() => import("../pages/ContactMessages/ContactMessages"));
const ContactInfo     = lazy(() => import("../pages/ContactInfo/ContactInfo"));
const Banners         = lazy(() => import("../pages/Banners/Banners"));
const Splashes        = lazy(() => import("../pages/Splashes/Splashes"));
const Pages           = lazy(() => import("../pages/Pages/Pages"));
const Branding        = lazy(() => import("../pages/Branding/Branding"));
const Settings        = lazy(() => import("../pages/Settings/Settings"));

/* ─── Protected Routes ───────────────────────────────────── */
export const protectedRoutes = [

  // ── Core ──────────────────────────────────────────────
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.ACCOUNT,   element: <Account /> },

  // ── Appointments ──────────────────────────────────────
  { path: ROUTES.QUEUE,     element: <Queue />,    permission: "appointments.view" },
  { path: ROUTES.CALENDAR,  element: <Calendar />, permission: "appointments.view" },

  // ── People ────────────────────────────────────────────
  { path: ROUTES.PATIENTS,       element: <Patients />,       permission: "users.view" },
  { path: ROUTES.DOCTORS,        element: <Doctors />,        permission: "doctors.view" },
  { path: ROUTES.DOCTOR_REVIEWS, element: <DoctorReviews /> },
  { path: ROUTES.STAFF,          element: <Staff />,          permission: "admins.view" },
  { path: ROUTES.ROLES,          element: <Roles />,          permission: "roles.view" },
  { path: ROUTES.CLINIC_MANAGERS,element: <ClinicManagers />, permission: "clinic-managers.view" },

  // ── Clinics & Services ────────────────────────────────
  { path: ROUTES.BRANCHES,  element: <Branches />, permission: "clinics.view" },
  { path: ROUTES.CLINICS,   element: <Clinics />,  permission: "clinics.view" },
  { path: ROUTES.SERVICES,  element: <Services />, permission: "sub-specializations.view" },
  { path: ROUTES.TIME_TABLES,              element: <TimeTables />,   permission: "time-tables.view" },
  { path: ROUTES.TIME_TABLES + "/new",     element: <NewTimeTable />, permission: "time-tables.view" },
  { path: ROUTES.TIME_TABLES + "/:id/edit",element: <EditTimeTable />,permission: "time-tables.view" },

  { path: ROUTES.BILLING,         element: <Billing />,        permission: "appointments.view" },
  { path: ROUTES.INSURANCE,       element: <Insurance />,      permission: "appointments.view" },
  { path: ROUTES.FINANCE,         element: <Finance /> },
  { path: ROUTES.OFFERS,          element: <Offers />,         permission: "offers.view" },
  { path: ROUTES.PROMO_CODES,     element: <PromoCodes />,     permission: "promo-codes.view" },
  { path: ROUTES.PACKAGES,        element: <Packages /> },
  { path: ROUTES.LOYALTY_SETTINGS,element: <LoyaltySettings />,superAdminOnly: true },

  // ── Analytics ─────────────────────────────────────────
  { path: ROUTES.REPORTS,   element: <Reports />,   permission: "appointments.view" },
  { path: ROUTES.ANALYTICS, element: <Analytics />, permission: "appointments.view" },
  { path: ROUTES.AUDIT,     element: <Audit />,     permission: "admins.view" },

  // ── Locations ─────────────────────────────────────────
  { path: ROUTES.CITIES,    element: <Cities />,    permission: "cities.view" },
  { path: ROUTES.LOCATIONS, element: <Locations />, permission: "locations.view" },

  // ── System ────────────────────────────────────────────
  { path: ROUTES.NOTIFICATIONS,    element: <Notifications />,   permission: "push-notifications.view" },
  { path: ROUTES.CONTACT_MESSAGES, element: <ContactMessages />, permission: "contact-messages.view" },
  { path: ROUTES.CONTACT_INFO,     element: <ContactInfo />,     permission: "contact-info.view" },
  { path: ROUTES.BANNERS,          element: <Banners />,         permission: "banners.view" },
  { path: ROUTES.SPLASHES,         element: <Splashes />,        permission: "splashes.view" },
  { path: ROUTES.PAGES,            element: <Pages />,           superAdminOnly: true },
  { path: ROUTES.BRANDING,         element: <Branding />,        superAdminOnly: true },
  { path: ROUTES.SETTINGS,         element: <Settings />,        superAdminOnly: true },
];

/* ─── App Routes ─────────────────────────────────────────── */
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* Protected */}
        {protectedRoutes.map(({ path, element, permission, superAdminOnly }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute permission={permission} superAdminOnly={superAdminOnly}>
                {element}
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
}
