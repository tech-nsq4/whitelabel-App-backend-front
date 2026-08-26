import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import BranchCard from './components/BranchCard'
import ClinicDetailsPage from './components/ClinicDetailsPage'
import BranchEditModal from './components/BranchEditModal'
import NewBranchModal from './components/NewBranchModal'
import { useToast } from '../../components/ui/Toast'
import { SkeletonCards } from '../../components/ui/Skeleton'
import { useClinics, useCreateClinic, useUpdateClinic, useDeleteClinic } from '../../hooks/queries/useClinics'
import { useDoctors } from '../../hooks/queries/useDoctors'
import './Branches.css'

export default function Branches() {
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalOpen, setModalOpen]       = useState(false)
  const [editingBranch, setEditingBranch] = useState(null)

  const selectedClinicId = searchParams.get('clinic')

  const { data: branchList = [], isLoading: loading } = useClinics()
  const { data: allDoctors = [] } = useDoctors()
  const createClinic = useCreateClinic()
  const updateClinic = useUpdateClinic()
  const deleteClinic = useDeleteClinic()

  // find selected clinic object from URL param
  const selectedClinic = useMemo(
    () => branchList.find(c => String(c.id) === selectedClinicId) || null,
    [branchList, selectedClinicId]
  )

  function openClinic(clinic) {
    setSearchParams({ clinic: String(clinic.id) })
  }

  function closeClinic() {
    setSearchParams({})
  }

  // count doctors per clinic
  const doctorsCountMap = useMemo(() => {
    const map = {}
    allDoctors.forEach(d => {
      if (d.clinic_id) map[d.clinic_id] = (map[d.clinic_id] || 0) + 1
    })
    return map
  }, [allDoctors])

  // group clinics by city
  const grouped = useMemo(() => {
    const map = {}
    branchList.forEach(clinic => {
      const cityAr  = clinic.location?.city?.name?.ar || 'غير محدد'
      const cityId  = clinic.location?.city?.id || 0
      const key     = cityId
      if (!map[key]) map[key] = { cityAr, cityId, clinics: [] }
      map[key].clinics.push({
        ...clinic,
        doctorsCount: doctorsCountMap[clinic.id] || 0,
      })
    })
    return Object.values(map)
  }, [branchList, doctorsCountMap])

  async function handleAddBranch(data) {
    if (!data.name?.trim()) return showToast('من فضلك اكتب اسم العيادة أولاً')
    try {
      await createClinic.mutateAsync({
        name: { ar: data.name, en: data.name },
        address: { ar: data.address || '', en: data.address || '' },
        location_id: data.location_id || null,
        lat: 0, lng: 0,
      })
      showToast('تم إضافة العيادة بنجاح')
      setModalOpen(false)
    } catch { showToast('تعذر إضافة العيادة', 'error') }
  }

  async function handleEditBranch(updatedBranch) {
    try {
      await updateClinic.mutateAsync({
        id: updatedBranch.id,
        data: {
          name: { ar: updatedBranch.name?.ar || updatedBranch.name, en: updatedBranch.name?.en || updatedBranch.name },
          address: { ar: updatedBranch.address?.ar || updatedBranch.address || '', en: updatedBranch.address?.en || updatedBranch.address || '' },
          location_id: updatedBranch.location_id,
        }
      })
      setEditingBranch(null)
      showToast('تم تحديث بيانات العيادة')
    } catch { showToast('تعذر تحديث العيادة', 'error') }
  }

  async function handleDelete(id) {
    try {
      await deleteClinic.mutateAsync(id)
      showToast('تم حذف العيادة')
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحذف', 'error')
    }
  }

  return (
    <div className="branches-page" style={{ animation: 'fadeIn .3s ease' }}>
      {selectedClinic ? (
        <ClinicDetailsPage clinic={selectedClinic} onBack={closeClinic} />
      ) : (
        <>
          <div className="page-head">
            <div>
              <h1>الفروع</h1>
              <div className="sub">{grouped.length} فرع · {branchList.length} عيادة</div>
            </div>
            <div className="page-actions">
              <button className="btn btn-p" onClick={() => setModalOpen(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 5.5v13M5.5 12h13"/></svg>
                فرع جديد
              </button>
            </div>
          </div>

          {loading
            ? <SkeletonCards count={3} />
            : <div className="row c3 branches-grid" style={{ marginBottom: 0 }}>
                {grouped.map((group) => (
                  <BranchCard
                    key={group.cityId}
                    group={group}
                    onDetails={openClinic}
                    onEdit={setEditingBranch}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
          }
        </>
      )}

      <NewBranchModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddBranch} />
      <BranchEditModal branch={editingBranch} onClose={() => setEditingBranch(null)} onSave={handleEditBranch} />
    </div>
  )
}
