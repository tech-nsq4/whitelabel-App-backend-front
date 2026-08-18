import Modal from '../../../components/ui/Modal'

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']

const SCHEDULE = {
  'الأحد':    { from: '09:00', to: '14:00', branch: 'العليا' },
  'الاثنين':  { from: '09:00', to: '14:00', branch: 'النخيل' },
  'الثلاثاء': { from: '16:00', to: '21:00', branch: 'العليا' },
  'الأربعاء': { from: '09:00', to: '14:00', branch: 'الملقا' },
  'الخميس':  { from: '16:00', to: '20:00', branch: 'العليا' },
}

const CAL_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
)

export default function DoctorScheduleModal({ open, onClose, doctor }) {
  if (!doctor) return null

  return (
    <Modal open={open} onClose={onClose} title="جدول المواعيد" subtitle={doctor.name}>
      <div className="flex flex-col gap-2 mb-4">
        {DAYS.map(day => {
          const slot = SCHEDULE[day]
          return (
            <div key={day} className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--paper)] rounded-xl border border-[var(--line)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[9px] bg-[var(--sand)] text-[var(--brand)] flex items-center justify-center shrink-0">
                  {CAL_ICON}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[var(--ink)]">{day}</div>
                  <div className="text-[11px] text-[var(--ink-45)] mt-0.5">{slot.branch}</div>
                </div>
              </div>
              <div className="num text-[12.5px] font-semibold text-[var(--ink)]" dir="ltr">
                {slot.from} – {slot.to}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-end">
        <button className="btn btn-q" onClick={onClose}>إغلاق</button>
      </div>
    </Modal>
  )
}
