import { useMemo } from 'react'
import { calendarDoctors, timeSlots, appointments } from '../calendar.data'
import AppointmentCard from './AppointmentCard'

export default function CalendarView({ activeBranch, onAppointmentClick }) {
  // Build a lookup: { time_doctorId: appointment }
  const apptMap = useMemo(() => {
    const map = {}
    appointments.forEach((appt) => {
      if (activeBranch === 'all' || appt.branch === activeBranch) {
        const key = `${appt.time}_${appt.doctorId}`
        if (!map[key]) map[key] = []
        map[key].push(appt)
      }
    })
    return map
  }, [activeBranch])

  return (
    <div className="panel calendar-board">
      {/* Doctor columns header */}
      <div className="calendar-board-head">
        <div style={{ width: 70, padding: '0 12px', color: 'var(--ink-45)', fontSize: 11 }}>
          الوقت
        </div>
        <div style={{ flex: 1, padding: '0 8px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {calendarDoctors.map((doc) => (
            <div key={doc.id} style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', borderRadius: 8,
                background: `${doc.color}15`, color: doc.color,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: doc.color }} />
                <div style={{ fontSize: '11.5px', fontWeight: 600 }}>{doc.name}</div>
              </div>
              <div style={{ fontSize: 10, color: 'var(--ink-45)', marginTop: 3 }}>{doc.specialty}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div className="calendar-board-scroll">
        <table className="calendar-grid">
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot}>
                <td style={{
                  width: 70, padding: '8px 12px',
                  color: 'var(--ink-45)', fontSize: 11,
                  verticalAlign: 'top',
                  borderLeft: '1px solid var(--line)',
                  fontFamily: "'Readex Pro'",
                }}>
                  {slot}
                </td>
                <td style={{ padding: '4px 8px', verticalAlign: 'top' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                    {calendarDoctors.map((doc) => {
                      const key = `${slot}_${doc.id}`
                      const slotAppts = apptMap[key] || []
                      return (
                        <div key={doc.id}>
                          {slotAppts.length > 0
                            ? slotAppts.map((appt) => (
                                <AppointmentCard
                                  key={appt.id}
                                  patientName={appt.patientName}
                                  doctorShortName={`د. ${doc.shortName}`}
                                  color={doc.color}
                                  onClick={() => onAppointmentClick(appt)}
                                />
                              ))
                            : <div style={{ padding: '6px 8px' }} />
                          }
                        </div>
                      )
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
