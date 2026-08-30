import { useRef } from 'react'

export default function DoctorFilters({ search, activeFilter, onSearchChange, onFilterChange, specialtyFilters = [] }) {
  const scrollRef = useRef(null)

  function scroll(dir) {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 180, behavior: 'smooth' })
  }

  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface-subtle)', border: '1.5px solid var(--line)',
          borderRadius: 10, padding: '8px 14px', width: 220, flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" stroke="var(--ink-45)" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>
          </svg>
          <input
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, color: 'var(--ink)', width: '100%' }}
            placeholder="ابحث بالاسم أو التخصص..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: 'var(--line)', flexShrink: 0 }} />

        {/* Scroll right (→ = next in RTL = positive scrollLeft) */}
        <button className="icon-btn" style={{ width: 30, height: 30, flexShrink: 0 }} onClick={() => scroll(-1)}>
          <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* Chips */}
        <div
          ref={scrollRef}
          style={{ display: 'flex', gap: 6, alignItems: 'center', overflowX: 'auto', flex: 1,
            scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {specialtyFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              style={{
                padding: '6px 14px', borderRadius: 8, flexShrink: 0,
                fontSize: 12.5, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
                border: activeFilter === f.id ? '1.5px solid var(--brand)' : '1.5px solid var(--line)',
                background: activeFilter === f.id ? 'var(--sand)' : 'var(--card)',
                color: activeFilter === f.id ? 'var(--brand)' : 'var(--ink-70)',
                transition: 'all 0.15s',
              }}
            >{f.label}</button>
          ))}
        </div>

        {/* Scroll left */}
        <button className="icon-btn" style={{ width: 30, height: 30, flexShrink: 0 }} onClick={() => scroll(1)}>
          <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

      </div>
    </div>
  )
}
