import { useQuery } from '@tanstack/react-query'
import Modal from '../../../components/ui/Modal'
import { getDoctorTimeTablesApi } from '../../../api/doctors.api'

const DAY_AR = {
  Saturday: 'السبت', Sunday: 'الأحد', Monday: 'الاثنين',
  Tuesday: 'الثلاثاء', Wednesday: 'الأربعاء', Thursday: 'الخميس', Friday: 'الجمعة',
}

const TYPE_LABELS = { clinic: 'عيادة', home: 'منزل', video: 'فيديو' }
const TYPE_COLORS = {
  clinic: { bg: 'rgba(15,107,92,0.1)', color: '#0F6B5C' },
  home:   { bg: 'rgba(44,109,170,0.1)', color: '#2C6DAA' },
  video:  { bg: 'rgba(124,58,237,0.1)', color: '#7C3AED' },
}

const CAL_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
)

function ShiftBadge({ start, end }) {
  if (!start || !end) return null
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-70)', background: 'var(--sand)', borderRadius: 6, padding: '2px 7px', fontFamily: 'monospace' }} dir="ltr">
      {start} – {end}
    </span>
  )
}

function ScheduleRow({ schedule }) {
  const dayAr = DAY_AR[schedule.day] || schedule.day
  const hasSecond = schedule.second_shift_start && schedule.second_shift_end
  const hasThird  = schedule.third_shift_start  && schedule.third_shift_end

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--sand)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {CAL_ICON}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{dayAr}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
        <ShiftBadge start={schedule.first_shift_start} end={schedule.first_shift_end} />
        {hasSecond && <ShiftBadge start={schedule.second_shift_start} end={schedule.second_shift_end} />}
        {hasThird  && <ShiftBadge start={schedule.third_shift_start}  end={schedule.third_shift_end}  />}
      </div>
    </div>
  )
}

function TimeTableCard({ table }) {
  const typeStyle = TYPE_COLORS[table.type] || TYPE_COLORS.clinic

  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--sand)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{table.name}</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: typeStyle.bg, color: typeStyle.color }}>
            {TYPE_LABELS[table.type] || table.type}
          </span>
          {!table.active && (
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'rgba(179,64,47,0.1)', color: 'var(--danger)' }}>
              غير نشط
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-45)', fontFamily: 'monospace' }} dir="ltr">
          {table.start_date} → {table.end_date}
        </div>
      </div>

      {/* meta */}
      <div style={{ display: 'flex', gap: 16, padding: '8px 14px', borderBottom: '1px solid var(--line)', fontSize: 11.5, color: 'var(--ink-70)' }}>
        <span>مدة الجلسة: <b>{table.session_hours} د</b></span>
        <span>فترة الراحة: <b>{table.duration_between_sessions} د</b></span>
        <span>عدد الجلسات: <b>{table.sessions}</b></span>
      </div>

      {/* schedules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 14px' }}>
        {table.schedules?.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--ink-45)', textAlign: 'center', padding: '8px 0' }}>لا توجد أيام محددة</div>
        )}
        {table.schedules?.map((s) => (
          <ScheduleRow key={s.id} schedule={s} />
        ))}
      </div>
    </div>
  )
}

export default function DoctorScheduleModal({ open, onClose, doctor }) {
  const { data: timeTables = [], isLoading } = useQuery({
    queryKey: ['time-tables', doctor?.id],
    queryFn: () => getDoctorTimeTablesApi(doctor.id).then(r => r.data.data || []),
    enabled: open && !!doctor?.id,
  })

  if (!doctor) return null

  return (
    <Modal open={open} onClose={onClose} title="جدول المواعيد" subtitle={doctor.name?.ar || doctor.name}>
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {[1, 2].map(n => (
            <div key={n} style={{ height: 160, borderRadius: 12, background: 'var(--line)', animation: 'pulse 1.2s ease infinite' }} />
          ))}
        </div>
      )}

      {!isLoading && timeTables.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-45)', fontSize: 13 }}>
          لا يوجد جدول مواعيد لهذا الطبيب
        </div>
      )}

      {!isLoading && timeTables.map(table => (
        <TimeTableCard key={table.id} table={table} />
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}
