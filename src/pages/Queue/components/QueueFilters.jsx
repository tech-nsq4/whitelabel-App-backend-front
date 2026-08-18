import { clinicFilters, branchFilters } from '../queue.data'

export default function QueueFilters({ activeClinic, activeBranch, onClinicChange, onBranchChange }) {
  return (
    <div className="queue-filters">
      <div className="filter-bar">
      {clinicFilters.map((f) => (
        <div
          key={f.id}
          className={`filter-chip${activeClinic === f.id ? ' active' : ''}`}
          onClick={() => onClinicChange(f.id)}
        >
          {f.label}
        </div>
      ))}

      <div style={{ width: 1, height: 26, background: 'var(--line)', margin: '0 8px' }} />

      {branchFilters.map((f) => (
        <div
          key={f.id}
          className={`filter-chip${activeBranch === f.id ? ' active' : ''}`}
          onClick={() => onBranchChange(f.id)}
        >
          {f.label}
        </div>
      ))}
      </div>
    </div>
  )
}
