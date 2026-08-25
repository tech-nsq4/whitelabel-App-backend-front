export default function ServiceFilters({
  search,
  activeFilter,
  onSearchChange,
  onFilterChange,
  specialtyFilters = [],
}) {
  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <div
        style={{
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--surface-subtle)",
            border: "1.5px solid var(--line)",
            borderRadius: 10,
            padding: "8px 14px",
            width: 240,
            flexShrink: 0,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            stroke="var(--ink-45)"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 12.5,
              color: "var(--ink)",
              width: "100%",
            }}
            placeholder="ابحث بالاسم أو رمز الخدمة..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 28,
            background: "var(--line)",
            flexShrink: 0,
          }}
        />

        {/* Filter chips */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {specialtyFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 500,
                cursor: "pointer",
                border:
                  activeFilter === f.id
                    ? "1.5px solid var(--brand)"
                    : "1.5px solid var(--line)",
                background:
                  activeFilter === f.id ? "var(--sand)" : "var(--card)",
                color: activeFilter === f.id ? "var(--brand)" : "var(--ink-70)",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
