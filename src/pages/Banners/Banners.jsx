import { useState } from 'react'
import { useBanners, useDeleteBanner } from '../../hooks/queries/useBanners'
import { useToast } from '../../components/ui/Toast'
import { SkeletonTable } from '../../components/ui/Skeleton'
import BannerFormModal from './components/BannerFormModal'
import BannerViewModal from './components/BannerViewModal'
import './Banners.css'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

function EditIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" {...S}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}
function EyeIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" {...S}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
}
function TrashIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" {...S}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
}
function ImageIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" {...S}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
}

export default function Banners() {
  const { showToast } = useToast()
  const { data: banners = [], isLoading } = useBanners()
  const deleteBanner = useDeleteBanner()

  const [formOpen, setFormOpen] = useState(false)
  const [editBanner, setEditBanner] = useState(null)
  const [viewBanner, setViewBanner] = useState(null)

  function openNew() { setEditBanner(null); setFormOpen(true) }
  function openEdit(b) { setEditBanner(b); setFormOpen(true) }
  function closeForm() { setFormOpen(false); setEditBanner(null) }

  async function handleDelete(id) {
    if (!confirm('هل تريد حذف هذا البانر؟')) return
    try {
      await deleteBanner.mutateAsync(id)
      showToast('تم حذف البانر', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحذف', 'error')
    }
  }

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>البانرات الإعلانية</h1>
          <div className="sub">{banners.length} بانر</div>
        </div>
        <button className="btn btn-p" onClick={openNew}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5.5v13M5.5 12h13" />
          </svg>
          إضافة بانر
        </button>
      </div>

      <div className="panel">
        {isLoading ? (
          <SkeletonTable rows={4} cols={5} />
        ) : banners.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--ink-45)', fontSize: 13 }}>
            لا توجد بانرات حتى الآن
          </div>
        ) : (
          <div className="banners-table-wrap">
            <table className="banners-table">
              <thead>
                <tr>
                  <th>الصورة</th>
                  <th>العنوان (عربي)</th>
                  <th>العنوان (إنجليزي)</th>
                  <th>العرض المرتبط</th>
                  <th>تاريخ الإنشاء</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b.id}>
                    <td>
                      {b.image ? (
                        <img src={b.image} alt={b.title?.ar} className="banner-thumb" />
                      ) : (
                        <div className="banner-thumb-placeholder">
                          <ImageIcon />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 500 }}>{b.title?.ar || '—'}</td>
                    <td dir="ltr" style={{ color: 'var(--ink-70)' }}>{b.title?.en || '—'}</td>
                    <td>
                      {b.offer ? (
                        <span className="banner-offer-badge">
                          {b.offer.name?.ar || `عرض #${b.offer_id}`}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--ink-25)', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td style={{ color: 'var(--ink-45)', fontSize: 12 }}>
                      {b.created_at ? new Date(b.created_at).toLocaleDateString('ar-EG') : '—'}
                    </td>
                    <td>
                      <div className="banner-actions">
                        <button
                          className="banner-icon-btn"
                          title="عرض"
                          onClick={() => setViewBanner(b)}
                        >
                          <EyeIcon />
                        </button>
                        <button
                          className="banner-icon-btn"
                          title="تعديل"
                          onClick={() => openEdit(b)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="banner-icon-btn danger"
                          title="حذف"
                          onClick={() => handleDelete(b.id)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BannerFormModal open={formOpen} onClose={closeForm} banner={editBanner} />
      <BannerViewModal open={!!viewBanner} onClose={() => setViewBanner(null)} banner={viewBanner} />
    </div>
  )
}
