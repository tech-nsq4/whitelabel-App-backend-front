import { useState, useMemo } from 'react'
import DoctorStats from './components/DoctorStats'
import DoctorFilters from './components/DoctorFilters'
import DoctorTable from './components/DoctorTable'
import NewDoctorModal from './components/NewDoctorModal'
import { useToast } from '../../components/ui/Toast'
import { useDoctors, useDeleteDoctor } from '../../hooks/queries/useDoctors'
import { useSpecializations } from '../../hooks/queries/useSpecializations'
import { SkeletonTable } from '../../components/ui/Skeleton'

export default function Doctors() {
  const { showToast } = useToast()

  const [search, setSearch]             = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [modalOpen, setModalOpen]       = useState(false)

  const { data: doctors = [], isLoading } = useDoctors()
  const { data: specializations = [] }    = useSpecializations()
  const deleteDoctor                      = useDeleteDoctor()

  const specialtyFilters = useMemo(() => [
    { id: 'all', label: 'الكل' },
    ...specializations.map((s) => ({ id: s.id, label: s.title?.ar || s.title })),
  ], [specializations])

  async function handleDelete(id) {
    try {
      await deleteDoctor.mutateAsync(id)
      showToast('تم حذف الطبيب بنجاح')
    } catch (err) {
      showToast(err.response?.data?.message || 'فشل الحذف', 'error')
    }
  }

  const filtered = useMemo(() => {
    return doctors.filter((doc) => {
      const matchFilter = activeFilter === 'all' ||
        doc.specializations?.some((s) => String(s.id) === String(activeFilter))
      const q = search.trim().toLowerCase()
      const matchSearch = !q ||
        (doc.name?.ar || '').toLowerCase().includes(q) ||
        doc.specializations?.some((s) => (s.title?.ar || '').toLowerCase().includes(q))
      return matchFilter && matchSearch
    })
  }, [search, activeFilter, doctors])

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>الأطباء</h1>
          <div className="sub">{doctors.length} طبيب</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-q" onClick={() => showToast('جاري تصدير البيانات...')}>
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

      <DoctorStats totalDoctors={doctors.length} />

      <DoctorFilters
        search={search}
        activeFilter={activeFilter}
        onSearchChange={setSearch}
        onFilterChange={setActiveFilter}
        specialtyFilters={specialtyFilters}
      />

      {isLoading
        ? <SkeletonTable rows={6} cols={5} />
        : <DoctorTable doctors={filtered} onDelete={handleDelete} onRefresh={() => {}} />
      }

      <NewDoctorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => { showToast('تم إضافة الطبيب بنجاح'); setModalOpen(false) }}
      />
    </div>
  )
}