import { useState, useMemo } from 'react'
import { auditLogs, actionFilters } from './audit.data'
import { useToast } from '../../components/ui/Toast'

export default function Audit() {
  const { showToast } = useToast()
  const [search, setSearch]             = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchFilter =
        activeFilter === 'all' || log.actionType === activeFilter

      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        log.action.includes(q) ||
        log.user.includes(q) ||
        log.context.includes(q)

      return matchFilter && matchSearch
    })
  }, [search, activeFilter])

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-head">
        <div>
          <h1>سجل النشاط</h1>
          <div className="sub">كل العمليات المسجلة في النظام</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-q" onClick={() => showToast('جارٍ تصدير السجل...')}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 15V4M12 15l-4-4M12 15l4-4"/>
              <path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17"/>
            </svg>
            تصدير السجل
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="search-box" style={{ width: 300 }}>
            <svg width="15" height="15" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7"/>
              <path d="M20 20l-4-4"/>
            </svg>
            <input
              placeholder="ابحث بالعملية أو المستخدم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-bar" style={{ margin: 0 }}>
            {actionFilters.map((f) => (
              <button
                key={f.id}
                className={`filter-chip${activeFilter === f.id ? ' active' : ''}`}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="panel">
        <table className="data">
          <thead>
            <tr>
              <th>الوقت</th>
              <th>المستخدم</th>
              <th>العملية</th>
              <th>السياق</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id}>
                <td className="num">{log.time}</td>
                <td>
                  <div className="td-lead">
                    <div
                      className="avatar"
                      style={{ width: 28, height: 28, borderRadius: 7, fontSize: 10 }}
                    >
                      {log.initial}
                    </div>
                    <div className="td-name">{log.user}</div>
                  </div>
                </td>
                <td>{log.action}</td>
                <td style={{ color: 'var(--ink-45)' }}>{log.context}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
