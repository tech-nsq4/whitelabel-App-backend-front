import { useSpecializations } from '../../../hooks/queries/useSpecializations'
import { useOffers } from '../../../hooks/queries/useOffers'

export const PACKAGE_INITIAL = {
  name_ar:            '',
  name_en:            '',
  description_ar:     '',
  description_en:     '',
  type:               'specialization',
  bookings_count:     '',
  price:              '',
  status:             'active',
  specialization_ids: [],
  offer_ids:          [],
}

export function buildPackagePayload(form) {
  return {
    name:        { ar: form.name_ar, en: form.name_en },
    description: { ar: form.description_ar, en: form.description_en },
    type:               form.type,
    bookings_count:     Number(form.bookings_count) || 0,
    price:              Number(form.price) || 0,
    status:             form.status,
    specialization_ids: form.type === 'specialization' ? form.specialization_ids : [],
    offer_ids:          form.type === 'offer'          ? form.offer_ids          : [],
  }
}

export function packageToForm(pkg) {
  return {
    name_ar:            pkg.name?.ar            || '',
    name_en:            pkg.name?.en            || '',
    description_ar:     pkg.description?.ar     || '',
    description_en:     pkg.description?.en     || '',
    type:               pkg.type                || 'specialization',
    bookings_count:     pkg.bookings_count       ?? '',
    price:              pkg.price               ?? '',
    status:             pkg.status              || 'active',
    specialization_ids: pkg.specialization_ids  || [],
    offer_ids:          pkg.offer_ids           || [],
  }
}

/* ── MultiSelect ──────────────────────────── */
function MultiSelect({ label, options, selected, onChange }) {
  function toggle(id) {
    onChange(selected.includes(id)
      ? selected.filter(x => x !== id)
      : [...selected, id])
  }
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {options.length === 0
        ? <p style={{ fontSize: 12, color: 'var(--ink-45)' }}>لا توجد عناصر</p>
        : (
          <div className="pkg-multiselect">
            {options.map(o => (
              <button
                key={o.id}
                type="button"
                className={`pkg-multiselect-btn${selected.includes(o.id) ? ' active' : ''}`}
                onClick={() => toggle(o.id)}
              >
                {selected.includes(o.id) && (
                  <svg width="10" height="10" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="3" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
                {o.label}
              </button>
            ))}
          </div>
        )
      }
    </div>
  )
}

/* ── PackageForm ──────────────────────────── */
export default function PackageForm({ form, set, errors = {} }) {
  const { data: specializations = [] } = useSpecializations()
  const { data: offers = [] }          = useOffers()

  return (
    <>
      {/* Names */}
      <div className="field-row">
        <div className="field">
          <label className="field-label">اسم الباقة (عربي)</label>
          <input
            className={`inp${errors.name_ar ? ' inp--error' : ''}`}
            placeholder="باقة جلدية"
            value={form.name_ar}
            onChange={e => set('name_ar', e.target.value)}
          />
          {errors.name_ar && <span className="field-error">{errors.name_ar}</span>}
        </div>
        <div className="field">
          <label className="field-label">Package Name (English)</label>
          <input
            className={`inp${errors.name_en ? ' inp--error' : ''}`}
            dir="ltr"
            placeholder="Dermatology Package"
            value={form.name_en}
            onChange={e => set('name_en', e.target.value)}
          />
          {errors.name_en && <span className="field-error">{errors.name_en}</span>}
        </div>
      </div>

      {/* Descriptions */}
      <div className="field-row">
        <div className="field">
          <label className="field-label">الوصف (عربي)</label>
          <textarea
            className="inp"
            rows={2}
            style={{ resize: 'vertical' }}
            placeholder="وصف الباقة..."
            value={form.description_ar}
            onChange={e => set('description_ar', e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">Description (English)</label>
          <textarea
            className="inp"
            dir="ltr"
            rows={2}
            style={{ resize: 'vertical' }}
            placeholder="Package description..."
            value={form.description_en}
            onChange={e => set('description_en', e.target.value)}
          />
        </div>
      </div>

      {/* Type */}
      <div className="field">
        <label className="field-label">نوع الباقة</label>
        <div className="pkg-type-group">
          {[
            { v: 'specialization', l: 'تخصص' },
            { v: 'offer',          l: 'عرض'   },
          ].map(o => (
            <button
              key={o.v}
              type="button"
              className={`pkg-type-btn${form.type === o.v ? ' active' : ''}`}
              onClick={() => set('type', o.v)}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* Price + Bookings */}
      <div className="field-row">
        <div className="field">
          <label className="field-label">السعر (ر.س)</label>
          <input
            className={`inp num${errors.price ? ' inp--error' : ''}`}
            dir="ltr"
            type="number"
            min={0}
            step="0.01"
            placeholder="499.50"
            value={form.price}
            onChange={e => set('price', e.target.value)}
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>
        <div className="field">
          <label className="field-label">عدد الحجوزات</label>
          <input
            className={`inp num${errors.bookings_count ? ' inp--error' : ''}`}
            dir="ltr"
            type="number"
            min={0}
            placeholder="5"
            value={form.bookings_count}
            onChange={e => set('bookings_count', e.target.value)}
          />
          {errors.bookings_count && <span className="field-error">{errors.bookings_count}</span>}
        </div>
      </div>

      {/* Status */}
      <div className="field">
        <label className="field-label">الحالة</label>
        <div className="pkg-type-group">
          {[
            { v: 'active',   l: 'نشط'    },
            { v: 'inactive', l: 'متوقف'  },
          ].map(o => (
            <button
              key={o.v}
              type="button"
              className={`pkg-type-btn${form.status === o.v ? ' active' : ''}`}
              onClick={() => set('status', o.v)}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* Related items */}
      {form.type === 'specialization' && (
        <MultiSelect
          label="التخصصات المرتبطة"
          selected={form.specialization_ids}
          onChange={v => set('specialization_ids', v)}
          options={specializations.map(s => ({ id: s.id, label: s.title?.ar || s.title }))}
        />
      )}

      {form.type === 'offer' && (
        <MultiSelect
          label="العروض المرتبطة"
          selected={form.offer_ids}
          onChange={v => set('offer_ids', v)}
          options={offers.map(o => ({ id: o.id, label: o.name?.ar || o.title?.ar || o.name }))}
        />
      )}
    </>
  )
}
