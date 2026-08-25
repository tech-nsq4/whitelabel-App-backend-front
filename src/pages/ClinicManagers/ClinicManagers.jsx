import { useState, useMemo } from 'react'
import { useToast } from '../../components/ui/Toast'
import { useClinicManagers, useDeleteClinicManager } from '../../hooks/queries/useClinicManagers'
import { SkeletonTable } from '../../components/ui/Skeleton'
import NewClinicManagerModal from './components/NewClinicManagerModal'
import EditClinicManagerModal from './components/EditClinicManagerModal'

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

export default function ClinicManagers() {
  const { showToast } = useToast()
  const [search, setSearch]           = useState('')
  const [scopeFilter, setScopeFilter] = useState('all')
  const [modalOpen, setModalOpen]     = useState(false)
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
    <div style={{ animation: 'fadeIn .3s ease' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" stroke="var(--ink-45)" fill="none" strokeWidth="2" strokeLinecap="round"
            style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input className="inp" style={{ paddingRight: 34, minHeight: 38, fontSize: 12.5 }}
            placeholder="ابحث بالاسم أو الإيميل…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="filter-bar" style={{ margin: 0, gap: 6 }}>
          {[
            { id: 'all',      label: 'الكل' },
            { id: 'all',      label: 'كل العيادات', scope: 'all' },
            { id: 'location', label: 'موقع',        scope: 'location' },
            { id: 'clinic',   label: 'عيادة',       scope: 'clinic' },
          ].filter((f, i, arr) => i === 0 || f.scope)
          .map(f => (
            <div key={f.id + (f.scope || '')}
              className={`filter-chip${scopeFilter === (f.scope ?? 'all') && (f.scope !== undefined || scopeFilter === 'all') ? ' active' : ''}`}
              onClick={() => setScopeFilter(f.scope ?? 'all')}>
              {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="panel" style={{ padding: 24 }}><SkeletonTable rows={5} cols={5} /></div>
      ) : (
        <div className="panel" style={{ padding: 0 }}>
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
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--ink-45)', fontSize: 13 }}>لا توجد نتائج</td></tr>
              ) : filtered.map((m, idx) => {
                const scope   = SCOPE_META[m.management_scope] || SCOPE_META.clinic
                const clinic  = m.clinic?.name?.ar || '—'
                const location = m.location?.name?.ar || '—'
                const city    = m.location?.city?.name?.ar || ''
                const area    = m.location?.area?.name?.ar || ''
                const locationStr = [location, city, area].filter(Boolean).join(' · ')

                return (
                  <tr key={m.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: BG_COLORS[idx % BG_COLORS.length], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div className="td-name">{m.name}</div>
                          <div className="td-sub">{m.app_lang === 'ar' ? 'عربي' : 'English'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--ink-70)' }} dir="ltr">{m.email}</td>
                    <td style={{ fontSize: 12.5 }} dir="ltr">{m.phone || '—'}</td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: scope.soft, color: scope.color }}>
                        {scope.label}
                      </span>
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--ink-70)' }}>
                      {m.management_scope === 'clinic'   && clinic}
                      {m.management_scope === 'location' && locationStr}
                      {m.management_scope === 'all'      && <span style={{ color: 'var(--ink-45)', fontStyle: 'italic' }}>جميع العيادات</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-q"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                          onClick={() => setEditingManager(m)}>
                          تعديل
                        </button>
                        <button
                          className="btn"
                          style={{ padding: '6px 12px', fontSize: 12, color: 'var(--danger)', background: 'rgba(179,64,47,.07)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                          onClick={() => handleDelete(m.id)}>
                          حذف
                        </button>
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
