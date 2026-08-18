import { useToast } from '../../../components/ui/Toast'

const STATUS_CONFIG = {
  in_exam: { label: 'في الكشف',    cls: 'info' },
  waiting:  { label: 'في الانتظار', cls: 'warn' },
  called:   { label: 'نودي',        cls: 'info' },
  done:     { label: 'أنهى',        cls: 'ok'   },
}

export default function QueueTable({ entries, onCallPatient, onFinishExam, onDefer }) {
  const { showToast } = useToast()

  function handleViewFile() {
    showToast('الملف الطبي')
  }

  return (
    <div className="panel queue-table-panel">
      <div className="queue-table-scroll">
        <table className="data">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>المريض</th>
              <th>الطبيب</th>
              <th>وقت الوصول / الانتظار</th>
              <th>الحالة</th>
              <th style={{ textAlign: 'left' }}></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const statusCfg = STATUS_CONFIG[entry.status]
              return (
                <tr key={entry.id}>
                  <td>
                    <div
                      className="num"
                      style={{ fontFamily: "'Readex Pro'", fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}
                    >
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
                  <td className="num">
                    {entry.arrivedAt}
                    {entry.waitNote && (
                      <span style={{ color: 'var(--ink-45)', fontSize: 11 }}> · {entry.waitNote}</span>
                    )}
                  </td>
                  <td>
                    <span className={`chip ${statusCfg.cls}`}>{statusCfg.label}</span>
                  </td>
                  <td style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      {entry.status === 'in_exam' && (
                        <button
                          className="btn btn-p"
                          style={{ padding: '6px 12px', fontSize: '11.5px' }}
                          onClick={() => onFinishExam(entry.id)}
                        >
                          إنهاء
                        </button>
                      )}
                      {entry.status === 'waiting' && (
                        <>
                          <button
                            className="btn btn-p"
                            style={{ padding: '6px 12px', fontSize: '11.5px' }}
                            onClick={() => onCallPatient(entry.id)}
                          >
                            نادِ للكشف
                          </button>
                          <button
                            className="btn btn-q"
                            style={{ padding: '6px 10px', fontSize: '11.5px' }}
                            onClick={() => onDefer(entry.id)}
                          >
                            أجّل
                          </button>
                        </>
                      )}
                      {(entry.status === 'called' || entry.status === 'done') && (
                        <button
                          className="btn btn-g"
                          style={{ padding: '6px 12px', fontSize: '11.5px' }}
                          onClick={handleViewFile}
                        >
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
  )
}
