import { useState } from 'react'
import StaffStats from './components/StaffStats'
import StaffTable from './components/StaffTable'
import NewStaffModal from './components/NewStaffModal'
import { staffMembers } from './staff.data'
import { useToast } from '../../components/ui/Toast'

export default function Staff() {
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)

  function handleNewStaff(data) {
    showToast('تم إضافة المستخدم بنجاح')
    setModalOpen(false)
  }

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-head">
        <div>
          <h1>المستخدمون والصلاحيات</h1>
          <div className="sub">إدارة حسابات الموظفين وأدوارهم</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-p" onClick={() => setModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 5.5v13M5.5 12h13"/>
            </svg>
            مستخدم جديد
          </button>
        </div>
      </div>

      <StaffStats />

      <StaffTable members={staffMembers} />

      <NewStaffModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewStaff}
      />
    </div>
  )
}
