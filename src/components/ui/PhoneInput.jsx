/**
 * PhoneInput — Saudi phone field (+966)
 * Stores the full value including +966 prefix in the form state.
 * Displays only the local part (after +966) for editing.
 * Normalizes incoming values that may already contain +966 or 00966.
 */

const PREFIX = '+966'

/** Normalize any phone value to always start with +966 */
export function normalizeSaudiPhone(value = '') {
  if (!value) return ''
  const v = String(value).trim()
  if (v.startsWith('+966')) return v
  if (v.startsWith('00966')) return '+966' + v.slice(5)
  if (v.startsWith('0')) return '+966' + v.slice(1)
  // bare number like 566677788
  return PREFIX + v
}

export default function PhoneInput({ value = '', onChange, id, className = '', placeholder = '5X XXX XXXX', hasError }) {
  // Normalize incoming value and strip prefix for display
  const normalized = normalizeSaudiPhone(value)
  const local = normalized.startsWith(PREFIX) ? normalized.slice(PREFIX.length).trimStart() : normalized

  function handleChange(e) {
    // Allow only digits and spaces
    const raw = e.target.value.replace(/[^\d\s]/g, '')
    const trimmed = raw.trimStart().slice(0, 13)
    onChange(trimmed ? `${PREFIX}${trimmed}` : '')
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
        {PREFIX}
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
