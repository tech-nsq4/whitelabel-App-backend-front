import { useClinics } from '../../../hooks/queries/useClinics'
import { useDoctors } from '../../../hooks/queries/useDoctors'
import { useSpecializations } from '../../../hooks/queries/useSpecializations'
import './OfferModal.css'

const today = new Date().toISOString().slice(0, 10)

export const OFFER_INITIAL = {
  nameAr: '', nameEn: '',
  descAr: '', descEn: '',
  discount_type: 'percentage',
  discount_value: '',
  max_discount_amount: '',
  scope: 'all',
  starts_at: today,
  ends_at: '',
  max_uses: '',
  max_uses_per_user: 1,
  auto_stop: true,
  show_on_home: false,
  status: 'active',
  clinic_ids: [],
  doctor_ids: [],
  specialization_ids: [],
}

export function buildOfferPayload(form) {
  return {
    name: { ar: form.nameAr, en: form.nameEn || form.nameAr },
    description: { ar: form.descAr, en: form.descEn || form.descAr },
    discount_type: form.discount_type,
    discount_value: Number(form.discount_value),
    max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : null,
    scope: form.scope,
    starts_at: form.starts_at,
    ends_at: form.ends_at || null,
    max_uses: form.max_uses ? Number(form.max_uses) : null,
    max_uses_per_user: Number(form.max_uses_per_user) || 1,
    auto_stop: form.auto_stop,
    show_on_home: form.show_on_home,
    status: form.status,
    clinic_ids:         form.scope === 'clinics'         ? form.clinic_ids         : [],
    doctor_ids:         form.scope === 'doctors'         ? form.doctor_ids         : [],
    specialization_ids: form.scope === 'specializations' ? form.specialization_ids : [],
  }
}

export function offerToForm(offer) {
  return {
    nameAr: offer.name?.ar || '',
    nameEn: offer.name?.en || '',
    descAr: offer.description?.ar || '',
    descEn: offer.description?.en || '',
    discount_type: offer.discount_type || 'percentage',
    discount_value: offer.discount_value || '',
    max_discount_amount: offer.max_discount_amount || '',
    scope: offer.scope || 'all',
    starts_at: offer.starts_at || today,
    ends_at: offer.ends_at || '',
    max_uses: offer.max_uses || '',
    max_uses_per_user: offer.max_uses_per_user || 1,
    auto_stop: offer.auto_stop ?? true,
    show_on_home: offer.show_on_home ?? false,
    status: offer.status || 'active',
    clinic_ids: offer.clinic_ids || [],
    doctor_ids: offer.doctor_ids || [],
    specialization_ids: offer.specialization_ids || [],
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

export default function OfferForm({ form, set }) {
  const { data: clinics = [] }         = useClinics()
  const { data: doctors = [] }         = useDoctors()
  const { data: specializations = [] } = useSpecializations()

  return (
    <>
      <div className="field-row">
        <div className="field">
          <label className="field-label">اسم العرض (عربي)</label>
          <input className="inp" value={form.nameAr} onChange={e => set('nameAr', e.target.value)} placeholder="مثال: خصم الافتتاح" />
        </div>
        <div className="field">
          <label className="field-label">اسم العرض (إنجليزي)</label>
          <input className="inp" dir="ltr" value={form.nameEn} onChange={e => set('nameEn', e.target.value)} placeholder="Opening discount" />
        </div>
      </div>

      <div className="field">
        <label className="field-label">الوصف</label>
        <textarea className="inp" rows={2} value={form.descAr} onChange={e => set('descAr', e.target.value)} placeholder="وصف العرض..." />
      </div>

      <div className="field">
        <label className="field-label">نوع الخصم</label>
        <div className="discount-type-group">
          {[{ v: 'percentage', l: 'نسبة مئوية %' }, { v: 'fixed', l: 'خصم ثابت ج.م' }, { v: 'special_price', l: 'سعر خاص' }].map(o => (
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
        {form.discount_type === 'percentage' && (
          <div className="field">
            <label className="field-label">حد أقصى للخصم (ج.م) - اختياري</label>
            <input className="inp num" dir="ltr" type="number" min={0} value={form.max_discount_amount} onChange={e => set('max_discount_amount', e.target.value)} placeholder="100" />
          </div>
        )}
      </div>

      <div className="field">
        <label className="field-label">نطاق العرض</label>
        <select className="inp" value={form.scope} onChange={e => set('scope', e.target.value)}>
          <option value="all">كل العيادات</option>
          <option value="clinics">عيادات محددة</option>
          <option value="doctors">أطباء محددون</option>
          <option value="specializations">تخصصات محددة</option>
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
          <label className="field-label">الحد الأقصى للاستخدام (اختياري)</label>
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
          <option value="inactive">متوقف</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
        <Toggle label="إيقاف تلقائي عند انتهاء الاستخدام" checked={form.auto_stop} onChange={() => set('auto_stop', !form.auto_stop)} />
        <Toggle label="عرض على الصفحة الرئيسية" checked={form.show_on_home} onChange={() => set('show_on_home', !form.show_on_home)} />
      </div>
    </>
  )
}
