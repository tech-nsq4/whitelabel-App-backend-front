import { useState } from 'react'
import BranchCard from './components/BranchCard'
import BranchDetailsModal from './components/BranchDetailsModal'
import BranchEditModal from './components/BranchEditModal'
import NewBranchModal from './components/NewBranchModal'
import { branches as initialBranches } from './branches.data'
import { useToast } from '../../components/ui/Toast'
import './Branches.css'

export default function Branches() {
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [branchList, setBranchList] = useState(initialBranches)
  const [detailsBranch, setDetailsBranch] = useState(null)
  const [editingBranch, setEditingBranch] = useState(null)

  function handleAddBranch(data) {
    if (!data.name.trim()) {
      showToast('من فضلك اكتب اسم الفرع أولاً')
      return
    }

    const newBranch = {
      id: Date.now(),
      name: data.name.trim(),
      city: data.city,
      address: data.address.trim() || 'لم يتم إدخال عنوان الفرع',
      phone: data.phone.trim() || 'لم يتم إدخال رقم الهاتف',
      status: data.status === 'نشط' ? 'active' : 'inactive',
      manager: data.manager,
      openTime: data.openTime,
      closeTime: data.closeTime,
      clinics: 0,
      doctors: 0,
      patients: 0,
      revenue: '0',
      toastLabel: `عرض تفاصيل ${data.name.trim()}`,
    }

    setBranchList((current) => [...current, newBranch])
    showToast('تم إضافة الفرع بنجاح')
    setModalOpen(false)
  }

  return (
    <div className="branches-page" style={{ animation: 'fadeIn .3s ease' }}>
      {/* Page header */}
      <div className="page-head">
        <div>
          <h1>الفروع</h1>
          <div className="sub">{branchList.length} فروع · إجمالي 18 عيادة و24 طبيباً</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-p" onClick={() => setModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 5.5v13M5.5 12h13"/>
            </svg>
            فرع جديد
          </button>
        </div>
      </div>

      {/* Branch cards grid */}
      <div className="row c3 branches-grid" style={{ marginBottom: 0 }}>
        {branchList.map((branch) => (
          <BranchCard key={branch.id} branch={branch} onDetails={setDetailsBranch} onEdit={setEditingBranch} />
        ))}
      </div>

      {/* New Branch Modal */}
      <NewBranchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddBranch}
      />
      <BranchDetailsModal branch={detailsBranch} onClose={() => setDetailsBranch(null)} />
      <BranchEditModal
        branch={editingBranch}
        onClose={() => setEditingBranch(null)}
        onSave={(updatedBranch) => { setBranchList((current) => current.map((branch) => branch.id === updatedBranch.id ? updatedBranch : branch)); setEditingBranch(null); showToast('تم تحديث بيانات الفرع') }}
      />
    </div>
  )
}
