import { useState } from 'react'
import {
  Gift, Star, Share2, UserPlus, Tag, Repeat2, BookOpen,
  Coins, ToggleLeft, ToggleRight, Settings2,
  LayoutGrid, CheckCircle2, XCircle,
} from 'lucide-react'
import {
  useLoyaltySettings,
  useToggleLoyaltySetting,
  usePointPrice,
} from '../../hooks/queries/useLoyaltySettings'
import { useToast } from '../../components/ui/Toast'
import { SkeletonTable } from '../../components/ui/Skeleton'
import LoyaltySettingModal from './components/LoyaltySettingModal'
import PointPriceModal from './components/PointPriceModal'
import './LoyaltySettings.css'

/* ── slug config ──────────────────────────── */
const SLUG_META = {
  buy_offer: {
    icon:  <Tag size={20} strokeWidth={1.6} />,
    color: '#7C3AED',
    bg:    'rgba(124,58,237,0.12)',
    bar:   'linear-gradient(90deg,#7C3AED,#A855F7)',
  },
  registeration: {
    icon:  <UserPlus size={20} strokeWidth={1.6} />,
    color: '#2563EB',
    bg:    'rgba(37,99,235,0.1)',
    bar:   'linear-gradient(90deg,#2563EB,#60A5FA)',
  },
  appointment_review: {
    icon:  <Star size={20} strokeWidth={1.6} />,
    color: '#D97706',
    bg:    'rgba(217,119,6,0.1)',
    bar:   'linear-gradient(90deg,#D97706,#FBBF24)',
  },
  social_media: {
    icon:  <Share2 size={20} strokeWidth={1.6} />,
    color: '#0891B2',
    bg:    'rgba(8,145,178,0.1)',
    bar:   'linear-gradient(90deg,#0891B2,#22D3EE)',
  },
  gift_points: {
    icon:  <Gift size={20} strokeWidth={1.6} />,
    color: '#DB2777',
    bg:    'rgba(219,39,119,0.1)',
    bar:   'linear-gradient(90deg,#DB2777,#F472B6)',
  },
  booking_service: {
    icon:  <BookOpen size={20} strokeWidth={1.6} />,
    color: '#0F6B5C',
    bg:    'rgba(15,107,92,0.1)',
    bar:   'linear-gradient(90deg,#0F6B5C,#34D399)',
  },
  referral: {
    icon:  <Repeat2 size={20} strokeWidth={1.6} />,
    color: '#EA580C',
    bg:    'rgba(234,88,12,0.1)',
    bar:   'linear-gradient(90deg,#EA580C,#FB923C)',
  },
}

function getMeta(slug) {
  return SLUG_META[slug] || {
    icon:  <Coins size={20} strokeWidth={1.6} />,
    color: '#6B7280',
    bg:    'rgba(107,114,128,0.1)',
    bar:   'linear-gradient(90deg,#6B7280,#9CA3AF)',
  }
}

/* ── summary helpers ──────────────────────── */
function getSummary(setting) {
  const d = setting.data || {}
  const lines = []
  if (d.cashback_percentage  !== undefined) lines.push(`كاش باك ${d.cashback_percentage}%`)
  if (d.registeration_points !== undefined) lines.push(`${d.registeration_points} نقطة`)
  if (d.review_points        !== undefined) lines.push(`${d.review_points} نقطة`)
  if (d.follow_points        !== undefined) lines.push(`${d.follow_points} نقطة`)
  if (d.gift_points          !== undefined) lines.push(`${d.gift_points} نقطة`)
  if (d.booking_points       !== undefined) lines.push(`${d.booking_points} نقطة`)
  if (d.referrer_points      !== undefined) lines.push(`مُحيل: ${d.referrer_points}`)
  if (d.referred_points      !== undefined) lines.push(`مُحال: ${d.referred_points}`)
  return lines
}

