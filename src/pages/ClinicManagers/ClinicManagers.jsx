import { useState, useMemo } from 'react'
import { useToast } from '../../components/ui/Toast'
import { useClinicManagers, useDeleteClinicManager } from '../../hooks/queries/useClinicManagers'
import { SkeletonTable } from '../../components/ui/Skeleton'
import NewClinicManagerModal from './components/NewClinicManagerModal'
import EditClinicManagerModal from './components/EditClinicManagerModal'
import './styles/ClinicManagers.css'

const SCOPE_META = {
  all:      { label: 'كل العيادات', color: '#0F6B5C', soft: '#e8f5f2' },
  location: { label: 'موقع',        color: '#2C6DAA', soft: '#e8f0fa' },
  clinic:   { label: 'عيادة',       color: '#7C3AED', soft: '#f0ebfd' },
}

const BG_COLORS = [
  'linear-gradient(135deg,#0F6B5C,#0A4F44)',
  'linear-gradient(135deg,#2C6DAA,#1e4f7e)',
  'linear-gradient(135deg,#7C3AED,#5B21B6)',
  'linear-gradient(135deg,#D97706,#b45309)',
  'linear-gradient(135deg,#DB2777,#9d174d)',
]

const SCOPE_FILTERS = [
  { id: 'all',      label: 'الكل' },
  { id: 'all_c',    label: 'كل العيادات', scope: 'all' },
  { id: 'location', label: 'موقع',        scope: 'location' },
  { id: 'clinic',   label: 'عيادة',       scope: 'clinic' },
]

export default function ClinicManagers() {
  const { showToast } = useToast()
  const [search, setSearch]             = useState('')
  const [scopeFilter, setScopeFilter]   = useState('all')
  const [modalOpen, setModalOpen]       = useState(false)
  const [editingManager, setEditingManager] = useState(null)

  const { data: managers = [], isLoading } = useClinicManagers()
  const deleteManager = useDeleteClinicManager()

  const filtered = useMemo(() => managers.filter(m => {
    const matchScope  = scopeFilter === 'all' || m.management_scope === scopeFilter
    const matchSearch = !search.trim() ||
      m.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      m.email.toLowerCase().includes(search.trim().toLowerCase())
    return matchScope && matchSearch
  }), [managers, search, scopeFilter])

  async function handleDelete(id) {
    try {
      await deleteManager.mutateAsync(id)
      showToast('تم حذف المدير')
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحذف', 'error')
    }
  }

  return (
    <div className="clinic-managers-page">
      {/* Header */}
      <div className="page-head">
        <div>
          <h1>مديرو العيادات</h1>
          <div className="sub">{managers.length} مدير</div>
        </div>
        <button className="btn btn-p" onClick={() => setModalOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 5.5v13M5.5 12h13"/></svg>
          مدير جديد
        </button>
      </div>

      {/* Filters */}
      <div className="cm-toolbar">
        <div className="cm-search-wrap">
          <svg width="13" height="13" viewBox="0 0 24 24" stroke="var(--ink-45)" fill="none" strokeWidth="2" strokeLinecap="round" className="cm-search-icon">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="inp cm-search-inp"
            placeholder="ابحث بالاسم أو الإيميل…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-bar cm-filter-bar">
          {SCOPE_FILTERS.map(f => (
            <div
              key={f.id}
              className={`filter-chip${scopeFilter === (f.scope ?? 'all') ? ' active' : ''}`}
              onClick={() => setScopeFilter(f.scope ?? 'all')}
            >
              {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="panel cm-loading-panel"><SkeletonTable rows={5} cols={5} /></div>
      ) : (
        <div className="panel cm-table-panel">
          <table className="data">
            <thead>
              <tr>
                <th>المدير</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>نطاق الصلاحية</th>
                <th>العيادة / الموقع</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="cm-empty">لا توجد نتائج</td></tr>
              ) : filtered.map((m, idx) => {
                const scope       = SCOPE_META[m.management_scope] || SCOPE_META.clinic
                const clinic      = m.clinic?.name?.ar || '—'
                const location    = m.location?.name?.ar || '—'
                const city        = m.location?.city?.name?.ar || ''
                const area        = m.location?.area?.name?.ar || ''
                const locationStr = [location, city, area].filter(Boolean).join(' · ')

                return (
                  <tr key={m.id}>
                    <td>
                      <div className="cm-manager-cell">
                        <div className="cm-avatar" style={{ background: BG_COLORS[idx % BG_COLORS.length] }}>
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div className="td-name">{m.name}</div>
                          <div className="td-sub">{m.app_lang === 'ar' ? 'عربي' : 'English'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="cm-cell-email" dir="ltr">{m.email}</td>
                    <td className="cm-cell-phone" dir="ltr">{m.phone || '—'}</td>
                    <td>
                      <span className="cm-scope-badge" style={{ background: scope.soft, color: scope.color }}>
                        {scope.label}
                      </span>
                    </td>
                    <td className="cm-cell-scope-val">
                      {m.management_scope === 'clinic'   && clinic}
                      {m.management_scope === 'location' && locationStr}
                      {m.management_scope === 'all'      && <span className="cm-cell-scope-all">جميع العيادات</span>}
                    </td>
                    <td>
                      <div className="cm-row-actions">
                        <button className="btn btn-q cm-edit-btn" onClick={() => setEditingManager(m)}>تعديل</button>
                        <button className="btn cm-delete-btn" onClick={() => handleDelete(m.id)}>حذف</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <NewClinicManagerModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EditClinicManagerModal manager={editingManager} onClose={() => setEditingManager(null)} />
    </div>
  )
}
