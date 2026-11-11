import { useState, useMemo } from 'react'
import {
  Package2, Plus, Pencil, Trash2,
  BookOpen, Tag, CalendarCheck, Coins,
} from 'lucide-react'
import { usePackages, useDeletePackage } from '../../hooks/queries/usePackages'
import { useToast } from '../../components/ui/Toast'
import { SkeletonTable } from '../../components/ui/Skeleton'
import NewPackageModal from './components/NewPackageModal'
import PackageEditModal from './components/PackageEditModal'
import './Packages.css'

/* ── Type config ──────────────────────────── */
const TYPE_CFG = {
  specialization: { label: 'تخصص', color: '#0F6B5C', bg: 'rgba(15,107,92,0.1)'  },
  offer:          { label: 'عرض',  color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
}

const STATUS_CFG = {
  active:   { label: 'نشط',   color: '#0F6B5C', bg: 'rgba(15,107,92,0.08)'   },
  inactive: { label: 'متوقف', color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
}

/* ── PackageCard ──────────────────────────── */
function PackageCard({ pkg, onEdit, onDelete }) {
  const typeCfg   = TYPE_CFG[pkg.type]     || TYPE_CFG.specialization
  const statusCfg = STATUS_CFG[pkg.status] || STATUS_CFG.inactive
  const isOffer   = pkg.type === 'offer'

  const tags = isOffer
    ? (pkg.offers || []).map(o => o.name?.ar || o.name)
    : (pkg.specializations || []).map(s => s.title?.ar || s.title)

  return (
    <div className="pkg-card">



      <div className="pkg-card-body">

        {/* ── header: icon + title + type badge ── */}
        <div className="pkg-card-head">
          <div
            className="pkg-card-icon-wrap"
            style={{ background: typeCfg.bg, color: typeCfg.color }}
          >
            {isOffer
              ? <Tag size={20} strokeWidth={1.6} />
              : <BookOpen size={20} strokeWidth={1.6} />}
          </div>

          <div className="pkg-card-titles">
            <div className="pkg-card-name">{pkg.name?.ar}</div>
            <div className="pkg-card-name-en">{pkg.name?.en}</div>
          </div>

          <span
            className="pkg-type-badge"
            style={{ color: typeCfg.color, background: typeCfg.bg }}
          >
            {typeCfg.label}
          </span>
        </div>

        {/* ── divider ── */}
        <div className="pkg-card-divider" />

        {/* ── price block ── */}
        <div className="pkg-price-block">
          <div className="pkg-price-main">
            <span className="pkg-price-num">
              {Number(pkg.price).toLocaleString('ar-SA')}
            </span>
            <span className="pkg-price-currency">ر.س</span>
          </div>
          <span
            className="pkg-status"
            style={{ color: statusCfg.color, background: statusCfg.bg }}
          >
            {statusCfg.label}
          </span>
        </div>

        {/* ── description ── */}
        {pkg.description?.ar && (
          <div className="pkg-desc">{pkg.description.ar}</div>
        )}

        {/* ── stats row ── */}
        <div className="pkg-stats-row">
          <div className="pkg-stat">
            <CalendarCheck size={13} strokeWidth={1.8} color={typeCfg.color} />
            <span className="pkg-stat-val">{pkg.bookings_count}</span>
            <span className="pkg-stat-label">حجز</span>
          </div>
          <div className="pkg-stat-sep" />
          <div className="pkg-stat">
            {isOffer
              ? <Tag size={13} strokeWidth={1.8} color={typeCfg.color} />
              : <BookOpen size={13} strokeWidth={1.8} color={typeCfg.color} />}
            <span className="pkg-stat-val">{tags.length}</span>
            <span className="pkg-stat-label">{isOffer ? 'عرض' : 'تخصص'}</span>
          </div>
        </div>

        {/* ── tags ── */}
        {tags.length > 0 && (
          <div className="pkg-tags">
            {tags.slice(0, 3).map((t, i) => (
              <span key={i} className="pkg-tag"
                style={{ borderColor: typeCfg.color + '30', color: typeCfg.color, background: typeCfg.bg }}>
                {t}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="pkg-tag" style={{ color: 'var(--ink-45)' }}>
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── footer ── */}
      <div className="pkg-card-footer">
        <button
          className="btn btn-p pkg-edit-btn"
          onClick={() => onEdit(pkg)}
        >
          <Pencil size={13} strokeWidth={1.8} />
          تعديل
        </button>
        <button className="pkg-del-btn" onClick={() => onDelete(pkg.id)} title="حذف">
          <Trash2 size={14} strokeWidth={1.7} />
        </button>
      </div>

    </div>
  )
}

/* ── Main Page ────────────────────────────── */
export default function Packages() {
  const { showToast }                      = useToast()
  const { data: packages = [], isLoading } = usePackages()
  const deletePkg                          = useDeletePackage()

  const [search, setSearch]     = useState('')
  const [typeFilter, setType]   = useState('all')
  const [statusFilter, setStatus] = useState('all')
  const [newOpen, setNewOpen]   = useState(false)
  const [editPkg, setEditPkg]   = useState(null)

  async function handleDelete(id) {
    if (!confirm('هل تريد حذف الباقة؟')) return
    try {
      await deletePkg.mutateAsync(id)
      showToast('تم حذف الباقة', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحذف', 'error')
    }
  }

  const filtered = useMemo(() => {
    return packages.filter(p => {
      const q = search.trim().toLowerCase()
      const matchSearch = !q ||
        p.name?.ar?.toLowerCase().includes(q) ||
        p.name?.en?.toLowerCase().includes(q)
      const matchType   = typeFilter === 'all'   || p.type   === typeFilter
      const matchStatus = statusFilter === 'all' || p.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [packages, search, typeFilter, statusFilter])

  const activeCount  = packages.filter(p => p.status === 'active').length
  const totalRevenue = packages.reduce((s, p) => s + (Number(p.price) || 0), 0)
  const totalBookings = packages.reduce((s, p) => s + (Number(p.bookings_count) || 0), 0)

  return (
    <div className="page-fade">

      {/* ── Header ── */}
      <div className="page-head">
        <div>
          <h1>الباقات</h1>
          <div className="sub">{packages.length} باقة</div>
        </div>
        <button className="btn btn-p" onClick={() => setNewOpen(true)}>
          <Plus size={15} strokeWidth={2} />
          باقة جديدة
        </button>
      </div>

      {/* ── KPIs ── */}
      <div className="pkg-kpi-row">
        {[
          {
            label: 'إجمالي الباقات',
            value: packages.length,
            color: '#7C3AED',
            bg:    'rgba(124,58,237,0.1)',
            icon:  <Package2 size={20} strokeWidth={1.5} />,
          },
          {
            label: 'باقات نشطة',
            value: activeCount,
            color: '#0F6B5C',
            bg:    'rgba(15,107,92,0.1)',
            icon:  <Package2 size={20} strokeWidth={1.5} />,
          },
          {
            label: 'إجمالي الحجوزات',
            value: totalBookings,
            color: '#2563EB',
            bg:    'rgba(37,99,235,0.1)',
            icon:  <CalendarCheck size={20} strokeWidth={1.5} />,
          },
          {
            label: 'إجمالي الأسعار',
            value: totalRevenue.toLocaleString('ar-SA'),
            color: '#D97706',
            bg:    'rgba(217,119,6,0.1)',
            icon:  <Coins size={20} strokeWidth={1.5} />,
          },
        ].map(k => (
          <div key={k.label} className="pkg-kpi">
            <div className="pkg-kpi-icon" style={{ background: k.bg, color: k.color }}>
              {k.icon}
            </div>
            <div className="pkg-kpi-body">
              <span className="pkg-kpi-val" style={{ color: k.color }}>{k.value}</span>
              <span className="pkg-kpi-label">{k.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="pkg-filters">
        <input
          className="inp"
          style={{ flex: 1, minWidth: 200, maxWidth: 320 }}
          placeholder="ابحث بالاسم..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { v: 'all',            l: 'الكل'    },
            { v: 'specialization', l: 'تخصص'    },
            { v: 'offer',          l: 'عرض'     },
          ].map(f => (
            <button
              key={f.v}
              className={`btn ${typeFilter === f.v ? 'btn-p' : 'btn-q'}`}
              style={{ padding: '6px 14px', fontSize: 12 }}
              onClick={() => setType(f.v)}
            >
              {f.l}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { v: 'all',      l: 'الكل'    },
            { v: 'active',   l: 'نشط'    },
            { v: 'inactive', l: 'متوقف'  },
          ].map(f => (
            <button
              key={f.v}
              className={`btn ${statusFilter === f.v ? 'btn-p' : 'btn-q'}`}
              style={{ padding: '6px 14px', fontSize: 12 }}
              onClick={() => setStatus(f.v)}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <SkeletonTable rows={3} cols={3} />
      ) : filtered.length === 0 ? (
        <div className="pkg-empty">
          <div className="pkg-empty-icon">
            <Package2 size={28} strokeWidth={1.4} />
          </div>
          <p>{search ? 'لا توجد نتائج للبحث' : 'لا توجد باقات بعد'}</p>
          {!search && (
            <button className="btn btn-p" onClick={() => setNewOpen(true)}>
              <Plus size={14} strokeWidth={2} />
              أضف أول باقة
            </button>
          )}
        </div>
      ) : (
        <div className="pkg-grid">
          {filtered.map(p => (
            <PackageCard
              key={p.id}
              pkg={p}
              onEdit={setEditPkg}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <NewPackageModal open={newOpen} onClose={() => setNewOpen(false)} />
      <PackageEditModal open={!!editPkg} pkg={editPkg} onClose={() => setEditPkg(null)} />
    </div>
  )
}
