import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'

/**
 * SpecSelect — Custom dropdown replacing native <select>
 * Props:
 *  - value: selected id (string)
 *  - onChange: (id: string) => void
 *  - options: [{ id, label }]
 *  - placeholder: string (default 'اختر...')
 *  - hasError: bool
 */
export default function SpecSelect({ value, onChange, options = [], placeholder = 'اختر...', hasError }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const selected = options.find(o => String(o.id) === String(value))

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', minHeight: 40, padding: '0 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--card)',
          border: `1.5px solid ${hasError ? 'var(--danger)' : open ? 'var(--brand)' : 'var(--line)'}`,
          borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13,
          color: selected ? 'var(--ink)' : 'var(--ink-25)',
          boxShadow: open
            ? '0 0 0 3px var(--focus-ring)'
            : hasError ? '0 0 0 3px rgba(179,64,47,.12)' : 'none',
          transition: 'border-color .15s, box-shadow .15s',
          textAlign: 'right', fontFamily: 'inherit',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={15} strokeWidth={2}
          style={{ color: 'var(--ink-45)', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0, marginRight: 6 }}
        />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, left: 0, zIndex: 400,
          background: 'var(--card)', border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)', boxShadow: '0 12px 32px rgba(10,31,27,.12)',
          maxHeight: 220, overflowY: 'auto',
        }}>
          {options.length === 0 && (
            <div style={{ padding: '12px 14px', fontSize: 12.5, color: 'var(--ink-45)' }}>لا توجد خيارات</div>
          )}
          {options.map(o => {
            const active = String(o.id) === String(value)
            return (
              <div
                key={o.id}
                onClick={() => { onChange(String(o.id)); setOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', fontSize: 13, cursor: 'pointer',
                  background: active ? 'rgba(15,107,92,.06)' : 'none',
                  color: active ? 'var(--brand-d)' : 'var(--ink)',
                  fontWeight: active ? 600 : 400,
                  borderBottom: '1px solid var(--line)',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--paper)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(15,107,92,.06)' : 'none' }}
              >
                <span>{o.label}</span>
                {active && <Check size={14} strokeWidth={2.5} style={{ color: 'var(--brand)', flexShrink: 0 }} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
