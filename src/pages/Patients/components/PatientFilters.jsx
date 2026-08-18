import { statusFilters } from '../patients.data'

export default function PatientFilters({ search, activeFilter, onSearchChange, onFilterChange }) {
  return (
    <div className="panel patients-filters" style={{ marginBottom: 16 }}>
      <div className="patients-filters-inner">
        {/* Inline search box — styled same as HTML original */}
        <div className="search-box patients-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>
          </svg>
          <input
            placeholder="ابحث بالاسم أو رقم الملف أو الهوية..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status filter chips */}
        <div className="filter-bar" style={{ margin: 0, flex: 1 }}>
          <div className="filter-chip" onClick={() => {}}>
            <svg width="13" height="13" viewBox="0 0 24 24">
              <path d="M4 4h16l-6 8v6l-4 2v-8L4 4z"/>
            </svg>
            تصفية
          </div>
          {statusFilters.map((f) => (
            <div
              key={f.id}
              className={`filter-chip${activeFilter === f.id ? ' active' : ''}`}
              onClick={() => onFilterChange(f.id)}
            >
              {f.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
