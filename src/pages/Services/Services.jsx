import { useState, useMemo } from 'react'
import ServiceStats from './components/ServiceStats'
import ServiceFilters from './components/ServiceFilters'
import ServiceTable from './components/ServiceTable'
import NewServiceModal from './components/NewServiceModal'
import { useToast } from '../../components/ui/Toast'
import { useSpecializations } from '../../hooks/queries/useSpecializations'
import { useSubSpecializations } from '../../hooks/queries/useSpecializations'

export default function Services() {
  const { showToast } = useToast()
  const [search, setSearch]             = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [modalOpen, setModalOpen]       = useState(false)

  const { data: specializations = [], isLoading: loadingSpecs } = useSpecializations()
  const { data: subSpecs = [], isLoading: loadingSubs, refetch } = useSubSpecializations()

  const specialtyFilters = useMemo(() => {
    // Build from actual sub-specs data to ensure only used specializations appear
    const seen = new Map()
    subSpecs.forEach(s => {
      const id = String(s.specialization_id)
      if (!seen.has(id) && s.specialization) {
        seen.set(id, s.specialization?.title?.ar || s.specialization?.title || id)
      }
    })
    // Fall back to all specializations if sub-specs not loaded yet
    const fromSpecs = specializations.map(s => ({ id: String(s.id), label: s.title?.ar || s.title }))
    const list = seen.size > 0
      ? Array.from(seen, ([id, label]) => ({ id, label }))
      : fromSpecs
    return [{ id: 'all', label: 'كل التخصصات' }, ...list]
  }, [subSpecs, specializations])

  const services = useMemo(() => subSpecs.map(s => ({
    id:          s.id,
    code:        `SVC-${String(s.id).padStart(3, '0')}`,
    name:        s.title?.ar || '',
    nameEn:      s.title?.en || '',
    specialty:   s.specialization?.title?.ar || '—',
    specialtyId: String(s.specialization_id),
    description: s.description?.ar || '',
    status:      'active',
  })), [subSpecs])

  const filtered = useMemo(() => services.filter(svc => {
    const matchFilter = activeFilter === 'all' || svc.specialtyId === activeFilter
    const q = search.trim().toLowerCase()
    const matchSearch = !q || svc.name.toLowerCase().includes(q) || svc.code.toLowerCase().includes(q) || svc.specialty.toLowerCase().includes(q)
    return matchFilter && matchSearch
  }), [services, search, activeFilter])

  function handleNewService() {
    setModalOpen(false)
    refetch()
  }

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>الخدمات الطبية</h1>
          <div className="sub">قائمة الخدمات المتوفرة حسب التخصص</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-p" onClick={() => setModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5.5v13M5.5 12h13"/>
            </svg>
            خدمة جديدة
          </button>
        </div>
      </div>

      <ServiceStats totalServices={services.length} totalSpecialties={specializations.length} />

      <div style={{ marginTop: 16 }}>
        <ServiceFilters
          search={search}
          activeFilter={activeFilter}
          onSearchChange={setSearch}
          onFilterChange={setActiveFilter}
          specialtyFilters={specialtyFilters}
        />
      </div>

      <ServiceTable services={filtered} loading={loadingSpecs || loadingSubs} onRefresh={refetch} />

      <NewServiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewService}
      />
    </div>
  )
}
