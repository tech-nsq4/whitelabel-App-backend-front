import { useState, useMemo } from 'react'
import DoctorStats from './components/DoctorStats'
import DoctorFilters from './components/DoctorFilters'
import DoctorTable from './components/DoctorTable'
import NewDoctorModal from './components/NewDoctorModal'
import { doctors } from './doctors.data'
import { useToast } from '../../components/ui/Toast'

export default function Doctors() {
  const { showToast } = useToast()

  const [search, setSearch]           = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [modalOpen, setModalOpen]     = useState(false)

  const filtered = useMemo(() => {
    return doctors.filter((doc) => {
      const matchFilter =
        activeFilter === 'all' || doc.specialtyId === activeFilter

      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        doc.name.includes(q) ||
        doc.specialty.includes(q)

      return matchFilter && matchSearch
    })
  }, [search, activeFilter])

  function handleFilterChange(id) {
    setActiveFilter(id)
  }

  function handleSearchChange(val) {
    setSearch(val)
  }

  function handleNewDoctor(data) {
    showToast('تم إضافة الطبيب بنجاح')
    setModalOpen(false)
  }

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-head">
        <div>
          <h1>الأطباء</h1>
          <div className="sub">24 طبيباً موزعين على 8 تخصصات و3 فروع</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-q" onClick={() => showToast('جارٍ تصدير البيانات...')}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 15V4M12 15l-4-4M12 15l4-4"/>
              <path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17"/>
            </svg>
            تصدير
          </button>
          <button className="btn btn-p" onClick={() => setModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 5.5v13M5.5 12h13"/>
            </svg>
            طبيب جديد
          </button>
        </div>
      </div>

      <DoctorStats />

      <DoctorFilters
        search={search}
        activeFilter={activeFilter}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />

      <DoctorTable doctors={filtered} />

      <NewDoctorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewDoctor}
      />
    </div>
  )
}
