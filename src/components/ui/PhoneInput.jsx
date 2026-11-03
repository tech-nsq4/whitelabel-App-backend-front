/**
 * PhoneInput — Saudi phone field
 * Sends: 5XXXXXXXXX (9 digits, no prefix) to the backend
 * Displays: +966 prefix for UX clarity
 */

const DISPLAY_PREFIX = '+966'

/** Normalize any phone value to bare 9-digit local number */
export function normalizeSaudiPhone(value = '') {
  if (!value) return ''
  const v = String(value).trim()
  let digits = v.replace(/[^\d]/g, '')
  if (digits.startsWith('966')) digits = digits.slice(3)
  if (digits.startsWith('0')) digits = digits.slice(1)
  return digits.slice(0, 9)
}

export default function PhoneInput({ value = '', onChange, id, className = '', placeholder = '5XXXXXXXX', hasError }) {
  const local = normalizeSaudiPhone(value)

  function handleChange(e) {
    const raw = e.target.value.replace(/[^\d]/g, '')
    const trimmed = raw.slice(0, 9)
    onChange(trimmed)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      <span style={{
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 13,
        color: 'var(--ink-45)',
        pointerEvents: 'none',
        fontVariantNumeric: 'tabular-nums',
        userSelect: 'none',
      }}>
        {DISPLAY_PREFIX}
      </span>
      <input
        id={id}
        dir="ltr"
        type="tel"
        inputMode="numeric"
        className={`inp num${hasError ? ' inp--error' : ''}${className ? ' ' + className : ''}`}
        style={{ paddingRight: 52, textAlign: 'left' }}
        placeholder={placeholder}
        value={local}
        onChange={handleChange}
      />
    </div>
  )
}
