import { useState } from 'react'
import { useContactMessages } from '../../hooks/queries/useContactMessages'
import { SkeletonTable } from '../../components/ui/Skeleton'
import ContactMessageModal from './components/ContactMessageModal'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...S}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

const PAGE_SIZE = 15

export default function ContactMessages() {
  const [filters, setFilters] = useState({ name: '', email: '', subject: '' })
  const [applied, setApplied] = useState({})
  const [page, setPage]       = useState(1)
  const [viewId, setViewId]   = useState(null)

  // نبعت الـ filters للسيرفر + page
  const queryParams = { ...applied, page }
  const { data: res, isLoading, isError } = useContactMessages(queryParams)

  // الـ API ممكن يرجع { data: [...], meta: {...} } أو { data: { data: [...], meta: {...} } }
  const messages  = res?.data?.data ?? res?.data ?? []
  const meta      = (res?.data?.meta) ?? (res?.meta) ?? null
  const totalPages = meta?.last_page ?? (Math.ceil((meta?.total ?? messages.length) / PAGE_SIZE) || 1)

  function handleSearch(e) {
    e.preventDefault()
    // نحذف الـ keys الفاضية من الـ params
    const clean = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v.trim() !== '')
    )
    setApplied(clean)
    setPage(1)
  }

  function handleReset() {
    setFilters({ name: '', email: '', subject: '' })
    setApplied({})
    setPage(1)
  }

  function set(k, v) { setFilters(p => ({ ...p, [k]: v })) }

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>رسائل التواصل</h1>
          <div className="sub">
            {meta?.total != null ? `${meta.total} رسالة` : isLoading ? 'جاري التحميل...' : `${messages.length} رسالة`}
          </div>
        </div>
      </div>

      {/* Filters */}
      <form className="panel" style={{ padding: '16px 20px' }} onSubmit={handleSearch}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 1, minWidth: 160, marginBottom: 0 }}>
            <label className="field-label">الاسم</label>
            <input
              className="inp"
              placeholder="ابحث بالاسم..."
              value={filters.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
            <label className="field-label">البريد الإلكتروني</label>
            <input
              className="inp"
              placeholder="‎example@email.com"
              value={filters.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
            <label className="field-label">الموضوع</label>
            <input
              className="inp"
              placeholder="ابحث بالموضوع..."
              value={filters.subject}
              onChange={e => set('subject', e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button type="submit" className="btn btn-p" style={{ height: 40 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" {...S}>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              بحث
            </button>
            {Object.keys(applied).length > 0 && (
              <button type="button" className="btn btn-q" style={{ height: 40 }} onClick={handleReset}>
                مسح
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="panel">
        {isError ? (
          <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--danger)', fontSize: 13 }}>
            تعذر تحميل الرسائل. يرجى تحديث الصفحة.
          </div>
        ) : isLoading ? (
          <SkeletonTable rows={6} cols={5} />
        ) : messages.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--ink-45)', fontSize: 13 }}>
            لا توجد رسائل مطابقة
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="data" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم</th>
                    <th>البريد الإلكتروني</th>
                    <th>الموضوع</th>
                    <th>رقم الهاتف</th>
                    <th>التاريخ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m.id}>
                      <td style={{ color: 'var(--ink-45)', fontSize: 12 }}>#{m.id}</td>
                      <td style={{ fontWeight: 500 }}>{m.name || '—'}</td>
                      <td dir="ltr" style={{ color: 'var(--ink-70)', fontSize: 13 }}>{m.email || '—'}</td>
                      <td style={{ maxWidth: 220 }}>
                        <span style={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {m.subject || '—'}
                        </span>
                      </td>
                      <td dir="ltr" style={{ fontSize: 13, color: 'var(--ink-70)' }}>{m.phone || '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--ink-45)', whiteSpace: 'nowrap' }}>
                        {m.created_at ? new Date(m.created_at).toLocaleDateString('ar-EG') : '—'}
                      </td>
                      <td>
                        <button
                          className="btn btn-q"
                          style={{ padding: '5px 10px', fontSize: 12, gap: 5 }}
                          onClick={() => setViewId(m.id)}
                        >
                          <EyeIcon /> عرض
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, color: 'var(--ink-45)' }}>
                  {meta ? `صفحة ${meta.current_page} من ${meta.last_page}` : `صفحة ${page}`}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn btn-q"
                    style={{ padding: '5px 10px' }}
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" {...S}><path d="M9.5 6l6 6-6 6" /></svg>
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = totalPages <= 7 ? i + 1 : Math.max(1, page - 3) + i
                    if (p > totalPages) return null
                    return (
                      <button
                        key={p}
                        className={`btn ${page === p ? 'btn-p' : 'btn-q'}`}
                        style={{ padding: '5px 11px', minWidth: 34 }}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    )
                  })}
                  <button
                    className="btn btn-q"
                    style={{ padding: '5px 10px' }}
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" {...S}><path d="M14.5 6l-6 6 6 6" /></svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ContactMessageModal
        open={!!viewId}
        onClose={() => setViewId(null)}
        messageId={viewId}
      />
    </div>
  )
}
