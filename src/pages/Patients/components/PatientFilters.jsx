export default function PatientFilters({ search, onSearchChange }) {
  return (
    <div className="panel patients-filters" style={{ marginBottom: 16 }}>
      <div className="patients-filters-inner">
        <div className="search-box patients-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>
          </svg>
          <input
            placeholder="ابحث بالاسم أو الجوال أو البريد..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
