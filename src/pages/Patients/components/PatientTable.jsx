import { useState } from 'react'
import { useToast } from '../../../components/ui/Toast'
import PatientFileModal from './PatientFileModal'
import PatientEditModal from './PatientEditModal'

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

const STATUS_CONFIG = {
  active:   { label: 'نشط',      cls: 'ok'  },
  vip:      { label: 'VIP',      cls: 'info' },
  inactive: { label: 'غير نشط', cls: 'mut'  },
}

export default function PatientTable({ patients, currentPage, totalCount, onPageChange, onUpdate }) {
  const { showToast } = useToast()
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [actionsFor, setActionsFor] = useState(null)
  const [editingPatient, setEditingPatient] = useState(null)

  async function copyFileNumber(fileNumber) {
    try { await navigator.clipboard?.writeText(fileNumber) } catch { /* Clipboard may be unavailable in an insecure context. */ }
    showToast('تم نسخ رقم الملف')
  }

  const TOTAL_PAGES = 324
  const pageStart   = (currentPage - 1) * 10 + 1
  const pageEnd     = Math.min(currentPage * 10, totalCount)

  return (
    <div className="panel patients-table-panel">
      <div className="patients-table-scroll">
        <table className="data">
          <thead>
            <tr>
              <th>المريض</th>
              <th>الهوية</th>
              <th>الجوال</th>
              <th>آخر زيارة</th>
              <th>الزيارات</th>
              <th>الحالة</th>
              <th style={{ textAlign: 'left' }}></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => {
              const statusCfg = STATUS_CONFIG[p.status]
              return (
                <tr key={p.id}>
                  <td>
                    <div className="td-lead">
                      <div className="avatar">{p.initial}</div>
                      <div>
                        <div className="td-name">{p.name}</div>
                        <div className="td-sub num">{p.fileNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="num">{p.idNo}</td>
                  <td className="num" dir="ltr" style={{ textAlign: 'right' }}>{p.phone}</td>
                  <td>{p.lastVisit}</td>
                  <td>
                    <span className="num" style={{ fontWeight: 600 }}>{p.visits}</span> زيارة
                  </td>
                  <td>
                    <span className={`chip ${statusCfg.cls}`}>{statusCfg.label}</span>
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
                          onClick={() => setActionsFor((id) => id === p.id ? null : p.id)}
                        >
                          {MORE_ICON}
                        </button>
                        {actionsFor === p.id && (
                          <div className="patient-actions-dropdown">
                            <button onClick={() => { setSelectedPatient(p); setActionsFor(null) }}>عرض الملف</button>
                            <button onClick={() => { setEditingPatient(p); setActionsFor(null) }}>تعديل البيانات</button>
                            <button onClick={() => { copyFileNumber(p.fileNo); setActionsFor(null) }}>نسخ رقم الملف</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="patients-pagination">
        <div style={{ fontSize: '11.5px', color: 'var(--ink-45)' }}>
          عرض {pageStart}-{pageEnd} من أصل {totalCount.toLocaleString('ar-SA')}
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
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className={`btn ${currentPage === p ? 'btn-p' : 'btn-g'}`}
              style={{ padding: '6px 12px' }}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}
          <span style={{ padding: '6px 8px', color: 'var(--ink-45)' }}>...</span>
          <button
            className="btn btn-g"
            style={{ padding: '6px 12px' }}
            onClick={() => onPageChange(TOTAL_PAGES)}
          >
            {TOTAL_PAGES}
          </button>
          <button
            className="btn btn-g"
            style={{ padding: '6px 10px' }}
            disabled={currentPage === TOTAL_PAGES}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M14.5 6l-6 6 6 6"/></svg>
          </button>
        </div>
      </div>
      <PatientFileModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      <PatientEditModal
        patient={editingPatient}
        onClose={() => setEditingPatient(null)}
        onSave={(updatedPatient) => { onUpdate(updatedPatient); setEditingPatient(null); showToast('تم تحديث بيانات المريض') }}
      />
    </div>
  )
}
