import { useState } from 'react'
import { useDoctorReviews, useDeleteDoctorReview } from '../../hooks/queries/useDoctorReviews'
import { useToast } from '../../components/ui/Toast'
import { SkeletonTable } from '../../components/ui'
import ReviewDetailsModal from './components/ReviewDetailsModal'

function Stars({ rate }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i <= rate ? '#F59E0B' : 'none'}
          stroke={i <= rate ? '#F59E0B' : 'var(--ink-30)'}
          strokeWidth="1.8">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

export default function DoctorReviews() {
  const { data = [], isLoading } = useDoctorReviews()
  const { mutate: deleteReview } = useDeleteDoctorReview()
  const { showToast } = useToast()
  const [modal, setModal] = useState({ open: false, review: null })
  const [search, setSearch] = useState('')

  const filtered = data.filter((r) => {
    const q = search.toLowerCase()
    return (
      r.doctor?.name?.ar?.toLowerCase().includes(q) ||
      r.user?.name?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q)
    )
  })

  // summary stats
  const avgRate = data.length ? (data.reduce((s, r) => s + r.rate, 0) / data.length).toFixed(1) : 0
  const fiveStars = data.filter(r => r.rate === 5).length
  const lowStars  = data.filter(r => r.rate <= 2).length

  function handleDelete(id) {
    if (!confirm('هل تريد حذف هذا التقييم؟')) return
    deleteReview(id, {
      onSuccess: () => showToast('تم حذف التقييم', 'success'),
      onError:   () => showToast('حدث خطأ', 'error'),
    })
  }

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>تقييمات الأطباء</h1>
          <div className="sub">آراء المرضى حول الأطباء</div>
        </div>
      </div>

      {/* Stats */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'إجمالي التقييمات', value: data.length, bg: '#eff5fd', ic: '#2C6DAA', icBg: 'rgba(44,109,170,0.12)' },
          { label: 'متوسط التقييم',    value: avgRate,      bg: '#fdf8ec', ic: '#C9A227', icBg: 'rgba(201,162,39,0.12)', unit: '/ 5' },
          { label: 'تقييمات 5 نجوم',  value: fiveStars,    bg: '#f0faf7', ic: '#0F6B5C', icBg: 'rgba(15,107,92,0.12)' },
          { label: 'تقييمات منخفضة',  value: lowStars,     bg: '#fdf2f0', ic: '#B3402F', icBg: 'rgba(179,64,47,0.12)' },
        ].map((s) => (
          <div key={s.label} className="kpi-card" style={{ background: s.bg, border: 'none' }}>
            <div className="kpi-card-accent" style={{ background: s.ic }} />
            <div className="kpi-card-head">
              <span className="kpi-card-label">{s.label}</span>
              <div className="kpi-card-icon" style={{ background: s.icBg, color: s.ic }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
            </div>
            <div className="kpi-card-value">{s.value}{s.unit && <span className="kpi-card-unit">{s.unit}</span>}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="panel" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <input
          className="inp"
          placeholder="ابحث باسم الطبيب أو المريض أو التعليق..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      {isLoading && <SkeletonTable />}

      {!isLoading && (
        <div className="panel">
          <table className="data">
            <thead>
              <tr>
                <th>#</th>
                <th>المريض</th>
                <th>الطبيب</th>
                <th>العيادة</th>
                <th>التقييم</th>
                <th>التعليق</th>
                <th>التاريخ</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td><span className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)' }}>#{r.id}</span></td>
                  <td><div className="td-name">{r.user?.name || r.user?.phone}</div></td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-70)' }}>{r.doctor?.name?.ar}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-70)' }}>{r.clinic?.name?.ar}</td>
                  <td><Stars rate={r.rate} /></td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-70)', maxWidth: 200 }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {r.comment || '—'}
                    </span>
                  </td>
                  <td className="num" style={{ fontSize: 12.5 }}>{r.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      <button className="icon-btn" style={{ width: 32, height: 32 }}
                        onClick={() => setModal({ open: true, review: r })} aria-label="عرض">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button className="icon-btn" style={{ width: 32, height: 32, color: 'var(--danger)' }}
                        onClick={() => handleDelete(r.id)} aria-label="حذف">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-45)', fontSize: 13 }}>لا توجد تقييمات</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ReviewDetailsModal
        open={modal.open}
        onClose={() => setModal({ open: false, review: null })}
        review={modal.review}
      />
    </div>
  )
}
