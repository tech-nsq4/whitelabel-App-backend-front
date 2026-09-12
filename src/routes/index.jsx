import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants";
import ProtectedRoute from "./ProtectedRoute";

// Simple full-page loader shown while lazy chunks download
function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        flexDirection: "column",
        gap: 16,
        color: "var(--ink-45)",
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      </svg>
      <span style={{ fontSize: 13 }}>جاري التحميل...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const Login = lazy(() => import("../pages/Login/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Queue = lazy(() => import("../pages/Queue/Queue"));
const Calendar = lazy(() => import("../pages/Calendar/Calendar"));
const Patients = lazy(() => import("../pages/Patients/Patients"));
const Branches = lazy(() => import("../pages/Branches/Branches"));
const Clinics = lazy(() => import("../pages/Clinics/Clinics"));
const Doctors = lazy(() => import("../pages/Doctors/Doctors"));
const Services = lazy(() => import("../pages/Services/Services"));
const Staff = lazy(() => import("../pages/Staff/Staff"));
const Billing = lazy(() => import("../pages/Billing/Billing"));
const Insurance = lazy(() => import("../pages/Insurance/Insurance"));
const Reports = lazy(() => import("../pages/Reports/Reports"));
const Analytics = lazy(() => import("../pages/Analytics/Analytics"));
const Audit = lazy(() => import("../pages/Audit/Audit"));
const Branding = lazy(() => import("../pages/Branding/Branding"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const Account = lazy(() => import("../pages/Account/Account"));
const Roles = lazy(() => import("../pages/Roles/Roles"));
const Cities = lazy(() => import("../pages/Cities/Cities"));
const Locations = lazy(() => import("../pages/Locations/Locations"));
const ClinicManagers = lazy(
  () => import("../pages/ClinicManagers/ClinicManagers"),
);
const Notifications = lazy(
  () => import("../pages/Notifications/Notifications"),
);
const TimeTables = lazy(() => import("../pages/TimeTables/TimeTables"));
const NewTimeTable = lazy(() => import("../pages/TimeTables/NewTimeTable"));
const EditTimeTable = lazy(() => import("../pages/TimeTables/EditTimeTable"));
const Pages = lazy(() => import("../pages/Pages/Pages"));
const ContactMessages = lazy(() => import('../pages/ContactMessages/ContactMessages'))
const ContactInfo = lazy(() => import('../pages/ContactInfo/ContactInfo'))
const Banners = lazy(() => import('../pages/Banners/Banners'))
const Offers = lazy(() => import("../pages/Offers/Offers"));
const PromoCodes = lazy(() => import("../pages/PromoCodes/PromoCodes"));
const Splashes = lazy(() => import("../pages/Splashes/Splashes"));
const Finance = lazy(() => import("../pages/Finance/Finance"));
const DoctorReviews = lazy(() => import("../pages/DoctorReviews/DoctorReviews"));

const protectedRoutes = [
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.QUEUE, element: <Queue />, permission: "appointments.view" },
  {
    path: ROUTES.CALENDAR,
    element: <Calendar />,
    permission: "appointments.view",
  },
  { path: ROUTES.PATIENTS, element: <Patients /> },
  { path: ROUTES.BRANCHES, element: <Branches />, permission: "clinics.view" },
  { path: ROUTES.CLINICS, element: <Clinics />, permission: "clinics.view" },
  { path: ROUTES.DOCTORS, element: <Doctors />, permission: "doctors.view" },
  { path: ROUTES.SERVICES, element: <Services /> },
  { path: ROUTES.STAFF, element: <Staff />, permission: "admins.view" },
  { path: ROUTES.BILLING, element: <Billing /> },
  { path: ROUTES.INSURANCE, element: <Insurance /> },
  { path: ROUTES.REPORTS, element: <Reports /> },
  { path: ROUTES.ANALYTICS, element: <Analytics /> },
  { path: ROUTES.AUDIT, element: <Audit /> },
  { path: ROUTES.BRANDING, element: <Branding /> },
  { path: ROUTES.SETTINGS, element: <Settings /> },
  { path: ROUTES.ACCOUNT, element: <Account /> },
  { path: ROUTES.ROLES, element: <Roles />, permission: "roles.view" },
  { path: ROUTES.CITIES, element: <Cities />, permission: "cities.view" },
  {
    path: ROUTES.LOCATIONS,
    element: <Locations />,
    permission: "locations.view",
  },
  {
    path: ROUTES.CLINIC_MANAGERS,
    element: <ClinicManagers />,
    permission: "clinic-managers.view",
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: <Notifications />,
    permission: "push-notifications.view",
  },
  { path: ROUTES.TIME_TABLES, element: <TimeTables /> },
  { path: ROUTES.TIME_TABLES + "/new", element: <NewTimeTable /> },
  { path: ROUTES.TIME_TABLES + "/:id/edit", element: <EditTimeTable /> },
  { path: ROUTES.PAGES, element: <Pages /> },
  { path: ROUTES.CONTACT_MESSAGES, element: <ContactMessages />, permission: 'contact-messages.view' },
  { path: ROUTES.CONTACT_INFO, element: <ContactInfo />, permission: 'contact-info.view' },
  { path: ROUTES.BANNERS, element: <Banners />, permission: 'banners.view' },
  { path: ROUTES.OFFERS, element: <Offers />, permission: "offers.view" },
  {
    path: ROUTES.PROMO_CODES,
    element: <PromoCodes />,
    permission: "promo-codes.view",
  },
  { path: ROUTES.SPLASHES, element: <Splashes />, permission: 'splashes.view' },
  { path: ROUTES.FINANCE, element: <Finance /> },
  { path: ROUTES.DOCTOR_REVIEWS, element: <DoctorReviews /> },
];

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* Protected — requires authentication */}
        {protectedRoutes.map(({ path, element, permission }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute permission={permission}>{element}</ProtectedRoute>
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
}
