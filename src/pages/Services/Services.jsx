import { useState, useMemo, useEffect } from 'react'
import ServiceStats from './components/ServiceStats'
import ServiceFilters from './components/ServiceFilters'
import ServiceTable from './components/ServiceTable'
import NewServiceModal from './components/NewServiceModal'
import { useToast } from '../../components/ui/Toast'
import { getSpecializationsApi } from '../../api/specializations.api'
import { getSubSpecializationsApi } from '../../api/sub-specializations.api'

export default function Services() {
  const { showToast } = useToast()

  const [search, setSearch]             = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [modalOpen, setModalOpen]       = useState(false)
  const [specialtyFilters, setSpecialtyFilters] = useState([{ id: 'all', label: 'كل التخصصات' }])
  const [services, setServices]         = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    getSpecializationsApi()
      .then(({ data }) => {
        const list = data.data || []
        setSpecialtyFilters([
          { id: 'all', label: 'كل التخصصات' },
          ...list.map((s) => ({ id: s.id, label: s.title?.ar || s.title })),
        ])
        // Fetch sub-specializations for each specialization
        return Promise.all(list.map((s) => getSubSpecializationsApi(s.id)))
      })
      .then((results) => {
        const allSubs = results.flatMap((r) => r.data?.data || [])
        setServices(allSubs.map((s) => ({
          id: s.id,
          code: `SVC-${String(s.id).padStart(3, '0')}`,
          name: s.title?.ar || '',
          nameEn: s.title?.en || '',
          specialty: s.specialization?.title?.ar || '',
          specialtyId: s.specialization_id,
          description: s.description?.ar || '',
          status: 'active',
          priceCash: null,
          priceInsurance: null,
          doctors: null,
        })))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return services.filter((svc) => {
      const matchFilter = activeFilter === 'all' || String(svc.specialtyId) === String(activeFilter)
      const q = search.trim().toLowerCase()
      const matchSearch = !q || svc.name.toLowerCase().includes(q) || svc.code.toLowerCase().includes(q) || svc.specialty.toLowerCase().includes(q)
      return matchFilter && matchSearch
    })
  }, [search, activeFilter, services])

  function handleNewService() {
    showToast('تم إضافة الخدمة بنجاح')
    setModalOpen(false)
  }

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-head">
        <div>
          <h1>الخدمات والأسعار</h1>
          <div className="sub">إدارة كتالوج الخدمات الطبية وأسعارها</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-q" onClick={() => showToast('جارٍ تصدير الكتالوج...')}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 15V4M12 15l-4-4M12 15l4-4"/>
              <path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17"/>
            </svg>
            تصدير الكتالوج
          </button>
          <button className="btn btn-p" onClick={() => setModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 5.5v13M5.5 12h13"/>
            </svg>
            خدمة جديدة
          </button>
        </div>
      </div>

      <ServiceStats totalServices={services.length} totalSpecialties={specialtyFilters.length - 1} />

      <div style={{ marginTop: 16 }}>
        <ServiceFilters
          search={search}
          activeFilter={activeFilter}
          onSearchChange={setSearch}
          onFilterChange={setActiveFilter}
          specialtyFilters={specialtyFilters}
        />
      </div>

      <ServiceTable services={filtered} loading={loading} />

      <NewServiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewService}
      />
    </div>
  )
}
