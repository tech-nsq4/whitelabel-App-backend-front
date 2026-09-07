import { useRef } from "react";

export default function ServiceFilters({
  search,
  activeFilter,
  onSearchChange,
  onFilterChange,
  specialtyFilters = [],
}) {
  const scrollRef = useRef(null);

  function scroll(dir) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -160 : 160, behavior: 'smooth' });
    }
  }

  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--surface-subtle)", border: "1.5px solid var(--line)",
          borderRadius: 10, padding: "7px 12px", flexShrink: 0, width: 210,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" stroke="var(--ink-45)" fill="none" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
          </svg>
          <input
            style={{ border: "none", background: "transparent", outline: "none", fontSize: 12.5, color: "var(--ink)", width: "100%" }}
            placeholder="ابحث بالاسم أو رمز الخدمة..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div style={{ width: 1, height: 26, background: "var(--line)", flexShrink: 0 }} />

        {/* Prev button */}
        <button onClick={() => scroll('right')} style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: 8,
          border: "1.5px solid var(--line)", background: "var(--card)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--ink-45)",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        {/* Chips row */}
        <div ref={scrollRef} style={{
          display: "flex", gap: 6, alignItems: "center",
          overflow: "hidden", flex: 1,
        }}>
          {specialtyFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 500,
                cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                border: activeFilter === f.id ? "1.5px solid var(--brand)" : "1.5px solid var(--line)",
                background: activeFilter === f.id ? "var(--sand)" : "var(--card)",
                color: activeFilter === f.id ? "var(--brand)" : "var(--ink-70)",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button onClick={() => scroll('left')} style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: 8,
          border: "1.5px solid var(--line)", background: "var(--card)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--ink-45)",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>

      </div>
    </div>
  );
}
