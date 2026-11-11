import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useUpdateLoyaltySetting } from '../../../hooks/queries/useLoyaltySettings'

/* ── Toggle ──────────────────────────────── */
function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle-switch-label">
      <div className={`toggle-switch ${checked ? 'on' : 'off'}`} onClick={onChange}>
        <div className="toggle-switch-knob" />
      </div>
      {label}
    </label>
  )
}

/* ── Section wrapper ─────────────────────── */
function Section({ title, children }) {
  return (
    <div className="loyalty-form-section">
      {title && <div className="loyalty-form-section-title">{title}</div>}
      {children}
    </div>
  )
}

/* ── NotifyBlock ─────────────────────────── */
function NotifyBlock({ statusKey, messageKey, data, set, label = 'إشعار' }) {
  return (
    <div className="loyalty-notify-row">
      <Toggle
        label={`تفعيل ${label}`}
        checked={!!data[statusKey]}
        onChange={() => set(statusKey, !data[statusKey])}
      />
      {data[statusKey] && (
        <div className="field">
          <label className="field-label">نص الإشعار</label>
          <textarea
            className="inp"
            rows={2}
            style={{ resize: 'vertical' }}
            value={data[messageKey] || ''}
            onChange={e => set(messageKey, e.target.value)}
            placeholder="اكتب نص الإشعار..."
          />
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════
   slug-specific form renderers
══════════════════════════════════════════ */

function BuyOfferForm({ data, set }) {
  return (
    <>
      <Section title="الإعدادات">
        <div className="field">
          <label className="field-label">نسبة الكاش باك (%)</label>
          <input
            className="inp num"
            dir="ltr"
            type="number"
            min={0}
            max={100}
            value={data.cashback_percentage ?? 0}
            onChange={e => set('cashback_percentage', Number(e.target.value))}
          />
        </div>
      </Section>
      <Section title="الإشعارات">
        <NotifyBlock
          statusKey="buy_notification_status"
          messageKey="buy_notification_message"
          data={data}
          set={set}
          label="إشعار الشراء"
        />
      </Section>
    </>
  )
}

function RegistrationForm({ data, set }) {
  return (
    <>
      <Section title="الإعدادات">
        <div className="field">
          <label className="field-label">نقاط التسجيل</label>
          <input
            className="inp num"
            dir="ltr"
            type="number"
            min={0}
            value={data.registeration_points ?? 0}
            onChange={e => set('registeration_points', Number(e.target.value))}
          />
        </div>
      </Section>
      <Section title="الإشعارات">
        <div className="field">
          <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>إشعار ما قبل التسجيل</label>
          <NotifyBlock
            statusKey="before_register_notification_status"
            messageKey="before_register_notification_message"
            data={data}
            set={set}
            label="إشعار ما قبل التسجيل"
          />
        </div>
        <div className="field" style={{ marginTop: 10 }}>
          <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>إشعار بعد التسجيل</label>
          <NotifyBlock
            statusKey="register_notification_status"
            messageKey="register_notification_message"
            data={data}
            set={set}
            label="إشعار التسجيل"
          />
        </div>
      </Section>
    </>
  )
}

function ReviewForm({ data, set }) {
  return (
    <>
      <Section title="الإعدادات">
        <div className="field">
          <label className="field-label">نقاط التقييم</label>
          <input
            className="inp num"
            dir="ltr"
            type="number"
            min={0}
            value={data.review_points ?? 0}
            onChange={e => set('review_points', Number(e.target.value))}
          />
        </div>
      </Section>
      <Section title="الإشعارات">
        <div className="field">
          <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>إشعار ما قبل التقييم</label>
          <NotifyBlock
            statusKey="before_review_notification_status"
            messageKey="before_review_notification_message"
            data={data}
            set={set}
            label="إشعار ما قبل التقييم"
          />
        </div>
        <div className="field" style={{ marginTop: 10 }}>
          <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>إشعار بعد التقييم</label>
          <NotifyBlock
            statusKey="review_notification_status"
            messageKey="review_notification_message"
            data={data}
            set={set}
            label="إشعار التقييم"
          />
        </div>
      </Section>
    </>
  )
}

const SOCIAL_ICONS = {
  instagram: '📸',
  tiktok:    '🎵',
  snapchat:  '👻',
  facebook:  '📘',
}

function SocialMediaForm({ data, set }) {
  function setSocialLink(website, link) {
    set('social_links', (data.social_links || []).map(sl =>
      sl.website === website ? { ...sl, link } : sl
    ))
  }

  return (
    <>
      <Section title="الإعدادات">
        <div className="field">
          <label className="field-label">نقاط المتابعة</label>
          <input
            className="inp num"
            dir="ltr"
            type="number"
            min={0}
            value={data.follow_points ?? 0}
            onChange={e => set('follow_points', Number(e.target.value))}
          />
        </div>
      </Section>
      <Section title="روابط السوشيال ميديا">
        {(data.social_links || []).map(sl => (
          <div key={sl.website} className="loyalty-social-row">
            <span className="loyalty-social-label">
              {SOCIAL_ICONS[sl.website] || '🔗'} {sl.website}
            </span>
            <input
              className="inp"
              dir="ltr"
              type="url"
              placeholder={`https://${sl.website}.com/...`}
              value={sl.link || ''}
              onChange={e => setSocialLink(sl.website, e.target.value)}
            />
          </div>
        ))}
      </Section>
      <Section title="الإشعارات">
        <NotifyBlock
          statusKey="notification_status"
          messageKey="notification_message"
          data={data}
          set={set}
          label="الإشعار"
        />
      </Section>
    </>
  )
}

function GiftPointsForm({ data, set }) {
  return (
    <>
      <Section title="الإعدادات">
        <div className="field-row">
          <div className="field">
            <label className="field-label">نقاط الهدايا</label>
            <input
              className="inp num"
              dir="ltr"
              type="number"
              min={0}
              value={data.gift_points ?? 0}
              onChange={e => set('gift_points', Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label className="field-label">تاريخ إعادة الضبط</label>
            <input
              className="inp"
              type="date"
              value={data.gift_reset_date || ''}
              onChange={e => set('gift_reset_date', e.target.value || null)}
            />
          </div>
        </div>
        <div className="field">
          <label className="field-label">تاريخ التفعيل</label>
          <input
            className="inp"
            type="date"
            value={data.activated_at || ''}
            onChange={e => set('activated_at', e.target.value || null)}
          />
        </div>
      </Section>
      <Section title="الإشعارات">
        <NotifyBlock
          statusKey="notification_status"
          messageKey="notification_message"
          data={data}
          set={set}
          label="الإشعار"
        />
      </Section>
    </>
  )
}

function BookingServiceForm({ data, set }) {
  return (
    <>
      <Section title="الإعدادات">
        <div className="field">
          <label className="field-label">نقاط الحجز</label>
          <input
            className="inp num"
            dir="ltr"
            type="number"
            min={0}
            value={data.booking_points ?? 0}
            onChange={e => set('booking_points', Number(e.target.value))}
          />
        </div>
      </Section>
      <Section title="الإشعارات">
        <div className="field">
          <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>إشعار ما قبل الحجز</label>
          <NotifyBlock
            statusKey="before_booking_notification_status"
            messageKey="before_booking_notification_message"
            data={data}
            set={set}
            label="إشعار ما قبل الحجز"
          />
        </div>
        <div className="field" style={{ marginTop: 10 }}>
          <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>إشعار بعد الحجز</label>
          <NotifyBlock
            statusKey="booking_notification_status"
            messageKey="booking_notification_message"
            data={data}
            set={set}
            label="إشعار الحجز"
          />
        </div>
      </Section>
    </>
  )
}

function ReferralForm({ data, set }) {
  return (
    <>
      <Section title="الإعدادات">
        <div className="field-row">
          <div className="field">
            <label className="field-label">نقاط المُحيل</label>
            <input
              className="inp num"
              dir="ltr"
              type="number"
              min={0}
              value={data.referrer_points ?? 0}
              onChange={e => set('referrer_points', Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label className="field-label">نقاط المُحال</label>
            <input
              className="inp num"
              dir="ltr"
              type="number"
              min={0}
              value={data.referred_points ?? 0}
              onChange={e => set('referred_points', Number(e.target.value))}
            />
          </div>
        </div>
      </Section>
      <Section title="الإشعارات">
        <NotifyBlock
          statusKey="notification_status"
          messageKey="notification_message"
          data={data}
          set={set}
          label="الإشعار"
        />
      </Section>
    </>
  )
}

/* ── form registry ───────────────────────── */
const SLUG_FORMS = {
  buy_offer:          BuyOfferForm,
  registeration:      RegistrationForm,
  appointment_review: ReviewForm,
  social_media:       SocialMediaForm,
  gift_points:        GiftPointsForm,
  booking_service:    BookingServiceForm,
  referral:           ReferralForm,
}

/* ══════════════════════════════════════════
   LoyaltySettingModal
══════════════════════════════════════════ */
export default function LoyaltySettingModal({ open, setting, onClose }) {
  const { showToast } = useToast()
  const update        = useUpdateLoyaltySetting()
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (setting) setData({ ...(setting.data || {}) })
  }, [setting])

  function set(key, value) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await update.mutateAsync({ id: setting.id, data })
      showToast('تم حفظ الإعدادات بنجاح', 'success')
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحفظ', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!setting) return null

  const FormComponent = SLUG_FORMS[setting.slug]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={setting.name?.ar || setting.slug}
      subtitle={setting.name?.en}
    >
      {FormComponent
        ? <FormComponent data={data} set={set} />
        : (
          <div className="field">
            <p style={{ color: 'var(--ink-45)', fontSize: 13 }}>
              لا توجد إعدادات قابلة للتعديل لهذا البرنامج.
            </p>
          </div>
        )
      }

      <div className="modal-footer">
        <button className="btn btn-q" onClick={onClose} disabled={saving}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>
    </Modal>
  )
}
