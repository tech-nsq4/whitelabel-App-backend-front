import { useState, useRef, useEffect } from 'react'
import { useToast } from '../../../components/ui/Toast'
import DoctorFileModal from './DoctorFileModal'
import DoctorEditModal from './DoctorEditModal'
import DoctorScheduleModal from './DoctorScheduleModal'

const MORE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <circle cx="5"  cy="12" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
  </svg>
)

const STATUS_CONFIG = {
  active:   { label: 'نشط',     cls: 'chip ok'   },
  leave:    { label: 'إجازة',   cls: 'chip warn' },
  inactive: { label: 'غير نشط', cls: 'chip mut'  },
}

const AVATAR_COLORS = [
  'from-[#0F6B5C] to-[#0A4F44]',
  'from-[#2C6DAA] to-[#1e4f7e]',
  'from-[#7C3AED] to-[#5B21B6]',
  'from-[#D97706] to-[#b45309]',
  'from-[#DB2777] to-[#9d174d]',
  'from-[#0891B2] to-[#0e7490]',
  'from-[#059669] to-[#047857]',
  'from-[#9333EA] to-[#7e22ce]',
]

function RowMenu({ onViewFile, onEdit, onSchedule, onDeactivate }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, right: 0 })
  const btnRef  = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current  && !btnRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function handleOpen() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.left })
    }
    setOpen(v => !v)
  }

  const items = [
    { label: 'عرض الملف',      action: () => { onViewFile();    setOpen(false) } },
    { label: 'تعديل البيانات', action: () => { onEdit();        setOpen(false) } },
    { label: 'جدول المواعيد',  action: () => { onSchedule();   setOpen(false) } },
    { label: 'إلغاء التفعيل',  action: () => { onDeactivate(); setOpen(false) }, danger: true },
  ]

  return (
    <>
      <button ref={btnRef} className="icon-btn w-8 h-8" aria-label="المزيد" onClick={handleOpen}>
        {MORE_ICON}
      </button>
      {open && (
        <div ref={menuRef} style={{
          position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999,
          background: 'var(--card)', border: '1px solid var(--line)',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(10,31,27,0.12)',
          minWidth: 155, overflow: 'hidden',
        }}>
          {items.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{ width: '100%', textAlign: 'right', padding: '10px 14px', fontSize: 12.5, background: 'none', border: 'none', cursor: 'pointer', color: item.danger ? 'var(--danger)' : 'var(--ink)', display: 'block' }}
              onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'rgba(179,64,47,0.06)' : 'var(--paper)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default function DoctorTable({ doctors }) {
  const { showToast } = useToast()
  const [fileModal,     setFileModal]     = useState({ open: false, doctor: null, index: 0 })
  const [editModal,     setEditModal]     = useState({ open: false, doctor: null })
  const [scheduleModal, setScheduleModal] = useState({ open: false, doctor: null })
  const [localDoctors,  setLocalDoctors]  = useState(doctors)

  useEffect(() => { setLocalDoctors(doctors) }, [doctors])

  function handleSave(updated) {
    setLocalDoctors(prev => prev.map(d => d.id === updated.id ? { ...d, ...updated } : d))
    showToast('تم حفظ التغييرات')
  }

  if (localDoctors.length === 0) {
    return (
      <div className="panel py-12 text-center text-[var(--ink-45)] text-sm">
        لا يوجد أطباء مطابقون للبحث
      </div>
    )
  }

  return (
    <>
      <div className="panel">
        <table className="data">
          <thead>
            <tr>
              <th>الطبيب</th>
              <th>الفرع</th>
              <th>الجوال</th>
              <th>الرخصة</th>
              <th>زيارات الشهر</th>
              <th>التقييم</th>
              <th>الحالة</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {localDoctors.map((doc, idx) => {
              const statusCfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.active
              const avatarGrad = AVATAR_COLORS[idx % AVATAR_COLORS.length]
              return (
                <tr key={doc.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-[9px] bg-gradient-to-br ${avatarGrad} text-white flex items-center justify-center text-[13px] font-bold shrink-0`}>
                        {doc.initial}
                      </div>
                      <div>
                        <div className="td-name">{doc.name}</div>
                        <div className="td-sub">{doc.specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-[12.5px] text-[var(--ink-70)]">{doc.branch}</td>
                  <td className="num text-right text-[12px] text-[var(--ink-70)]" dir="ltr">{doc.phone}</td>
                  <td className="num text-[12.5px]">
                    {doc.license}
                    {doc.licenseExpiring && (
                      <span className="chip warn text-[9.5px] mr-1.5 px-1.5 py-0.5">تجديد</span>
                    )}
                  </td>
                  <td>
                    <span className="num font-bold text-[13px]">{doc.visits}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--gold)" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span className="num font-bold text-[13px]">{doc.rating}</span>
                    </div>
                  </td>
                  <td>
                    <span className={statusCfg.cls}>{statusCfg.label}</span>
                  </td>
                  <td>
                    <div className="flex gap-1.5 justify-end">
                      <button
                        className="btn btn-q px-3 py-1.5 text-[11.5px] min-h-8"
                        onClick={() => setFileModal({ open: true, doctor: doc, index: idx })}
                      >
                        الملف
                      </button>
                      <RowMenu
                        onViewFile={()   => setFileModal({ open: true, doctor: doc, index: idx })}
                        onEdit={()       => setEditModal({ open: true, doctor: doc })}
                        onSchedule={()   => setScheduleModal({ open: true, doctor: doc })}
                        onDeactivate={()  => {
                          showToast(`تم إلغاء تفعيل ${doc.name}`)
                          setLocalDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'inactive' } : d))
                        }}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <DoctorFileModal
        open={fileModal.open}
        onClose={() => setFileModal({ open: false, doctor: null, index: 0 })}
        doctor={fileModal.doctor}
        index={fileModal.index}
      />
      <DoctorEditModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, doctor: null })}
        doctor={editModal.doctor}
        onSave={handleSave}
      />
      <DoctorScheduleModal
        open={scheduleModal.open}
        onClose={() => setScheduleModal({ open: false, doctor: null })}
        doctor={scheduleModal.doctor}
      />
    </>
  )
}
