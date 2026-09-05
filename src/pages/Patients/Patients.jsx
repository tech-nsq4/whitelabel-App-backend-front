import { useState, useMemo } from 'react'
import PatientStats from './components/PatientStats'
import PatientFilters from './components/PatientFilters'
import PatientTable from './components/PatientTable'
import NewPatientModal from './components/NewPatientModal'
import { usePatients, useCreatePatient } from '../../hooks/queries/usePatients'
import { useToast } from '../../components/ui/Toast'
import './Patients.css'

export default function Patients() {
  const { showToast } = useToast()

  const [search, setSearch]         = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen]   = useState(false)

  const { data: patientList = [], isLoading } = usePatients()
  const createPatient = useCreatePatient()

  // client-side filter (no server-side search param in this API)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return patientList
    return patientList.filter((p) => {
      const name  = (p.name  ?? '').toLowerCase()
      const phone = (p.phone ?? '').toLowerCase()
      const email = (p.email ?? '').toLowerCase()
      return name.includes(q) || phone.includes(q) || email.includes(q)
    })
  }, [search, patientList])

  function handleSearchChange(val) {
    setSearch(val)
    setCurrentPage(1)
  }

  function handleNewPatient(data) {
    createPatient.mutate(data, {
      onSuccess: () => { showToast('تم إضافة المريض بنجاح'); setModalOpen(false) },
      onError:   (err) => {
        const msg = err?.response?.data?.message
          ?? Object.values(err?.response?.data?.errors ?? {})?.[0]?.[0]
          ?? 'حدث خطأ أثناء إضافة المريض'
        showToast(msg)
      },
    })
  }

  return (
    <div className="patients-page page-fade">
      <div className="page-head">
        <div>
          <h1>المرضى</h1>
          <div className="sub">
            {isLoading ? 'جاري التحميل...' : `إجمالي ${patientList.length.toLocaleString('ar-SA')} مريض مسجل`}
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-q" onClick={() => showToast('جاري تصدير البيانات...')}>
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
            إضافة مريض جديد
          </button>
        </div>
      </div>

      <PatientStats patients={patientList} isLoading={isLoading} />

      <PatientFilters
        search={search}
        onSearchChange={handleSearchChange}
      />

      <PatientTable
        patients={filtered}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />

      <NewPatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewPatient}
        isLoading={createPatient.isPending}
      />
    </div>
  )
}