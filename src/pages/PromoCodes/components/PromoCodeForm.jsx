import { useClinics } from '../../../hooks/queries/useClinics'
import { useDoctors } from '../../../hooks/queries/useDoctors'
import { useSpecializations } from '../../../hooks/queries/useSpecializations'
import './PromoCodeModal.css'

const today = new Date().toISOString().slice(0, 10)

export const PROMO_INITIAL = {
  code: '', discount_type: 'percentage', discount_value: '',
  scope: 'all', starts_at: today, ends_at: '',
  max_uses: '', max_uses_per_user: 1, min_amount: '',
  auto_stop: true, status: 'active',
  clinic_ids: [], doctor_ids: [], specialization_ids: [],
}

export function buildPromoPayload(form) {
  return {
    code:               form.code.toUpperCase(),
    discount_type:      form.discount_type,
    discount_value:     Number(form.discount_value),
    scope:              form.scope,
    starts_at:          form.starts_at,
    ends_at:            form.ends_at || null,
    max_uses:           form.max_uses ? Number(form.max_uses) : null,
    max_uses_per_user:  Number(form.max_uses_per_user) || 1,
    min_amount:         form.min_amount ? Number(form.min_amount) : null,
    auto_stop:          form.auto_stop,
    status:             form.status,
    clinic_ids:         form.scope === 'clinics'         ? form.clinic_ids         : [],
    doctor_ids:         form.scope === 'doctors'         ? form.doctor_ids         : [],
    specialization_ids: form.scope === 'specializations' ? form.specialization_ids : [],
  }
}

export function promoToForm(p) {
  return {
    code:               p.code || '',
    discount_type:      p.discount_type || 'percentage',
    discount_value:     p.discount_value || '',
    scope:              p.scope || 'all',
    starts_at:          p.starts_at || today,
    ends_at:            p.ends_at || '',
    max_uses:           p.max_uses || '',
    max_uses_per_user:  p.max_uses_per_user || 1,
    min_amount:         p.min_amount || '',
    auto_stop:          p.auto_stop ?? true,
    status:             p.status || 'active',
    clinic_ids:         p.clinic_ids || [],
    doctor_ids:         p.doctor_ids || [],
    specialization_ids: p.specialization_ids || [],
  }
}

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

function MultiSelect({ label, options, selected, onChange }) {
  function toggle(id) {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])
  }
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="multiselect-group">
        {options.map(o => (
          <button key={o.id} type="button" className={`multiselect-btn${selected.includes(o.id) ? ' active' : ''}`} onClick={() => toggle(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function PromoCodeForm({ form, set }) {
  const { data: clinics = [] }         = useClinics()
  const { data: doctors = [] }         = useDoctors()
  const { data: specializations = [] } = useSpecializations()

  return (
    <>
      <div className="field">
        <label className="field-label">كود الخصم</label>
        <input className="inp promo-code-inp" dir="ltr" placeholder="SAVE20"
          value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} />
      </div>

      <div className="field">
        <label className="field-label">نوع الخصم</label>
        <div className="discount-type-group">
          {[{ v: 'percentage', l: 'نسبة %' }, { v: 'fixed', l: 'خصم ثابت' }, { v: 'special_price', l: 'سعر خاص' }].map(o => (
            <button key={o.v} type="button" className={`discount-type-btn${form.discount_type === o.v ? ' active' : ''}`} onClick={() => set('discount_type', o.v)}>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">{form.discount_type === 'percentage' ? 'نسبة الخصم (%)' : 'قيمة الخصم (ج.م)'}</label>
          <input className="inp num" dir="ltr" type="number" min={0} value={form.discount_value} onChange={e => set('discount_value', e.target.value)} placeholder="20" />
        </div>
        <div className="field">
          <label className="field-label">الحد الأدنى للطلب (اختياري)</label>
          <input className="inp num" dir="ltr" type="number" min={0} value={form.min_amount} onChange={e => set('min_amount', e.target.value)} placeholder="200" />
        </div>
      </div>

      <div className="field">
        <label className="field-label">نطاق الكود</label>
        <select className="inp" value={form.scope} onChange={e => set('scope', e.target.value)}>
          <option value="all">كل العيادات</option>
          <option value="clinics">عيادات محددة</option>
          <option value="doctors">أطباء محددون</option>
          <option value="specializations">تخصصات محددة</option>
          <option value="first_visit">الزيارة الأولى</option>
        </select>
      </div>

      {form.scope === 'clinics' && (
        <MultiSelect label="العيادات" selected={form.clinic_ids} onChange={v => set('clinic_ids', v)}
          options={clinics.map(c => ({ id: c.id, label: c.name?.ar || c.name }))} />
      )}
      {form.scope === 'doctors' && (
        <MultiSelect label="الأطباء" selected={form.doctor_ids} onChange={v => set('doctor_ids', v)}
          options={doctors.map(d => ({ id: d.id, label: d.name?.ar || d.name }))} />
      )}
      {form.scope === 'specializations' && (
        <MultiSelect label="التخصصات" selected={form.specialization_ids} onChange={v => set('specialization_ids', v)}
          options={specializations.map(s => ({ id: s.id, label: s.title?.ar || s.title }))} />
      )}

      <div className="field-row">
        <div className="field">
          <label className="field-label">تاريخ البداية</label>
          <input className="inp" type="date" value={form.starts_at} onChange={e => set('starts_at', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">تاريخ الانتهاء (اختياري)</label>
          <input className="inp" type="date" value={form.ends_at} onChange={e => set('ends_at', e.target.value)} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">الحد الأقصى للاستخدام</label>
          <input className="inp num" dir="ltr" type="number" min={1} value={form.max_uses} onChange={e => set('max_uses', e.target.value)} placeholder="غير محدود" />
        </div>
        <div className="field">
          <label className="field-label">الحد لكل مستخدم</label>
          <input className="inp num" dir="ltr" type="number" min={1} value={form.max_uses_per_user} onChange={e => set('max_uses_per_user', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">الحالة</label>
        <select className="inp" value={form.status} onChange={e => set('status', e.target.value)}>
          <option value="active">نشط</option>
          <option value="paused">متوقف مؤقتاً</option>
          <option value="inactive">غير نشط</option>
        </select>
      </div>

      <Toggle label="إيقاف تلقائي عند انتهاء الاستخدام" checked={form.auto_stop} onChange={() => set('auto_stop', !form.auto_stop)} />
    </>
  )
}
