import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants";
import ProtectedRoute from "./ProtectedRoute";

const Login     = lazy(() => import("../pages/Login/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Queue     = lazy(() => import("../pages/Queue/Queue"));
const Calendar  = lazy(() => import("../pages/Calendar/Calendar"));
const Patients  = lazy(() => import("../pages/Patients/Patients"));
const Branches  = lazy(() => import("../pages/Branches/Branches"));
const Clinics   = lazy(() => import("../pages/Clinics/Clinics"));
const Doctors   = lazy(() => import("../pages/Doctors/Doctors"));
const Services  = lazy(() => import("../pages/Services/Services"));
const Staff     = lazy(() => import("../pages/Staff/Staff"));
const Billing   = lazy(() => import("../pages/Billing/Billing"));
const Insurance = lazy(() => import("../pages/Insurance/Insurance"));
const Reports   = lazy(() => import("../pages/Reports/Reports"));
const Analytics = lazy(() => import("../pages/Analytics/Analytics"));
const Audit     = lazy(() => import("../pages/Audit/Audit"));
const Branding  = lazy(() => import("../pages/Branding/Branding"));
const Settings  = lazy(() => import("../pages/Settings/Settings"));
const Account   = lazy(() => import("../pages/Account/Account"));
const Roles     = lazy(() => import("../pages/Roles/Roles"));

const protectedRoutes = [
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.QUEUE,     element: <Queue /> },
  { path: ROUTES.CALENDAR,  element: <Calendar /> },
  { path: ROUTES.PATIENTS,  element: <Patients /> },
  { path: ROUTES.BRANCHES,  element: <Branches /> },
  { path: ROUTES.CLINICS,   element: <Clinics /> },
  { path: ROUTES.DOCTORS,   element: <Doctors /> },
  { path: ROUTES.SERVICES,  element: <Services /> },
  { path: ROUTES.STAFF,     element: <Staff /> },
  { path: ROUTES.BILLING,   element: <Billing /> },
  { path: ROUTES.INSURANCE, element: <Insurance /> },
  { path: ROUTES.REPORTS,   element: <Reports /> },
  { path: ROUTES.ANALYTICS, element: <Analytics /> },
  { path: ROUTES.AUDIT,     element: <Audit /> },
  { path: ROUTES.BRANDING,  element: <Branding /> },
  { path: ROUTES.SETTINGS,  element: <Settings /> },
  { path: ROUTES.ACCOUNT,   element: <Account /> },
  { path: ROUTES.ROLES,     element: <Roles /> },
];

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* Protected — requires authentication */}
        {protectedRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute>{element}</ProtectedRoute>}
          />
        ))}
      </Routes>
    </Suspense>
  );
}
