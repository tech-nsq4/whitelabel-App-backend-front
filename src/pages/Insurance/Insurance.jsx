import { useState } from 'react'
import InsuranceStats from './components/InsuranceStats'
import InsuranceTable from './components/InsuranceTable'
import NewInsuranceModal from './components/NewInsuranceModal'
import { insuranceCompanies } from './insurance.data'
import { useToast } from '../../components/ui/Toast'

export default function Insurance() {
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)

  function handleNewInsurance(data) {
    showToast('تم إضافة شركة التأمين')
    setModalOpen(false)
  }

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>التأمين</h1>
          <div className="sub">قائمة شركات التأمين المعتمدة</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-p" onClick={() => setModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 5.5v13M5.5 12h13"/>
            </svg>
            شركة جديدة
          </button>
        </div>
      </div>

      <InsuranceStats />

      <InsuranceTable companies={insuranceCompanies} />

      <NewInsuranceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewInsurance}
      />
    </div>
  )
}