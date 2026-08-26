import { useState, useRef, useMemo } from "react";
import CalendarHeader from "./components/CalendarHeader";
import CalendarView from "./components/CalendarView";
import AppointmentsTable from "./components/AppointmentsTable";
import MedicalRecords from "./components/MedicalRecords";
import BookingModal from "./components/BookingModal";
import AppointmentDetailsModal from "./components/AppointmentDetailsModal";
import PatientFileModal from "./components/PatientFileModal";
import { useClinics } from "../../hooks/queries/useClinics";
import { useToast } from "../../components/ui/Toast";
import "./styles/calendar.css";

function formatDate(date, view) {
  if (view === "شهر") {
    return new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
      month: "long",
      year: "numeric",
    }).format(date);
  }
  if (view === "أسبوع") {
    const start = getWeekStart(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const fmt = (d) =>
      new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
        day: "numeric",
        month: "short",
      }).format(d);
    return `${fmt(start)} – ${fmt(end)}`;
  }
  return new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function toStr(date) {
  return date.toISOString().slice(0, 10);
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

function getDateRange(date, view) {
  if (view === "يوم") {
    return { from: toStr(date), to: toStr(date) };
  }
  if (view === "أسبوع") {
    const start = getWeekStart(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { from: toStr(start), to: toStr(end) };
  }
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { from: toStr(start), to: toStr(end) };
}

const TABS = [
  { id: "schedule", label: "جدول الأطباء" },
  { id: "appointments", label: "الحجوزات" },
  { id: "medical", label: "السجل الطبي" },
];

export default function Calendar() {
  const { showToast } = useToast();
  const { data: clinics = [] } = useClinics();
  const dateInputRef = useRef(null);

  const [view, setView] = useState("يوم");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clinicFilter, setClinicFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("schedule");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientFileAppointment, setPatientFileAppointment] = useState(null);

  const dateRange = useMemo(
    () => getDateRange(currentDate, view),
    [currentDate, view],
  );

  function moveDate(direction) {
    setCurrentDate((date) => {
      const d = new Date(date);
      if (view === "شهر") d.setMonth(d.getMonth() + direction);
      else if (view === "أسبوع") d.setDate(d.getDate() + 7 * direction);
      else d.setDate(d.getDate() + direction);
      return d;
    });
  }

  function handleDateChange(e) {
    if (e.target.value) setCurrentDate(new Date(e.target.value));
  }
  function handleDateClick() {
    dateInputRef.current?.showPicker?.() || dateInputRef.current?.click();
  }
  function handleToday() {
    setCurrentDate(new Date());
  }
  function handleBookingSubmit() {
    showToast("تم حجز الموعد بنجاح");
    setBookingOpen(false);
  }

  return (
    <div className="calendar-page" style={{ animation: "fadeIn .3s ease" }}>
      <CalendarHeader
        currentDate={formatDate(currentDate, view)}
        currentDateValue={toStr(currentDate)}
        view={view}
        clinics={clinics}
        clinicFilter={clinicFilter}
        dateInputRef={dateInputRef}
        onPrev={() => moveDate(-1)}
        onNext={() => moveDate(1)}
        onToday={handleToday}
        onDateClick={handleDateClick}
        onDateChange={handleDateChange}
        onViewChange={setView}
        onClinicChange={setClinicFilter}
        onNewBooking={() => setBookingOpen(true)}
        onExport={() => showToast("جارٍ تصدير الجدول...")}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={TABS}
      />

      {/* ── Tab content ── */}
      {activeTab === "appointments" ? (
        <AppointmentsTable clinicFilter={clinicFilter} dateRange={dateRange} />
      ) : activeTab === "medical" ? (
        <MedicalRecords clinicFilter={clinicFilter} />
      ) : (
        <CalendarView
          clinicFilter={clinicFilter}
          dateRange={dateRange}
          view={view}
        />
      )}

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onSubmit={handleBookingSubmit}
      />
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onViewPatient={() => {
          setPatientFileAppointment(selectedAppointment);
          setSelectedAppointment(null);
        }}
      />
      <PatientFileModal
        appointment={patientFileAppointment}
        onClose={() => setPatientFileAppointment(null)}
      />
    </div>
  );
}
