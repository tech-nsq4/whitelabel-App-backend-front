import { useState, useMemo } from 'react'
import PatientStats from './components/PatientStats'
import PatientFilters from './components/PatientFilters'
import PatientTable from './components/PatientTable'
import NewPatientModal from './components/NewPatientModal'
import { patients as initialPatients } from './patients.data'
import { useToast } from '../../components/ui/Toast'
import './Patients.css'

const TOTAL_COUNT = 3241

export default function Patients() {
  const { showToast } = useToast()

  const [search, setSearch]           = useState('')
  const [patientList, setPatientList] = useState(initialPatients)
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen]     = useState(false)

  const filtered = useMemo(() => {
    return patientList.filter((p) => {
      const matchFilter =
        activeFilter === 'all' ||
        p.status === activeFilter

      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        p.name.includes(q) ||
        p.fileNo.includes(q) ||
        p.idNo.includes(q)

      return matchFilter && matchSearch
    })
  }, [search, activeFilter, patientList])

  function handleFilterChange(id) {
    setActiveFilter(id)
    setCurrentPage(1)
  }

  function handleSearchChange(val) {
    setSearch(val)
    setCurrentPage(1)
  }

  function handleNewPatient(data) {
    showToast('تم تسجيل المريض بنجاح')
    setModalOpen(false)
  }

  return (
    <div className="patients-page" style={{ animation: 'fadeIn .3s ease' }}>
      {/* Page header */}
      <div className="page-head">
        <div>
          <h1>المرضى</h1>
          <div className="sub">إجمالي 3,241 مريضاً مسجلاً في المجمع</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-q" onClick={() => showToast('جارٍ تصدير البيانات...')}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 15V4M12 15l-4-4M12 15l4-4"/>
              <path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17"/>
            </svg>
            تصدير البيانات
          </button>
          <button className="btn btn-p" onClick={() => setModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 5.5v13M5.5 12h13"/>
            </svg>
            تسجيل مريض جديد
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <PatientStats />

      {/* Search + Filters */}
      <PatientFilters
        search={search}
        activeFilter={activeFilter}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />

      {/* Table + Pagination */}
      <PatientTable
        patients={filtered}
        currentPage={currentPage}
        totalCount={TOTAL_COUNT}
        onPageChange={setCurrentPage}
        onUpdate={(updatedPatient) => setPatientList((current) => current.map((patient) => patient.id === updatedPatient.id ? updatedPatient : patient))}
      />

      {/* New Patient Modal */}
      <NewPatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewPatient}
      />
    </div>
  )
}
