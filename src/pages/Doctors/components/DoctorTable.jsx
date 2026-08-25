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

const BG_COLORS = [
  'linear-gradient(135deg,#0F6B5C,#0A4F44)',
  'linear-gradient(135deg,#2C6DAA,#1e4f7e)',
  'linear-gradient(135deg,#7C3AED,#5B21B6)',
  'linear-gradient(135deg,#D97706,#b45309)',
  'linear-gradient(135deg,#DB2777,#9d174d)',
  'linear-gradient(135deg,#0891B2,#0e7490)',
  'linear-gradient(135deg,#059669,#047857)',
  'linear-gradient(135deg,#9333EA,#7e22ce)',
]

function RowMenu({ onViewFile, onEdit, onSchedule, onDeactivate }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, left: 0 })
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
    { label: 'حذف الطبيب',    action: () => { onDeactivate(); setOpen(false) }, danger: true },
  ]

  return (
    <>
      <button ref={btnRef} className="icon-btn" style={{ width: 32, height: 32 }} aria-label="المزيد" onClick={handleOpen}>
        {MORE_ICON}
      </button>
      {open && (
        <div ref={menuRef} style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, boxShadow: '0 8px 24px rgba(10,31,27,0.12)', minWidth: 155, overflow: 'hidden' }}>
          {items.map((item) => (
            <button key={item.label} onClick={item.action}
              style={{ width: '100%', textAlign: 'right', padding: '10px 14px', fontSize: 12.5, background: 'none', border: 'none', cursor: 'pointer', color: item.danger ? 'var(--danger)' : 'var(--ink)', display: 'block' }}
              onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'rgba(179,64,47,0.06)' : 'var(--paper)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >{item.label}</button>
          ))}
        </div>
      )}
    </>
  )
}

export default function DoctorTable({ doctors, onDelete, onRefresh }) {
  const { showToast } = useToast()
  const [fileModal,     setFileModal]     = useState({ open: false, doctor: null, index: 0 })
  const [editModal,     setEditModal]     = useState({ open: false, doctor: null })
  const [scheduleModal, setScheduleModal] = useState({ open: false, doctor: null })
  const [localDoctors,  setLocalDoctors]  = useState(doctors)

  useEffect(() => { setLocalDoctors(doctors) }, [doctors])

  function handleSave(updated) {
    setLocalDoctors(prev => prev.map(d => d.id === updated.id ? { ...d, ...updated } : d))
    showToast('تم حفظ التغييرات')
    onRefresh && onRefresh()
  }

  if (localDoctors.length === 0) {
    return (
      <div className="panel" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--ink-45)', fontSize: 13 }}>
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
              <th>العيادة</th>
              <th>التخصص</th>
              <th>السعر</th>
              <th>الخبرة</th>
              <th>الحالة</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {localDoctors.map((doc, idx) => {
              const nameAr    = doc.name?.ar || doc.name || ''
              const specialty = doc.specializations?.[0]?.title?.ar || '—'
              const clinicName = doc.clinic?.name?.ar || '—'
              const bg = BG_COLORS[idx % BG_COLORS.length]
              return (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {nameAr.charAt(3) || nameAr.charAt(0)}
                      </div>
                      <div>
                        <div className="td-name">{nameAr}</div>
                        <div className="td-sub">{doc.description?.ar || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-70)' }}>{clinicName}</td>
                  <td><span className="chip mut" style={{ fontSize: 11 }}>{specialty}</span></td>
                  <td><span className="num" style={{ fontWeight: 700 }}>{doc.price}</span> <span style={{ fontSize: 11, color: 'var(--ink-45)' }}>ج.م</span></td>
                  <td><span className="num">{doc.experience}</span> <span style={{ fontSize: 11, color: 'var(--ink-45)' }}>سنة</span></td>
                  <td><span className="chip ok">نشط</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setEditModal({ open: true, doctor: doc })}>
                        <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 3.5l4 4L8 20l-4.5.5L4 16z"/></svg>
                      </button>
                      <RowMenu
                        onViewFile={() => setFileModal({ open: true, doctor: doc, index: idx })}
                        onEdit={() => setEditModal({ open: true, doctor: doc })}
                        onSchedule={() => setScheduleModal({ open: true, doctor: doc })}
                        onDeactivate={() => { onDelete && onDelete(doc.id) }}
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
