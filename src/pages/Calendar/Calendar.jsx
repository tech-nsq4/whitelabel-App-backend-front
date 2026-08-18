import { useState } from 'react'
import CalendarHeader from './components/CalendarHeader'
import CalendarView from './components/CalendarView'
import BookingModal from './components/BookingModal'
import AppointmentDetailsModal from './components/AppointmentDetailsModal'
import PatientFileModal from './components/PatientFileModal'
import { calendarDoctors } from './calendar.data'
import { useToast } from '../../components/ui/Toast'
import './Calendar.css'

const INITIAL_DATE = new Date(2026, 7, 4)

function formatDate(date) {
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(date)
}

export default function Calendar() {
  const { showToast } = useToast()

  const [view, setView]               = useState('يوم')
  const [currentDate, setCurrentDate] = useState(INITIAL_DATE)
  const [activeBranch, setActiveBranch] = useState('all')
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [patientFileAppointment, setPatientFileAppointment] = useState(null)

  function moveDate(direction) {
    setCurrentDate((date) => {
      const nextDate = new Date(date)
      if (view === 'شهر') nextDate.setMonth(nextDate.getMonth() + direction)
      else nextDate.setDate(nextDate.getDate() + (view === 'أسبوع' ? 7 : 1) * direction)
      return nextDate
    })
  }

  function handlePrev() { moveDate(-1) }
  function handleNext() { moveDate(1) }
  function handleToday() { setCurrentDate(INITIAL_DATE) }

  function handleAppointmentClick(appointment) {
    setSelectedAppointment(appointment)
  }

  function handleBookingSubmit(data) {
    showToast('تم حجز الموعد بنجاح')
    setBookingOpen(false)
  }

  return (
    <div className="calendar-page" style={{ animation: 'fadeIn .3s ease' }}>
      <CalendarHeader
        currentDate={formatDate(currentDate)}
        view={view}
        activeBranch={activeBranch}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={setView}
        onBranchChange={setActiveBranch}
        onNewBooking={() => setBookingOpen(true)}
        onExport={() => showToast('جارٍ تصدير الجدول...')}
      />

      <CalendarView
        activeBranch={activeBranch}
        onAppointmentClick={handleAppointmentClick}
      />

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onSubmit={handleBookingSubmit}
      />
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        doctor={calendarDoctors.find((doctor) => doctor.id === selectedAppointment?.doctorId)}
        onClose={() => setSelectedAppointment(null)}
        onViewPatient={() => { setPatientFileAppointment(selectedAppointment); setSelectedAppointment(null) }}
      />
      <PatientFileModal
        appointment={patientFileAppointment}
        doctor={calendarDoctors.find((doctor) => doctor.id === patientFileAppointment?.doctorId)}
        onClose={() => setPatientFileAppointment(null)}
      />
    </div>
  )
}
