import { useState } from 'react'
import { useSplashes, useDeleteSplash } from '../../hooks/queries/useSplashes'
import { useToast } from '../../components/ui/Toast'
import SplashFormModal from './components/SplashFormModal'
import './Splashes.css'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }
function EditIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" {...S}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
function TrashIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" {...S}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg> }

const TYPE_CFG = {
  user:     { label: 'مستخدم',    color: '#fff', bg: '#2C6DAA' },
  provider: { label: 'مزود خدمة', color: '#fff', bg: '#7C3AED' },
}

function SplashCard({ splash, onEdit, onDelete }) {
  const cfg = TYPE_CFG[splash.type] || TYPE_CFG.user
  return (
    <div className="sp-card">
      {/* Image */}
      <div className="sp-card__img">
        {splash.image
          ? <img src={splash.image} alt={splash.title?.ar} />
          : <div className="sp-card__no-img">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--ink-25)" strokeWidth="1.4" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
        }
        <span className="sp-card__badge" style={{ background: cfg.bg }}>{cfg.label}</span>
      </div>

      {/* Info */}
      <div className="sp-card__info">
        <div className="sp-card__title">{splash.title?.ar || '—'}</div>
        {splash.title?.en && <div className="sp-card__en" dir="ltr">{splash.title.en}</div>}
        {splash.description?.ar && <div className="sp-card__desc">{splash.description.ar}</div>}
      </div>

      {/* Footer */}
      <div className="sp-card__footer">
        <span className="sp-card__date">
          {splash.created_at ? new Date(splash.created_at).toLocaleDateString('ar-EG') : ''}
        </span>
        <div className="sp-card__btns">
          <button className="sp-btn sp-btn--edit" title="تعديل" onClick={() => onEdit(splash)}>
            <EditIcon />
          </button>
          <button className="sp-btn sp-btn--del" title="حذف" onClick={() => onDelete(splash.id)}>
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="sp-card sp-card--sk">
      <div className="sp-card__img sp-sk" />
      <div className="sp-card__info">
        <div className="sp-sk" style={{ height: 14, width: '65%', borderRadius: 6, marginBottom: 8 }} />
        <div className="sp-sk" style={{ height: 12, width: '45%', borderRadius: 6, marginBottom: 6 }} />
        <div className="sp-sk" style={{ height: 11, width: '80%', borderRadius: 6 }} />
      </div>
      <div className="sp-card__footer">
        <div className="sp-sk" style={{ height: 11, width: 60, borderRadius: 6 }} />
      </div>
    </div>
  )
}

export default function Splashes() {
  const { showToast } = useToast()
  const { data: splashes = [], isLoading } = useSplashes()
  const deleteSplash = useDeleteSplash()
  const [formOpen, setFormOpen]     = useState(false)
  const [editSplash, setEditSplash] = useState(null)

  function openNew()   { setEditSplash(null); setFormOpen(true) }
  function openEdit(s) { setEditSplash(s);    setFormOpen(true) }
  function closeForm() { setFormOpen(false);  setEditSplash(null) }

  async function handleDelete(id) {
    if (!confirm('هل تريد حذف هذه الشاشة؟')) return
    try {
      await deleteSplash.mutateAsync(id)
      showToast('تم الحذف', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحذف', 'error')
    }
  }

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>شاشات البداية</h1>
          <div className="sub">{splashes.length} شاشة</div>
        </div>
        <button className="btn btn-p" onClick={openNew}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          إضافة شاشة
        </button>
      </div>

      {isLoading ? (
        <div className="sp-grid">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : splashes.length === 0 ? (
        <div className="sp-empty">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--ink-25)" strokeWidth="1.2" strokeLinecap="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <line x1="9" y1="7" x2="15" y2="7"/>
            <line x1="9" y1="11" x2="15" y2="11"/>
            <line x1="9" y1="15" x2="12" y2="15"/>
          </svg>
          <p>لا توجد شاشات بداية حتى الآن</p>
          <button className="btn btn-p" onClick={openNew}>إضافة أول شاشة</button>
        </div>
      ) : (
        <div className="sp-grid">
          {splashes.map(s => (
            <SplashCard key={s.id} splash={s} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <SplashFormModal open={formOpen} onClose={closeForm} splash={editSplash} />
    </div>
  )
}
