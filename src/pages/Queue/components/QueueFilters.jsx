export default function QueueFilters({ clinics = [], clinicFilter, onClinicChange }) {
  return (
    <div className="queue-filters">
      <div className="filter-bar">
        <div
          className={`filter-chip${clinicFilter === 'all' ? ' active' : ''}`}
          onClick={() => onClinicChange('all')}
        >
          جميع العيادات
        </div>
        {clinics.map(c => (
          <div
            key={c.id}
            className={`filter-chip${String(clinicFilter) === String(c.id) ? ' active' : ''}`}
            onClick={() => onClinicChange(c.id)}
          >
            {c.name?.ar || c.name}
          </div>
        ))}
      </div>
    </div>
  )
}
