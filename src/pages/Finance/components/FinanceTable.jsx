import { useState } from 'react'
import FinanceDetailsModal from './FinanceDetailsModal'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }
function FileIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" {...S}><path d="M13.5 3H6.5A1.5 1.5 0 005 4.5v15A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V8.5z"/><path d="M13.5 3v5.5H19"/></svg> }

const DISCOUNT_BADGE = {
  promo_code: { label: 'كود خصم', bg: 'rgba(44,109,170,0.1)',  color: 'var(--info)' },
  offer:      { label: 'عرض',     bg: 'rgba(201,162,39,0.1)', color: 'var(--warn)' },
}

export default function FinanceTable({ invoices = [] }) {
  const [modal, setModal] = useState({ open: false, invoice: null })

  return (
    <>
      <div className="panel">
        <table className="data">
          <thead>
            <tr>
              <th>#</th>
              <th>المريض</th>
              <th>الطبيب</th>
              <th>العيادة</th>
              <th>التاريخ</th>
              <th>المبلغ</th>
              <th>الخصم</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const discount = inv.has_discount ? DISCOUNT_BADGE[inv.discount_source] : null
              return (
                <tr key={inv.id}>
                  <td>
                    <span className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)' }}>
                      #{inv.appointment_id}
                    </span>
                  </td>
                  <td>
                    <div className="td-name">{inv.user?.name || inv.user?.phone}</div>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-70)' }}>{inv.doctor?.name?.ar}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-70)' }}>{inv.clinic?.name?.ar}</td>
                  <td className="num" style={{ fontSize: 12.5 }}>{inv.date}</td>
                  <td>
                    <span className="num" style={{ fontWeight: 700, fontSize: 13 }}>{inv.amount}</span>
                    <span style={{ color: 'var(--ink-45)', fontSize: 11, marginRight: 3 }}>ر.س</span>
                  </td>
                  <td>
                    {discount ? (
                      <span style={{ fontSize: 11.5, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: discount.bg, color: discount.color }}>
                        {discount.label}
                      </span>
                    ) : (
                      <span style={{ fontSize: 11.5, color: 'var(--ink-45)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setModal({ open: true, invoice: inv })} aria-label="عرض">
                      <FileIcon />
                    </button>
                  </td>
                </tr>
              )
            })}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-45)', fontSize: 13 }}>
                  لا توجد فواتير
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FinanceDetailsModal
        open={modal.open}
        onClose={() => setModal({ open: false, invoice: null })}
        invoice={modal.invoice}
      />
    </>
  )
}