/* ── LoyaltyCard ──────────────────────────── */
function LoyaltyCard({ setting, onEdit, onToggle, toggling }) {
  const meta    = getMeta(setting.slug)
  const summary = getSummary(setting)
  const active  = setting.is_active

  return (
    <div className={`loyalty-card${active ? '' : ' loyalty-card--off'}`}>
      {/* colour bar */}
      <div className="loyalty-card-bar" style={{ background: meta.bar }} />

      <div className="loyalty-card-body">
        {/* header */}
        <div className="loyalty-card-head">
          <div className="loyalty-card-icon" style={{ background: meta.bg, color: meta.color }}>
            {meta.icon}
          </div>
          <div className="loyalty-card-info">
            <div className="loyalty-card-name">{setting.name?.ar}</div>
            <div className="loyalty-card-name-en">{setting.name?.en}</div>
          </div>
          <button
            className={`loyalty-toggle-btn ${active ? 'on' : 'off'}`}
            onClick={() => onToggle(setting.id)}
            disabled={toggling}
            title={active ? 'إيقاف' : 'تفعيل'}
          >
            {active
              ? <ToggleRight size={30} strokeWidth={1.4} />
              : <ToggleLeft  size={30} strokeWidth={1.4} />}
          </button>
        </div>

        {/* status */}
        <div
          className="loyalty-status-pill"
          style={{
            color:      active ? '#0F6B5C' : '#6B7280',
            background: active ? 'rgba(15,107,92,0.1)' : 'rgba(107,114,128,0.08)',
          }}
        >
          {active ? 'نشط' : 'متوقف'}
        </div>

        {/* summary chips */}
        {summary.length > 0 && (
          <div className="loyalty-summary">
            {summary.map((s, i) => (
              <span
                key={i}
                className="loyalty-summary-chip"
                style={{ color: meta.color, borderColor: meta.color + '30', background: meta.bg }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* footer */}
      <div className="loyalty-card-footer">
        <button className="btn btn-q loyalty-edit-btn" onClick={() => onEdit(setting)}>
          <Settings2 size={13} strokeWidth={1.7} />
          تعديل الإعدادات
        </button>
      </div>
    </div>
  )
}

/* ── Main Page ────────────────────────────── */
export default function LoyaltySettings() {
  const { showToast }                       = useToast()
  const { data: settings = [], isLoading }  = useLoyaltySettings()
  const { data: pointPrice }                = usePointPrice()
  const toggle                              = useToggleLoyaltySetting()

  const [editSetting, setEditSetting]       = useState(null)
  const [pointPriceOpen, setPointPriceOpen] = useState(false)
  const [togglingId, setTogglingId]         = useState(null)

  async function handleToggle(id) {
    setTogglingId(id)
    try {
      await toggle.mutateAsync(id)
      showToast('تم تغيير حالة البرنامج', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر تغيير الحالة', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  const activeCount   = settings.filter(s => s.is_active).length
  const inactiveCount = settings.length - activeCount

  return (
    <div className="page-fade">

      {/* ── Header ── */}
      <div className="loyalty-page-header">
        <div>
          <h1>إعدادات الولاء</h1>
          <div className="sub">{settings.length} برنامج ولاء</div>
        </div>

        <button className="loyalty-price-chip" onClick={() => setPointPriceOpen(true)}>
          <Coins size={16} strokeWidth={1.6} color="var(--brand)" />
          <div>
            <div className="loyalty-price-chip-label">سعر النقطة</div>
            <div className="loyalty-price-chip-val">{pointPrice?.value ?? '—'}</div>
          </div>
        </button>
      </div>

      {/* ── KPI row ── */}
      <div className="loyalty-kpi-row">
        {[
          {
            label: 'إجمالي البرامج',
            value: settings.length,
            color: '#7C3AED',
            bg:    'rgba(124,58,237,0.1)',
            icon:  <LayoutGrid size={20} strokeWidth={1.5} />,
          },
          {
            label: 'برامج نشطة',
            value: activeCount,
            color: '#0F6B5C',
            bg:    'rgba(15,107,92,0.1)',
            icon:  <CheckCircle2 size={20} strokeWidth={1.5} />,
          },
          {
            label: 'برامج متوقفة',
            value: inactiveCount,
            color: '#6B7280',
            bg:    'rgba(107,114,128,0.1)',
            icon:  <XCircle size={20} strokeWidth={1.5} />,
          },
        ].map(k => (
          <div key={k.label} className="loyalty-kpi">
            <div className="loyalty-kpi-icon" style={{ background: k.bg, color: k.color }}>
              {k.icon}
            </div>
            <div className="loyalty-kpi-body">
              <span className="loyalty-kpi-val" style={{ color: k.color }}>{k.value}</span>
              <span className="loyalty-kpi-label">{k.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className="loyalty-section-label">برامج الولاء</div>

      {isLoading ? (
        <SkeletonTable rows={3} cols={3} />
      ) : (
        <div className="loyalty-grid">
          {settings.map(s => (
            <LoyaltyCard
              key={s.id}
              setting={s}
              onEdit={setEditSetting}
              onToggle={handleToggle}
              toggling={togglingId === s.id}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <LoyaltySettingModal
        open={!!editSetting}
        setting={editSetting}
        onClose={() => setEditSetting(null)}
      />

      <PointPriceModal
        open={pointPriceOpen}
        onClose={() => setPointPriceOpen(false)}
      />
    </div>
  )
}
