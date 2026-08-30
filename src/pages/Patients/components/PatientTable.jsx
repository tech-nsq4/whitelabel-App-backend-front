import { useState } from 'react'
import { useToast } from '../../../components/ui/Toast'
import PatientFileModal from './PatientFileModal'
import PatientEditModal from './PatientEditModal'
import { useDeletePatient } from '../../../hooks/queries/usePatients'

const FILE_ICON = (
  <svg width="12" height="12" viewBox="0 0 24 24">
    <path d="M13.5 3H6.5A1.5 1.5 0 005 4.5v15A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V8.5z"/>
    <path d="M13.5 3v5.5H19"/>
  </svg>
)

const MORE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <circle cx="6" cy="12" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="18" cy="12" r="1.5"/>
  </svg>
)

function getInitial(name) {
  if (!name) return '؟'
  return name.trim().charAt(0).toUpperCase()
}

const PAGE_SIZE = 10

export default function PatientTable({ patients, currentPage, onPageChange, isLoading }) {
  const { showToast } = useToast()
  const deletePatient = useDeletePatient()

  const [selectedPatient,  setSelectedPatient]  = useState(null)
  const [editingPatient,   setEditingPatient]   = useState(null)
  const [actionsFor,       setActionsFor]       = useState(null)
  const [confirmDelete,    setConfirmDelete]    = useState(null)
  const [hoverPatient,     setHoverPatient]     = useState(null)
  const [hoverPos,         setHoverPos]         = useState({ x: 0, y: 0 })

  const totalPages = Math.max(1, Math.ceil(patients.length / PAGE_SIZE))
  const paged      = patients.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const pageStart  = (currentPage - 1) * PAGE_SIZE + 1
  const pageEnd    = Math.min(currentPage * PAGE_SIZE, patients.length)

  function handleDelete(patient) {
    setConfirmDelete(patient)
    setActionsFor(null)
  }

  function confirmDeletePatient() {
    deletePatient.mutate(confirmDelete.id, {
      onSuccess: () => { showToast('تم حذف المريض'); setConfirmDelete(null) },
      onError:   (err) => {
        console.error('Delete error:', err?.response?.status, err?.response?.data)
        showToast(`خطأ: ${err?.response?.data?.message ?? err?.message ?? 'حدث خطأ أثناء الحذف'}`)
        setConfirmDelete(null)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="panel" style={{ padding: 32, textAlign: 'center', color: 'var(--ink-45)' }}>
        جارٍ تحميل بيانات المرضى...
      </div>
    )
  }

  if (!patients.length) {
    return (
      <div className="panel" style={{ padding: 32, textAlign: 'center', color: 'var(--ink-45)' }}>
        لا يوجد مرضى
      </div>
    )
  }

  return (
    <div className="panel patients-table-panel">
      <div className="patients-table-scroll">
        <table className="data">
          <thead>
            <tr>
              <th>المريض</th>
              <th>الجوال</th>
              <th>البريد الإلكتروني</th>
              <th>المواعيد</th>
              <th>أفراد العائلة</th>
              <th>الحالة</th>
              <th style={{ textAlign: 'left' }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p) => (
              <tr key={p.id}
                onMouseEnter={e => { if (!actionsFor) { setHoverPatient(p); setHoverPos({ x: e.clientX, y: e.clientY }) } }}
                onMouseMove={e => { if (!actionsFor) setHoverPos({ x: e.clientX, y: e.clientY }) }}
                onMouseLeave={() => setHoverPatient(null)}
              >
                <td>
                  <div className="td-lead">
                    <div className="avatar">{getInitial(p.name)}</div>
                    <div>
                      <div className="td-name">{p.name ?? '—'}</div>
                      <div className="td-sub num">#{p.id}</div>
                    </div>
                  </div>
                </td>
                <td className="num" dir="ltr" style={{ textAlign: 'right' }}>{p.phone}</td>
                <td>{p.email ?? '—'}</td>
                <td><span className="num" style={{ fontWeight: 600 }}>{p.appointments_count ?? 0}</span> موعد</td>
                <td>{p.family_members_count ?? 0}</td>
                <td>
                  {p.phone_verified_at
                    ? <span className="chip ok">موثق</span>
                    : <span className="chip mut">غير موثق</span>}
                </td>
                <td style={{ textAlign: 'left' }}>
                  <div className="patient-row-actions">
                    <button
                      className="btn btn-g"
                      style={{ padding: '6px 10px', fontSize: '11.5px' }}
                      onClick={() => setSelectedPatient(p)}
                    >
                      {FILE_ICON} الملف
                    </button>
                    <div className="patient-more-menu">
                      <button
                        className="icon-btn"
                        style={{ width: 30, height: 30 }}
                        aria-label="المزيد"
                        aria-expanded={actionsFor === p.id}
                        onClick={() => setActionsFor((id) => { setHoverPatient(null); return id === p.id ? null : p.id })}
                      >
                        {MORE_ICON}
                      </button>
                      {actionsFor === p.id && (
                        <div className="patient-actions-dropdown">
                          <button onClick={() => { setSelectedPatient(p); setActionsFor(null) }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M13.5 3H6.5A1.5 1.5 0 005 4.5v15A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V8.5z"/><path d="M13.5 3v5.5H19"/></svg>
                            الملف الطبي
                          </button>
                          <button onClick={() => { setActionsFor(null) }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                            حجز موعد
                          </button>
                          <button onClick={() => { setEditingPatient(p); setActionsFor(null) }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            تعديل البيانات
                          </button>
                          <button onClick={() => { setActionsFor(null) }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                            إرسال رسالة
                          </button>
                          <button onClick={() => { setActionsFor(null) }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            طباعة البطاقة
                          </button>
                          <div style={{ borderTop: '1px solid var(--line)', margin: '4px 0' }} />
                          <button style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            تعطيل الملف
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="patients-pagination">
        <div style={{ fontSize: '11.5px', color: 'var(--ink-45)' }}>
          عرض {pageStart}–{pageEnd} من أصل {patients.length.toLocaleString('ar-SA')}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className="btn btn-g"
            style={{ padding: '6px 10px' }}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M9.5 6l6 6-6 6"/></svg>
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`btn ${currentPage === p ? 'btn-p' : 'btn-g'}`}
              style={{ padding: '6px 12px' }}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}
          {totalPages > 5 && <span style={{ padding: '6px 8px', color: 'var(--ink-45)' }}>...</span>}
          <button
            className="btn btn-g"
            style={{ padding: '6px 10px' }}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M14.5 6l-6 6 6 6"/></svg>
          </button>
        </div>
      </div>

      {hoverPatient && (
        <PatientHoverCard patient={hoverPatient} pos={hoverPos} />
      )}
      <PatientFileModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />      <PatientEditModal
        patient={editingPatient}
        onClose={() => setEditingPatient(null)}
        onSave={() => setEditingPatient(null)}
      />

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: 'var(--surface, #fff)', borderRadius: 12, padding: 28,
            minWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,.18)', textAlign: 'center'
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>تأكيد الحذف</div>
            <div style={{ fontSize: 13, color: 'var(--ink-55, #555)', marginBottom: 20 }}>
              هل تريد حذف المريض <strong>{confirmDelete.name ?? confirmDelete.phone}</strong>؟<br/>
              لا يمكن التراجع عن هذا الإجراء.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button className="btn btn-q" onClick={() => setConfirmDelete(null)} disabled={deletePatient.isPending}>إلغاء</button>
              <button
                className="btn"
                style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', cursor: 'pointer' }}
                onClick={confirmDeletePatient}
                disabled={deletePatient.isPending}
              >
                {deletePatient.isPending ? 'جارٍ الحذف...' : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PatientHoverCard({ patient: p, pos }) {
  const GENDER = { male: 'ذكر', female: 'أنثى' }
  const right = window.innerWidth - pos.x > 320 ? pos.x + 16 : pos.x - 316
  const top = Math.min(pos.y - 20, window.innerHeight - 320)

  return (
    <div style={{
      position: 'fixed', top, left: right, zIndex: 9999,
      width: 300, background: 'var(--card)', borderRadius: 14,
      boxShadow: '0 8px 32px rgba(10,31,27,.18)', border: '1px solid var(--line)',
      padding: 16, pointerEvents: 'none',
      animation: 'fadeIn .15s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
          {getInitial(p.name)}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-45)' }}>ملف #{p.id} · {p.phone}</div>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        {[
          { label: 'الجنس', value: GENDER[p.gender] || '—' },
          { label: 'العمر', value: p.age ? `${p.age} سنة` : '—' },
          { label: 'فصيلة الدم', value: p.blood_type || '—' },
          { label: 'الحساسية', value: p.allergies || '—' },
        ].map(f => (
          <div key={f.label} style={{ background: 'var(--paper)', borderRadius: 8, padding: '7px 10px' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-45)', marginBottom: 2 }}>{f.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{f.value}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: 'var(--sand)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand)' }}>{p.appointments_count ?? 0}</div>
          <div style={{ fontSize: 10, color: 'var(--ink-45)' }}>إجمالي الزيارات</div>
        </div>
        <div style={{ background: 'var(--sand)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand)' }}>{p.family_members_count ?? 0}</div>
          <div style={{ fontSize: 10, color: 'var(--ink-45)' }}>أفراد العائلة</div>
        </div>
      </div>
    </div>
  )
}
