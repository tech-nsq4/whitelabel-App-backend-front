import { useState } from 'react'
import AppointmentDetailsModal from '../../Calendar/components/AppointmentDetailsModal'

const STATUS_CONFIG = {
  in_exam: { label: 'في الكشف',    cls: 'info' },
  waiting:  { label: 'في الانتظار', cls: 'warn' },
  called:   { label: 'نودي',        cls: 'info' },
  done:     { label: 'أنهى',        cls: 'ok'   },
}

export default function QueueTable({ entries, onCallPatient, onFinishExam, onDefer }) {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <>
      <div className="panel queue-table-panel">
        <div className="queue-table-scroll">
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: 60 }}>#</th>
                <th>المريض</th>
                <th>الطبيب</th>
                <th>وقت الوصول</th>
                <th>الحالة</th>
                <th style={{ textAlign: 'left' }}></th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-45)', fontSize: 13 }}>
                    لا توجد مواعيد لهذا اليوم
                  </td>
                </tr>
              ) : entries.map((entry, index) => {
                const statusCfg = STATUS_CONFIG[entry.status] || STATUS_CONFIG.waiting
                return (
                  <tr key={entry.id}>
                    <td>
                      <div className="num" style={{ fontFamily: "'Readex Pro'", fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
                        {index + 1}
                      </div>
                    </td>
                    <td>
                      <div className="td-lead">
                        <div className="avatar">{entry.initial}</div>
                        <div>
                          <div className="td-name">{entry.name}</div>
                          <div className="td-sub num">{entry.fileNo}</div>
                        </div>
                      </div>
                    </td>
                    <td>{entry.doctor}</td>
                    <td className="num">{entry.arrivedAt}</td>
                    <td>
                      <span className={`chip ${statusCfg.cls}`}>{statusCfg.label}</span>
                    </td>
                    <td style={{ textAlign: 'left' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        {entry.status === 'in_exam' && (
                          <button className="btn btn-p" style={{ padding: '6px 12px', fontSize: 11.5 }}
                            onClick={() => onFinishExam(entry.id)}>
                            إنهاء
                          </button>
                        )}
                        {entry.status === 'waiting' && (
                          <>
                            <button className="btn btn-p" style={{ padding: '6px 12px', fontSize: 11.5 }}
                              onClick={() => onCallPatient(entry.id)}>
                              بدء الكشف
                            </button>
                            <button className="btn btn-q" style={{ padding: '6px 10px', fontSize: 11.5 }}
                              onClick={() => onDefer(entry.id)}>
                              أجّل
                            </button>
                          </>
                        )}
                        {(entry.status === 'called' || entry.status === 'done') && (
                          <button className="btn btn-q" style={{ padding: '6px 12px', fontSize: 11.5 }}
                            onClick={() => setSelectedId(entry.id)}>
                            الملف
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AppointmentDetailsModal
        appointmentId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </>
  )
}
