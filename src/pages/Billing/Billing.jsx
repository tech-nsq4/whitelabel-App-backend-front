import { useState } from 'react'
import BillingStats from './components/BillingStats'
import InvoiceTable from './components/InvoiceTable'
import NewInvoiceModal from './components/NewInvoiceModal'
import { invoices } from './billing.data'
import { useToast } from '../../components/ui/Toast'

export default function Billing() {
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)

  function handleNewInvoice(data) {
    showToast('تم إنشاء الفاتورة بنجاح')
    setModalOpen(false)
  }

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>الفواتير والمدفوعات</h1>
          <div className="sub">قائمة تفصيلية بالفواتير الحالية</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-q" onClick={() => showToast('جاري تصدير الفواتير...')}>
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
            فاتورة جديدة
          </button>
        </div>
      </div>

      <BillingStats />

      <InvoiceTable invoices={invoices} />

      <NewInvoiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewInvoice}
      />
    </div>
  )
}